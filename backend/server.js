const express = require('express');
const gatekeeper = require('./middleware/gatekeeper');

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware and JSON parser
app.use(express.json());

// Apply the gatekeeper middleware to all API routes
app.use('/api', gatekeeper);

/**
 * Example protected route.
 * In a real application this would forward requests to the OpenAI API after the gatekeeper
 * middleware verifies the user’s wallet balance.
 */
app.post('/api/openai', async (req, res) => {
  // At this stage, the gatekeeper has checked the user’s balance.
  // TODO: Forward the request to the OpenAI API and return the result.
  res.json({ message: 'OpenAI call would be forwarded here.' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
