import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import Groq from 'groq-sdk';


const groq = new Groq();

const app = express();
app.use(cors()); 
app.use(express.json());
app.use(express.static('public'));
app.get('/api', (req, res)=>{
res.json("this server is okay")
})
const SYSTEM_PROMPT = {
  role: 'system',
  content: 'You are a helpful, concise assistant.'
};

let chatHistory = [SYSTEM_PROMPT];

async function summarizeHistory() {
  // Everything after index 0 (includes any previous summary + the last 19-20 messages)
  const messagesToCompress = chatHistory.slice(1);

  const summaryCompletion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [
      {
        role: 'system',
        content: 'Summarize the key facts, user details, and context from this conversation into one concise paragraph so the assistant can remember them going forward.'
      },
      ...messagesToCompress
    ],
    max_tokens: 250
  });

  const summaryText = summaryCompletion.choices[0].message.content;

  // Reset the array: keep original system prompt + pin the new rolling summary at index 1
  chatHistory = [
    SYSTEM_PROMPT,
    { role: 'system', content: `Summary of earlier conversation: ${summaryText}` }
  ];
}

app.post('/msg', async (req, res) => {
  // 1. Trigger compression whenever 20 messages have built up after the main system prompt
  if (chatHistory.length >= 21) {
    await summarizeHistory();
  }

  // 2. Push the new user message and get the reply as usual
  chatHistory.push({ role: 'user', content: req.body.message });

  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: chatHistory
  });

  const reply = completion.choices[0].message.content;
  chatHistory.push({ role: 'assistant', content: reply });

  res.json({ reply });
});









const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
