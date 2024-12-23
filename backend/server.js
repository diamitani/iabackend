// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/instruction-architect', async (req, res) => {
    const { prompt, knowledgeBase } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const messages = [
            { role: 'system', content: 'You are an expert Instruction Architect.' },
            { role: 'user', content: prompt }
        ];

        if (knowledgeBase) {
            messages.push({
                role: 'system',
                content: 'Include knowledge base data for better accuracy.'
            });
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: messages,
        });

        res.json({ message: response.choices[0]?.message?.content.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process the request' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

