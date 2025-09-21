// backend/middleware/gatekeeper.js
// Middleware to verify user identity and available balance before granting access to API routes.
// Expects the client to provide an X-User-Id header identifying the user.
// Requires a shared in-memory user database (userDB.js in project root).

const userDB = require('../../userDB');

/**
 * Gatekeeper middleware to enforce authentication and credit balance.
 * If no user ID header is present or the user has insufficient credits, it responds with an error.
 * Otherwise, attaches the userId to the request object and calls next().
 */
function gatekeeper(req, res, next) {
  const userId = req.get('x-user-id') || req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Missing X-User-Id header' });
  }
  // Initialize user record if it doesn't exist
  if (!userDB[userId]) {
    userDB[userId] = { balance: 0 };
  }
  // Check available balance
  if (userDB[userId].balance <= 0) {
    return res.status(402).json({ error: 'Insufficient credits. Please top up.' });
  }
  // Attach user ID to request for downstream handlers
  req.userId = userId;
  next();
}

module.exports = gatekeeper;
