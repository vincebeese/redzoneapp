import { query } from '../db/index.js';

// Middleware to check subscription status
export async function requireSubscription(req, res, next) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Admins always have full access; others need active subscription or beta access
    const hasAccess =
      user.is_admin ||
      user.subscription_status === 'active' ||
      (user.has_beta_access && (!user.beta_expires_at || new Date(user.beta_expires_at) > new Date()));

    if (!hasAccess) {
      return res.status(402).json({
        error: 'Subscription required',
        paywall: true,
        message: 'Please subscribe to access this feature',
      });
    }

    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ error: 'Subscription check failed' });
  }
}

export default requireSubscription;
