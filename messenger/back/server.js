const express = require('express');
const cors = require('cors');
const {
    firstResponse,
    generateResponseWithFile,
    find_user,
    initializebot
} = require('./monochat');

const http = require('http');
const { PrismaClient } = require("@prisma/client");
const io = require('socket.io')(3003 , {
  cors:{
    origin: "http://localhost:3000"
  },
  reconnection: true,
  reconnectionAttempts: 3, // Adjust this as needed
  reconnectionDelay: 1000, // Adjust this as needed
});

const app = express();
const port = process.env.PORT || 3001;



app.use(cors());
app.use(express.json()); // Use JSON middleware for parsing request bodies

const prisma = new PrismaClient();



io.on('connection', (socket) => {
  console.log(`Socket connection: ${socket.id}`);

  // Listen for messages from the client
  socket.on('messageToServer', (data) => {
    console.log('Received message from client:', data);

    // Send a response back to the client
    io.emit('messageFromServer', ` ${data}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`socket disconnected ${socket.id}`);
  });
});
io.on('disconnect', (reason) => {
  console.log(`Disconnected from the server: ${reason}`);
});

io.on('reconnect', (attemptNumber) => {
  console.log(`Reconnected to the server after ${attemptNumber} attempts`);
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Update the path accordingly
});


// Define API routes
app.post('/api/generateResponseWithFile', async (req, res) => {
  const { username , input } = req.body;

  try {
    const response = await generateResponseWithFile(input, username);
    res.json(response);
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/firstResponse', async (req, res) => {
  const { username, userinput } = req.body;

  try {
    const response = await firstResponse(username, userinput);
    res.json(response);
  } catch (error) {
    console.error('Error generating first response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/find_user', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await find_user(username);
    res.json({ user });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/initializebot', async (req, res) => {
  const { username , url , socketId } = req.body;
  const key = 'key';
  try {
    const user = await initializebot(username,key,url,socketId,io);
    res.json({ user });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
