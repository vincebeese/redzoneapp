import { Router } from 'express';
import Stripe from 'stripe';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query } from '../db/index.js';
import { ensureUser } from '../middleware/auth.js';
import { logEvent } from '../services/analytics.js';
import { sendSubscriptionConfirmationEmail, sendNewSubscriberWelcomeEmail } from '../services/email.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const COMPANION_COURSE_PRICE_ID = 'price_1TPlNBAD6A0v3Wn8Ch7flZYc'; // Red Zone Ready Companion Course $199

const FOUNDING_PRICE_IDS = [
  'price_1TKjiqAD6A0v3Wn8YMAsDWRB', // monthly $39 (legacy)
  'price_1TKjiqAD6A0v3Wn8oLoY0Gpl', // annual $290 (legacy)
  'price_1TWzXzAD6A0v3Wn8OnPfiExr', // monthly $29
  'price_1TWzc8AD6A0v3Wn85EUXO7kz', // annual $275 (legacy)
  'price_1TWznYAD6A0v3Wn8RbEEsEft', // annual $285
];
const SESSION_PACK_PRICE_ID = 'price_1TKjirAD6A0v3Wn8r14nrESC';
const FOUNDING_SEAT_CAP = 50;

const ALLOWED_PRICE_IDS = new Set([
  ...FOUNDING_PRICE_IDS,
  'price_1TKjiqAD6A0v3Wn8LWHxtVTO', // starter monthly
  'price_1TKjiqAD6A0v3Wn8fWzigOFS', // starter annual
  'price_1TKjirAD6A0v3Wn8yjzrzniE', // pro monthly
  'price_1TKjirAD6A0v3Wn8OBCmtF1s', // pro annual
]);

// In-memory cache for founding seat count
const SEAT_COUNT_CACHE_TTL = 60 * 1000; // 60 seconds
let _seatCountCache = null;
let _seatCountCacheExpiry = 0;

