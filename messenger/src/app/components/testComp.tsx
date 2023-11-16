'use client'
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketComponent = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('http://localhost:3003'); // Adjust the port to match your server

    // Listen for messages from the server
    socket.on('messageFromServer', (data) => {
      setResponse(response => [...response, data]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessageToServer = () => {
    // Connect to the Socket.IO server
    const socket = io('http://localhost:3003'); // Adjust the port to match your server

    // Emit a message to the server
    socket.emit('messageToServer', message);
  };

  return (
    <div>
      <h2>Socket.IO Example</h2>
      <div>
        <label htmlFor="messageInput">Message:</label>
        <input
          type="text"
          id="messageInput"
          className='text-black rounded p-1 m-2'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
        onClick={sendMessageToServer}
        className='bg-blue-800 p-1 rounded m-2'
        >Send Message</button>
      </div>
      <div>
        <p>Server Response:</p>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default SocketComponent;

