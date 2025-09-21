import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const userDB = require('../../../userDB.js');

export default withApiAuthRequired(async function createCheckoutSession(req, res) {
  const session = getSession(req, res);
  const userId = session.user.sub;
  if (!userDB[userId]) {
    userDB[userId] = { balance: 0 };
  }
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'AI Credits ($10)' },
            unit_amount: 10 * 100
          },
          quantity: 1
        }
      ],
      metadata: {
        userId: userId,
        creditAmount: 10
      },
      success_url: `${baseUrl}/topup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/topup/cancel`
    });
    return res.status(303).redirect(checkoutSession.url);
  } catch (err) {
    console.error('Stripe session creation failed:', err);
    return res.status(500).json({ error: 'Stripe session creation failed' });
  }
});