async function getFoundingSeatInfo() {
  const now = Date.now();
  if (_seatCountCache !== null && now < _seatCountCacheExpiry) {
    return _seatCountCache;
  }
  const subs = await stripe.subscriptions.list({
    status: 'active',
    limit: 100,
    expand: ['data.items.data.price'],
  });
  const count = subs.data.filter((s) =>
    s.items.data.some((i) => FOUNDING_PRICE_IDS.includes(i.price.id))
  ).length;
  _seatCountCache = { count, available: count < FOUNDING_SEAT_CAP, remaining: FOUNDING_SEAT_CAP - count };
  _seatCountCacheExpiry = now + SEAT_COUNT_CACHE_TTL;
  return _seatCountCache;
}

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

        let subUserResult = await query(`SELECT id FROM users WHERE stripe_customer_id = $1`, [customerId]);

        // Fallback for payment links: Stripe creates a new customer we haven't seen before.
        // 1. Try matching by email. 2. If no match, auto-create an account so the subscriber can log in.
        if (subUserResult.rows.length === 0) {
          try {
            const stripeCustomer = await stripe.customers.retrieve(customerId);
            if (stripeCustomer && !stripeCustomer.deleted && stripeCustomer.email) {
              const emailMatch = await query(
                `SELECT id FROM users WHERE LOWER(email) = LOWER($1)`,
                [stripeCustomer.email]
              );
              if (emailMatch.rows.length > 0) {
                await query(
                  `UPDATE users SET stripe_customer_id = $1 WHERE id = $2`,
                  [customerId, emailMatch.rows[0].id]
                );
                subUserResult = emailMatch;
                console.log(`Linked new Stripe customer ${customerId} to user ${emailMatch.rows[0].id} via email`);
              } else {
                // No account exists — create one so the subscriber can access the app
                const tempPasswordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
                const displayName = stripeCustomer.name || stripeCustomer.email.split('@')[0];
                const newUserResult = await query(
                  `INSERT INTO users (email, display_name, password_hash, subscription_status, stripe_customer_id, has_beta_access)
                   VALUES ($1, $2, $3, 'active', $4, false)
                   RETURNING id, email, display_name`,
                  [stripeCustomer.email.toLowerCase().trim(), displayName, tempPasswordHash, customerId]
                );
                subUserResult = newUserResult;
                // Generate a 7-day password-reset token so they can set a real password
                const resetToken = crypto.randomBytes(32).toString('hex');
                const resetExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                await query(
                  `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
                  [newUserResult.rows[0].id, resetToken, resetExpiry]
                );
                const appBaseUrl = (process.env.REPLIT_DOMAINS || '').split(',')[0]
                  ? `https://${(process.env.REPLIT_DOMAINS || '').split(',')[0]}`
                  : 'https://redzoneselling.co';
                const resetUrl = `${appBaseUrl}/reset-password?token=${resetToken}`;
                sendNewSubscriberWelcomeEmail({ toEmail: stripeCustomer.email, displayName, setPasswordUrl: resetUrl })
                  .catch(err => console.error('Auto-create welcome email failed:', err.message));
                console.log(`Auto-created user account for new Stripe subscriber ${customerId} (${stripeCustomer.email})`);
              }
            }
          } catch (lookupErr) {
            console.error('Stripe customer lookup/create failed:', lookupErr.message);
          }
        }

        const subUserId = subUserResult.rows[0]?.id;

        await query(
          `UPDATE users SET subscription_status = $1, subscription_ends_at = $2
           WHERE stripe_customer_id = $3`,
          [status, periodEnd, customerId]
        );
        if (event.type === 'customer.subscription.created' && subUserId && status === 'active') {
          logEvent(subUserId, 'subscription_started', { plan: subscription.items?.data?.[0]?.price?.id || 'default' });
          const userRow = await query(`SELECT email, display_name FROM users WHERE id = $1`, [subUserId]);
          if (userRow.rows[0]) {
            sendSubscriptionConfirmationEmail({
              toEmail: userRow.rows[0].email,
              displayName: userRow.rows[0].display_name,
            }).catch(err => console.error('Subscription confirmation email failed:', err.message));
          }
        }
        // Invalidate seat count cache when subscriptions change
        _seatCountCache = null;
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
        // Invalidate seat count cache when subscriptions change
        _seatCountCache = null;
        console.log(`Subscription cancelled for customer ${customerId}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        if (invoice.subscription) {
          await query(
            `UPDATE users SET subscription_status = 'active' WHERE stripe_customer_id = $1`,
            [customerId]
          );
        }
        break;
      }

      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object;
        const customerId = failedInvoice.customer;
        if (failedInvoice.subscription) {
          // Ensure customer is linked to a user (same email-match fallback as subscription events)
          let failedUserResult = await query(`SELECT id FROM users WHERE stripe_customer_id = $1`, [customerId]);
          if (failedUserResult.rows.length === 0) {
            try {
              const stripeCustomer = await stripe.customers.retrieve(customerId);
              if (stripeCustomer && !stripeCustomer.deleted && stripeCustomer.email) {
                const emailMatch = await query(
                  `SELECT id FROM users WHERE LOWER(email) = LOWER($1)`,
                  [stripeCustomer.email]
                );
                if (emailMatch.rows.length > 0) {
                  await query(`UPDATE users SET stripe_customer_id = $1 WHERE id = $2`, [customerId, emailMatch.rows[0].id]);
                  failedUserResult = emailMatch;
                }
              }
            } catch (lookupErr) {
              console.error('Stripe customer lookup failed (payment_failed):', lookupErr.message);
            }
          }
          await query(
            `UPDATE users SET subscription_status = 'past_due' WHERE stripe_customer_id = $1`,
            [customerId]
          );
          const userId = failedUserResult.rows[0]?.id;
          if (userId) logEvent(userId, 'payment_failed', { invoice_id: failedInvoice.id });
        }
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.metadata?.type === 'session_pack' && session.metadata?.userId) {
          await query(
            `UPDATE users SET session_bonus = session_bonus + 25 WHERE id = $1`,
            [session.metadata.userId]
          );
          logEvent(session.metadata.userId, 'session_pack_purchased', { bonus: 25 });
          console.log(`Session pack (+25) applied to user ${session.metadata.userId}`);
        }
        if (session.metadata?.type === 'companion_course' && session.metadata?.userId) {
          await query(
            `UPDATE users SET has_companion_course = true WHERE id = $1`,
            [session.metadata.userId]
          );
          logEvent(session.metadata.userId, 'companion_course_purchased', {});
          console.log(`Companion course access granted to user ${session.metadata.userId}`);
        }
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

// Get Founding Member seat count (public — needed by Paywall before login check)
// Responses are cached for 60 seconds to avoid exhausting Stripe API quota
router.get('/seat-count', async (req, res) => {
  try {
    const seatInfo = await getFoundingSeatInfo();
    res.json(seatInfo);
  } catch (err) {
    console.error('Seat count error:', err.message);
    res.json({ count: 0, available: true, remaining: FOUNDING_SEAT_CAP });
  }
});

// Create subscription checkout session
router.post('/checkout', ensureUser, async (req, res) => {
  try {
    const { priceId } = req.body;
    if (!priceId) return res.status(400).json({ error: 'priceId is required' });

    // Validate against server-side allowlist — never trust client-supplied price IDs
    if (!ALLOWED_PRICE_IDS.has(priceId)) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Enforce founding seat cap server-side
    if (FOUNDING_PRICE_IDS.includes(priceId)) {
      const seatInfo = await getFoundingSeatInfo();
      if (!seatInfo.available) {
        return res.status(400).json({ error: 'Founding Member seats are sold out' });
      }
    }

    let customerId = req.user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.display_name || undefined,
        metadata: { userId: req.user.id },
      });
      customerId = customer.id;
      await query(`UPDATE users SET stripe_customer_id = $1 WHERE id = $2`, [customerId, req.user.id]);
    }

    const baseUrl = process.env.APP_URL || 'https://redzoneselling.co';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
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

// Purchase a Session Pack (+25 sessions, one-time payment)
router.post('/session-pack', ensureUser, async (req, res) => {
  try {
    let customerId = req.user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.display_name || undefined,
        metadata: { userId: req.user.id },
      });
      customerId = customer.id;
      await query(`UPDATE users SET stripe_customer_id = $1 WHERE id = $2`, [customerId, req.user.id]);
    }

    const baseUrl = process.env.APP_URL || 'https://redzoneselling.co';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: SESSION_PACK_PRICE_ID, quantity: 1 }],
      mode: 'payment',
      success_url: `${baseUrl}/dashboard?session_pack=true`,
      cancel_url: `${baseUrl}/paywall`,
      metadata: { userId: req.user.id, type: 'session_pack' },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Session pack checkout error:', error);
    res.status(500).json({ error: 'Failed to create session pack checkout' });
  }
});

// Purchase the Red Zone Ready Companion Course (one-time, with promo code support)
router.post('/companion-course-checkout', ensureUser, async (req, res) => {
  try {
    let customerId = req.user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.display_name || undefined,
        metadata: { userId: req.user.id },
      });
      customerId = customer.id;
      await query(`UPDATE users SET stripe_customer_id = $1 WHERE id = $2`, [customerId, req.user.id]);
    }

    const baseUrl = process.env.APP_URL || 'https://redzoneselling.co';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: COMPANION_COURSE_PRICE_ID, quantity: 1 }],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/learning?course_unlocked=true`,
      cancel_url: `${baseUrl}/learning`,
      metadata: { userId: req.user.id, type: 'companion_course' },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Companion course checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create customer portal session
router.post('/portal', ensureUser, async (req, res) => {
  try {
    if (!req.user.stripe_customer_id) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const portalBase = process.env.APP_URL || 'https://redzoneselling.co';
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
