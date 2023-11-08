// Import the necessary functions from your existing code
const {firstResponse} = require('../monochat');

// This function handles the /first-response route
export default async function (req, res) {
  try {
    const username = 'W';
    const userinput = 'can i get a health insurance ?'
    // const { username, userinput } = req.body;
    const response = await firstResponse(username, userinput);
    res.status(200).json({ message : response });
  } catch (error) {
    console.error('Error generating first response:', error);
    res.status(500).json({ error: 'Failed to generate first response' });
  }
}
