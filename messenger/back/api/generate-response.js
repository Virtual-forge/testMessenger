// Import the necessary functions from your existing code
const {generateResponseWithFile} = require('../monochat');

// This function handles the /generate-response route
export default async function (req, res) {
  try {
    const { userInput, webid, last_message } = req.body;
    const response = await generateResponseWithFile(userInput, webid, last_message);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
