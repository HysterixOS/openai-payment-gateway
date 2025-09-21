import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
const userDB = require('../../../userDB.js');

export default withApiAuthRequired(async function balance(req, res) {
  const session = getSession(req, res);
  const userId = session.user.sub;
  if (!userDB[userId]) {
    userDB[userId] = { balance: 0 };
  }
  const balance = userDB[userId].balance;
  res.status(200).json({ balance });
});
