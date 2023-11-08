const { PrismaClient } = require("@prisma/client")
var prisma = new PrismaClient();

async function addUserChat(msg,name){
     await prisma.history.update({
       where : { userame: name},
        data : { chat: {push: `user :${msg}}`}},
        
   } );
}
async function addBotChat(msg,name){
    await prisma.history.update({
        where : { userame: name},
         data : { chat: {push: `bot :${msg}}`}},
         
    });
}
module.exports = {addUserChat} , {addBotChat}