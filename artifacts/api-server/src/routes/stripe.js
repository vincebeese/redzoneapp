import { Router } from 'express';
import Stripe from 'stripe';
import { query } from '../db/index.js';
import { ensureUser } from '../middleware/auth.js';
import { logEvent } from '../services/analytics.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook handler (raw body, before JSON middleware)
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const status = subscription.status === 'active' || subscription.status === 'trialing' ? subscription.status : 'inactive';
        const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null;

        const subUserResult = await query(`SELECT id FROM users WHERE stripe_customer_id = $1`, [customerId]);
        const subUserId = subUserResult.rows[0]?.id;

        await query(
          `UPDATE users SET subscription_status = $1, subscription_ends_at = $2
           WHERE stripe_customer_id = $3`,
          [status, periodEnd, customerId]
        );
        if (event.type === 'customer.subscription.created' && subUserId) {
          logEvent(subUserId, 'subscription_started', { plan: subscription.items?.data?.[0]?.price?.id || 'default' });
        }
        console.log(`Subscription ${status} for customer ${customerId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const delUserResult = await query(`SELECT id FROM users WHERE stripe_customer_id = $1`, [customerId]);
        const delUserId = delUserResult.rows[0]?.id;

        await query(
          `UPDATE users SET subscription_status = 'inactive'
           WHERE stripe_customer_id = $1`,
          [customerId]
        );
        if (delUserId) {
          logEvent(delUserId, 'subscription_cancelled', { plan: subscription.items?.data?.[0]?.price?.id || 'default', days_active: 0 });
        }
        console.log(`Subscription cancelled for customer ${customerId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Create checkout session
router.post('/checkout', ensureUser, async (req, res) => {
  try {
    const { priceId } = req.body;

    // Get or create Stripe customer
    let customerId = req.user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          userId: req.user.id,
        },
      });
      customerId = customer.id;

      await query(
        `UPDATE users SET stripe_customer_id = $1 WHERE id = $2`,
        [customerId, req.user.id]
      );
    }

    const baseUrl = process.env.APP_URL || process.env.CLIENT_URL || 'https://redzoneselling.co';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?subscribed=true`,
      cancel_url: `${baseUrl}/paywall`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create customer portal session
router.post('/portal', ensureUser, async (req, res) => {
  try {
    if (!req.user.stripe_customer_id) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const portalBase = process.env.APP_URL || process.env.CLIENT_URL || 'https://redzoneselling.co';
    const session = await stripe.billingPortal.sessions.create({
      customer: req.user.stripe_customer_id,
      return_url: `${portalBase}/account`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

export default router;
