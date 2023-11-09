const express = require('express');
const cors = require('cors');
const {
    firstResponse,
    generateResponseWithFile,
    find_user,
    initializebot
} = require('./monochat');
const { PrismaClient } = require("@prisma/client");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Use JSON middleware for parsing request bodies

const prisma = new PrismaClient();

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
  const { username , url } = req.body;
  const key = 'key';
  try {
    const user = await initializebot(username,key,url);
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
