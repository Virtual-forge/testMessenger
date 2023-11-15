import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, input } = body;

  try {
    const botOutputResponse = await fetch('http://localhost:3001/api/generateResponseWithFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        input,
      }),
    });

    if (!botOutputResponse.ok) {
      console.error('Error fetching bot output:', botOutputResponse.statusText);
      return NextResponse.json(botOutputResponse.statusText);
    }

    const botOutput = await botOutputResponse.json();
    // console.log('this is the output in the route:', botOutput.fullOutput);

    return NextResponse.json(botOutput.fullOutput);
  } catch (error) {
    console.error('Error handling bot output:', error);
    return NextResponse.json('Internal Server Error');
  }
}