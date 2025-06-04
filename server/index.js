const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      req.body,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // ✅ Correct key name
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error from OpenAI:", error.response?.data || error.message);
    res.status(500).json({ error: error.message, details: error.response?.data });
  }
});
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY);

app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));
