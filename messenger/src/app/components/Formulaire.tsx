'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import { Socket } from 'socket.io';

function Formulaire() {
  const [progressMessages, setProgressMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [url, setUrl] = useState('');


  useEffect(() => {
    const [myVariable, setMyVariable] = useState(null);
    const socket = io('http://localhost:3003');

    // Listen for scraping progress
    socket.on('scrapingProgress', (progressMessage) => {
      console.log(progressMessage);

      // Update UI by adding the new progress message to the state
      setProgressMessages((prevMessages) => [...prevMessages, progressMessage]);
    });

    return () => {
      // Cleanup the socket connection when the component unmounts
      socket.disconnect();
    };
  }, []); // Run this effect once on component mount

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
          <h1 className='text-3xl text-center'>Scraping Progress : </h1>
          <ul>
            
            {progressMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Formulaire;
