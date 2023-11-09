const openai = require('openai');
const { PrismaClient } = require("@prisma/client")
var prisma = new PrismaClient();
var nlp = require('wink-nlp-utils');
const prompt = require('prompt-sync')();
const addBotChat = require('./controllers/history_save');
const faiss = require('faiss-node');
const axios = require('axios');
const  learnWebsite  = require('./controllers/scrapper');


const key = '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';

    async function callOpenAPI(conversation) {
        const outputChunks = [];
        const myai = new openai({
            apiKey: key,
        });
        const response = await myai.chat.completions.create({
            messages: conversation,
            temperature: 0.2,
            model: 'gpt-3.5-turbo',
            stream: false,
        });

        const chunkContent = response.choices[0]?.message?.content || '';
            conversation.push({ role: 'assistant', content: chunkContent });
            outputChunks.push(chunkContent);
        const fullOutput = outputChunks.join('');
        // addBotChat(fullOutput,username);
        return { conversation, fullOutput };
    }


    async function find_user(user_name) {
        const user_lookup = await prisma.monobot.findUnique(
           {where: {name: user_name,}}
        );
        if (user_lookup == null) {
            console.log(`you don't have a bot please create one.`);
            return false;
        } else {
            return user_lookup.name;
        }
    }


    async function initializebot(ID, key,url) {
        try {
            
            
            
            const chat = await prisma.monobot.create({
               data: {name: ID,
                api_key: key,
                tokens: 0,
                website: url}
            });
            
            console.log( 'chat object :' + chat.name );
            console.log('The bot has been initialized! learning website now ...');
           const response = await learnWebsite(url,chat.name);
           if ( response == 'success'){
            return response;
           }
            return 'failed to initialize bot';

        } catch (error) {
            console.error('Error initializing bot:', error);
        }
    }


    async function  generateResponseWithFile(userInput, username) {
    console.log('this is the username : ', username);
    let context = await prisma.webscrap.findUnique({
        where :  { username : username },
    });
    const webid = context.id;
           
        let embed_response = await axios.post('https://api.openai.com/v1/embeddings', {
            input: userInput,
            model: "text-embedding-ada-002"
        }, {
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            }
        });
         const userEmbedding = embed_response.data.data[0].embedding;

        
        let chunksFormdb = await prisma.chunks.findMany({
            where : {webscrapId : webid }, 
            
        })
        const index = new faiss.IndexFlatL2(1536); 
        for ( const chunkie of chunksFormdb){
            index.add(chunkie.vectors);
        }
        
        const similarityScores = index.search(userEmbedding, 1);
        const mostSimilarIndex = similarityScores.labels[0];
        const mostSimilarChunk = chunksFormdb[mostSimilarIndex];

        let conversation = [
            { role: 'system', content: `You are a chatbot that answers the questions asked based on the content given only answer using the information provided. Please answer the user's questions based on the website content.` },
            { role: 'user', content:`this is the website content : ${mostSimilarChunk.text}` },
            { role: 'user', content: userInput }  
        ];
        // if (last_message != '') {
        //     conversation = [
        //         { role: 'system', content: `You are a chatbot that answers the questions asked based on the content given only answer using the information provided. Please answer the user's questions based on the website content.` },
        //         { role: 'user', content:`this is the website content : ${mostSimilarChunk.text}` },
        //         {role : 'user', content: `when a user asks you about previous messages use this as context , this is the previous message : ${last_message}`},
        //         { role: 'user', content: userInput }  
        //     ];
        // }

        let response = await callOpenAPI(conversation);
        return response;
    }


    async function firstResponse(username,userinput){
        const summary = await prisma.webscrap.findUnique({
            where :  { username : username }   
        });
        let conversation = [
            { role: 'system', content: `You are a chatbot that provides summaries of website content. Please answer the user's questions based on the website content.` },
            { role: 'user', content:`this is a resume about the website : ${summary.summary} ${summary.extraInfo}` },
            { role: 'user', content: userinput }  
        ];
        let response = await callOpenAPI(conversation);
        return response;
    }


module.exports = {
    firstResponse,
    generateResponseWithFile,
    find_user,
    initializebot
} 