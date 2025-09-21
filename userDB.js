// userDB.js
// In-memory user database for demo purposes.
// Each user record has a 'balance' field representing available credits.
// This file is shared between backend and frontend API routes.

const userDB = {};

// Export the singleton store.
module.exports = userDB;
