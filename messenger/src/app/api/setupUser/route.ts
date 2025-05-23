import { NextResponse } from "next/server";
 
import { io, Socket } from "socket.io-client";

export async function POST(request: Request) {
 
  const body = await request.json();
  const { username, url,socketId } = body;
  console.log(`this is the id in the route  ${socketId}`);
  

  
  try {
    
    
    const botReponse = await fetch('http://localhost:3001/api/initializebot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({
        username,
        url,
       socketId
      }),
    });

    if (!botReponse.ok) {
      console.error('failed to initialize bot :', botReponse.statusText);
      return NextResponse.json(botReponse.statusText);
    }

    

    return NextResponse.json('success');
  } catch (error) {
    console.error('Error handling bot output:', error);
    return NextResponse.json('Internal Server Error');
  }
}