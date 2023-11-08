// Import the necessary functions from your existing code
const {initializebot} = require('../monochat');

// This function handles the /initialize route
export default async function (req, res) {
  try {
    const { ID, key } = req.body;
    const initializedBotID = await initializebot(ID, key);
    res.status(200).json({ message: 'Bot initialized successfully', botID: initializedBotID });
  } catch (error) {
    console.error('Error initializing bot:', error);
    res.status(500).json({ error: 'Failed to initialize bot' });
  }
}
