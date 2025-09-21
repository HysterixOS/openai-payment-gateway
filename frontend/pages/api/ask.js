import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Configuration, OpenAIApi } from 'openai';
const userDB = require('../../../userDB.js');

// Pricing per 1K tokens for supported models
const pricing = {
  'gpt-3.5-turbo': { prompt: 0.0015, completion: 0.002 },
  'gpt-4': { prompt: 0.03, completion: 0.06 }
};

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export default withApiAuthRequired(async function ask(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'No question provided' });
  }
  const session = getSession(req, res);
  const userId = session.user.sub;

  // Initialize user record if not present
  if (!userDB[userId]) {
    userDB[userId] = { balance: 0 };
  }
  const userRecord = userDB[userId];
  // Ensure the user has a positive balance before making a request
  if (userRecord.balance <= 0) {
    return res.status(402).json({ error: 'Insufficient credits. Please top up.' });
  }
  try {
    // Determine model based on question length and available balance
    let model = 'gpt-3.5-turbo';
    if (question.length > 500 && userRecord.balance >= 0.5) {
      model = 'gpt-4';
    }
    // Make the call to OpenAI
    const completion = await openai.createChatCompletion({
      model: model,
      messages: [
        { role: 'user', content: question }
      ]
    });
    const answer = completion.data.choices[0]?.message?.content || '';
    const usage = completion.data.usage;
    let cost = 0;
    if (usage && pricing[model]) {
      const promptTokens = usage.prompt_tokens || 0;
      const completionTokens = usage.completion_tokens || 0;
      cost = (promptTokens * pricing[model].prompt + completionTokens * pricing[model].completion) / 1000;
    }
    // Deduct the cost from the user's balance
    userRecord.balance = Math.max(0, userRecord.balance - cost);
    return res.status(200).json({ answer });
  } catch (err) {
    console.error('OpenAI API error:', err);
    return res.status(500).json({ error: 'Failed to get answer from AI' });
  }
});
