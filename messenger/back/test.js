const prompt = require('prompt-sync')();
const { PrismaClient } = require("@prisma/client")
var prisma = new PrismaClient();
const firstResponse = require('./monochat'); // Import your monochat class
const generateResponseWithFile = require('./monochat');
const initializebot = require('./monochat');
const find_user = require('./monochat');
async function run(){


const identity = prompt('Give me your user id : ');

let user_name = await find_user(identity);


if  (user_name == false)  {
    user_name = prompt('please assign a username to yourself : ');
    const apikey = prompt('enter your api key : ');
    
    await  initializebot(user_name,apikey);
    
}
else{
let user_input = prompt('Give me your input: ');
let context = await prisma.webscrap.findUnique({
    where :  { username : user_name },
});
let last_message = '';
do{
    if  (user_input == 'precision')   {
        console.log('precision enabled');
        user_input = prompt('you : ');

        process.stdout.write("bot: ");
        botOutput = await generateResponseWithFile(user_input,context.id,last_message);
        botOutput;
        last_message = 'user : ' + user_input + 'Bot : ' + botOutput.fullOutput;
        user_input = prompt('\nyou : ');
    }
    else    {

        process.stdout.write("bot: ");
        await firstResponse(user_name,user_input);
        process.stdout.write("\n"); 
        user_input = prompt('you : ');
    }
    

 }while(user_input != 'exit')

}}
run();
