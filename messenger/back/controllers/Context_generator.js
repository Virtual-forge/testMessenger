const { EmbedBase } = require("embedbase");
let summarizer = require('nodejs-text-summarizer')
const Webscrap = require('./models/website_scrap');

// you can reduce object size by saving summary directly instead of saving textcontet as well
async function pushSummary(link,linksummary) {
  await Webscrap.updateOne(
    { url: webcontent.url},
    { $push: {summary: `${link.linkname}: "${link.linkurl}"
    ${linksummary}`}},
    { upsert: true}
);
}

//need to give user website here
let webcontent = await Webscrap.findOne({
  url: user_lookup.website,
});
for(const link of webcontent.links){
  const linksummary = await summarizer(link.content);
  pushSummary(link,linksummary);

}
// const client = new EmbedBase({
//   apiKey: "5e53d384-b9ed-436f-9240-3246d50fccd0",
// });
// //put open ai call herer to create dataset for embedbase
// const outputs = [
//   // after scrapping and making a summary insert context here
// ];

// const dataset = [];

// for (const output of outputs) {
//   const embedding = client.embed(output);
//   dataset.push(embedding);
// }

// // Save the dataset to a file
// const saveDataset = (dataset, filename) => {
//   const json = JSON.stringify(dataset);
//   const fs = require("fs");
//   fs.writeFileSync(filename, json);
// };


// saveDataset(dataset, "dataset.json");
