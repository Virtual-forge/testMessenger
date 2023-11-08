// Import the necessary functions from your existing code
const {find_user} = require('../monochat');

// This function handles the /find_user route
export default async function (req, res) {
  try {
    const { username } = req.body;
    const response = await find_user(username);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to find user' });
  }
}
