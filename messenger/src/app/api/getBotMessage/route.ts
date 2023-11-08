import { NextResponse } from "next/server";
import generateResponseWithFile from "../../../../back/monochat"


export async function POST(
  request: Request, 
) {
  const body = await request.json();

  const { 
    username,
    input
} = body;
console.log('this is the username in the route : ' , username)
const botOutput = await generateResponseWithFile(input,username);


  return NextResponse.json(botOutput);
}