
const puppeteer = require('puppeteer');
const openai = require('openai');
const { PrismaClient } = require("@prisma/client")
var nlp = require('wink-nlp-utils');
const axios = require('axios');
const prompt = require('prompt-sync')();
var prisma = new PrismaClient();
//should check if it loops links
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const removeDuplicates = (text) => {
  const lines = text.split('\n'); // Split the text into lines
  const uniqueLines = [...new Set(lines)]; // Create a Set to filter out duplicates
  return uniqueLines.join('\n').trim(); // Join the unique lines back into a single string
};
const isPhoneNumber = (text) => {
  // Check for a specific pattern that represents a phone number
  
  return /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(text);

};
const extractPhoneNumbers = (text) => {
  const phoneNumberRegex = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  const phoneNumbers = text.match(phoneNumberRegex);
  return phoneNumbers || [];
};
const isMailtoLink = (url) => {
  // Check if the URL starts with 'mailto:'
  return url.toLowerCase().startsWith('mailto:');
};
const chunkPage = (page,chunklist,url) => {
  if (page.length > 14000) {
    const number = page.length/14000;
    const integerValue = Math.floor(number) + 1;
    const size = page.length/integerValue;
    for (let i = 0; i < page.length; i += size) {
      const chunk = page.substr(i, size);
      chunklist.push(`link : ${url} link content : \n ${chunk}`);
    }
  }
  else{
    chunklist.push(`link : ${url} link content : \n ${page}`);
  }
}

async function learnWebsite (url , username , wss) {
  try {
    
    
    console.log(`Processing URL: ${url}`); // Log the URL being processed

    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the URL and wait for the page to load
    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log(`Page loaded: ${url}`); // Log page load
    // Collect text content from all internal links
    
    let homepageContent = await page.evaluate(() => {
      return document.body.innerText;
    });
    homepageContent = removeDuplicates(homepageContent.trim().replace(/\s\s+/g, ' '));

    let internalLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.map(link => link.href);
    });

    internalLinks = [...new Set(internalLinks)];

    console.log(`Internal links extracted: ${internalLinks.length}`); 
    let phoneNumbers = [];
    let allTextContent = [];
    let chunklist = [];
    chunkPage(homepageContent,chunklist,url);
    allTextContent[0] =  'homePage :' + '\n'+'Home page content :' + homepageContent;
    let count = 1;
    for (const link of internalLinks) {
      try {
        if (isPhoneNumber(link) || isMailtoLink(link)) {
          console.log(`Skipping phone number or email link: ${link}`);
          phoneNumbers = extractPhoneNumbers(link);
          continue;
        }

        // Get the link's text content
        await page.goto(link, { waitUntil: 'networkidle2' });
        const textContent = await page.evaluate(() => {
          return document.body.innerText;
        });

        const cleanedTextContent = removeDuplicates(textContent.trim().replace(/\s\s+/g, ' '));
        chunkPage(cleanedTextContent,chunklist,link);
        wss.
        console.log(`Text content extracted from: ${link}`); // Log text content extraction
      } catch (linkError) {
        console.error(`Error processing link ${link}: ${linkError}`);
        // Continue processing the next link even if there's an error with the current one
        continue;
      }
    }

    const batchSize = 3; // You can adjust this batch size

    const chunksToCreate = [];
    const key = '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';
    const myai = new openai({
      apiKey: key,
  });
    let conversation = [
      { role: 'user', content:`summarize this while keeping email and discount offers  : ${allTextContent.slice(0,40000 )}` },
  ];
  const summary = await myai.chat.completions.create({
      messages: conversation,
      model: 'gpt-3.5-turbo-16k',
      
  });

  const responseText = `${summary.choices[0].message.content} phone number : ${phoneNumbers[0]}`;
  let extraInfo = prompt('do you have any new information you want to add to your database ?(new offers or contact info ) \n type N if you don\'t want to add anything :');
  let extra_info = '';
  if(extraInfo =='N'){
    extra_info = '';
  }
  else{
     extra_info = extraInfo;
  }
  
  const webform = await prisma.webscrap.create({
    data : {url : url,
            username : username,
            summary : responseText,
            extraInfo : extra_info }
  });
  let counter = 1;
    for (const chunk of chunklist) {
      
      const response = await axios.post('https://api.openai.com/v1/embeddings', {
        input: chunk,
        model: "text-embedding-ada-002",
      }, {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
  
      const embedding = response.data.data[0].embedding;
      chunksToCreate.push({
        text: chunk,
        webscrapId: webform.id,
        vectors: embedding
      });

      if (chunksToCreate.length === batchSize || counter >= chunklist.length) {
        // Send a batch of chunks to the OpenAI Embedding API
        await prisma.chunks.createMany({
          data: chunksToCreate,
        });
        console.log(`${counter} chunks sent out of ${chunklist.length}`);
        const delayBetweenRequestsMs = 60 * 1000 ;
        await delay(delayBetweenRequestsMs);
        chunksToCreate.length = 0; // Clear the batch
      }
     
      await delay(500);
      counter++;
      //add a global timer
    }
  
    await browser.close();
    console.log(`Browser closed`); // Log browser close

    
    return 'success';
  } catch (err) {
    console.error(err); // Log any error that occurs
   
  }
};
module.exports = learnWebsite;

