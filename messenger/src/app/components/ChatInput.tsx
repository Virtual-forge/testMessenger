'use client'
import { Input } from 'postcss'
import React, { useState } from 'react'
import axios from 'axios'
function ChatInput ()  {
const [input,setInput] = useState('');
const [chatLog,setChatLog] = useState([]);
const [isLoading,setIsloading] = useState(false);

const addMessage = (e:React.FormEvent<HTMLFormElement>) =>{
  e.preventDefault();
  if(!input) return;
  const messageToSend = input;
  setChatLog((prevChatLog) => [...prevChatLog , {type:'user' , message:messageToSend}]);
  const user_name = 'webtest';
  axios.post('../api/getBotMessage',{
    username : user_name,
    input : messageToSend
  }).then(function (response){
    setChatLog((prevChatLog) => [...prevChatLog , {type:'bot' , message:response.data}]);
    setInput("");
  })
  // const botmessage = 'bot message';
  // setChatLog((prevChatLog) => [...prevChatLog , {type:'bot' , message:botmessage}]);
  // setInput("");
}
  return (
    <div className='flex flex-col  h-screen bg-gray-900 '>
      <div className='flex flex-grow justify-center p-6'>
        <div className='flex flex-col  min-w-[500px]   space-y-2 '>
          {chatLog.map((message,index) => (
            <div key={index} className={`flex   ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p className={`rounded-lg p-2 break-words max-w-md ${message.type === 'user' ? 'bg-blue-600 ' : 'bg-green-600'}`}>
              {message.message}
            </p>
          </div>
          
          ))}
        </div>
      </div>
      <form onSubmit={addMessage} className='fixed bottom-0 w-full px-10 py-10 z-50 flex justify-center space-x-3 '>
        <div>
          <input  
          placeholder='Enter message ...'  
          type='text' 
          className='flex-1 border border-gray-200 focus:outline-none  focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-blue-600 rounded-md p-1 text-slate-950 font-semibold'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div>
          <button     
          type='submit' 
          disabled={!input}
          className='bg-blue-700 hover:bg-blue-800 rounded-sm p-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatInput

