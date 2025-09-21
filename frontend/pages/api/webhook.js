import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = {
  api: { bodyParser: false }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const userDB = require('../../../userDB.js');

export default async function webhookHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const creditAmount = parseFloat(session.metadata?.creditAmount || '0');
    if (userId && userDB[userId]) {
      userDB[userId].balance += creditAmount;
      console.log(`✅ Credited $${creditAmount.toFixed(2)} to user ${userId}`);
    }
  }
  res.status(200).json({ received: true });
}
