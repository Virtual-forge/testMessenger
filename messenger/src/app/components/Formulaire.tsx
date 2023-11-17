'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation'
import { FaCheck, FaTimes } from 'react-icons/fa';
import { MdOutlineFileUpload } from "react-icons/md";

function Formulaire() {
  const [progressMessages, setProgressMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [url, setUrl] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();
  useEffect(() => {
    
    let newSocket : Socket;
    if(!socket){
      newSocket = io('http://localhost:3003');
    setSocket(newSocket);
  }
  const handleScrapingProgress = (progressMessage) => {
    console.log(progressMessage);
    // Update UI by adding the new progress message to the state
    setProgressMessages((prevMessages) => [...prevMessages, {type: 'Add' ,message: progressMessage}]);
  };
  const handleScrapingFinished = () => {
    console.log('Scraping Finished!');
    socket?.off('scrapingProgress', handleScrapingProgress);
    socket?.disconnect();
    // Navigate to the 'Chatbot' page
    router.push('/Chatbot');
  };
  const handleScrapingRemoveLink = (progressMessage) => {
    console.log(progressMessage);
    // Update UI by adding the new progress message to the state
    setProgressMessages((prevMessages) => [...prevMessages, {type: 'No' ,message: progressMessage}]);
  };
   const handleChunkSent= (progressMessage) => {
    console.log(progressMessage);
    // Update UI by adding the new progress message to the state
    setProgressMessages((prevMessages) => [...prevMessages, {type: 'Chunks' ,message: progressMessage}]);
  };

    // Listen for scraping progress
    socket?.on('scrapingProgressAdd', handleScrapingProgress);
    socket?.on('Finished', handleScrapingFinished);
    socket?.on('scrapingProgressNo',handleScrapingRemoveLink);
    socket?.on('scrapingProgress', handleChunkSent);
    return () => {
      socket?.off('scrapingProgress', handleScrapingProgress);
      socket?.disconnect();
    };
  }, [socket]); // Run this effect once on component mount

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    try {
      // Make a request to the backend route to initiate the scraping process
      const response = await axios.post('../api/setupUser', {
        username: username,
        url: url,
        socketId : socket.id
      });
      if (response.data === 'success') {
        // If the response is success, navigate to the "/Chatbot" page
        
      }
      // Handle the response if needed
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error initiating scraping:', error);
    }
  };

  return (
    <div className='flex justify-center'>
      <div className='flex flex-col'>
        <div>
          <h1 className=' font-bold rounded text-2xl bg-gray-800 p-2 m-4 text-center px-24 '>
            Client Information :
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col bg-gray-900 rounded-xl p-4 m-4 py-14 items-center space-y-6'
        >
          <div>
            <label>
              Username:
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className='text-black font-bold text-md rounded-md'
              />
            </label>
          </div>
          <div>
            <label>
              URL:
              <input
                type='url'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className='text-black font-bold text-md rounded-md'
              />
            </label>
          </div>
          <div>
            <button type='submit' className='bg-blue-700 p-1 m-2 rounded'>
              Submit
            </button>
          </div>
        </form>
        <div>
          <h1 className='text-3xl text-center '>Scraping Progress : </h1>
          <div className='flex flex-col bg-gray-200 text-black rounded-lg p-2 max-w-md min-w-[500px] h-screen overflow-auto'>
          <ul>
          {progressMessages.map((message, index) => (
            <li key={index}>
              {message.type === 'Add' ? (
                <div className='flex p-1 '>
                  <FaCheck /> {message.message}
                </div>
              ) : message.type === 'No' ? (
                <div className='flex p-1'>
                  <FaTimes /> {message.message}
                </div>
              ) : message.type === 'Chunks' ? (
                <div className='flex p-1'>
                  <MdOutlineFileUpload /> {message.message}
                </div>
              ) : (
                null
              )}
            </li>
          ))}
          </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Formulaire;
