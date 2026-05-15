import { query } from '../db/index.js';

const SESSION_TRIAL_LIMIT = 75;

// Middleware to check subscription status
export async function requireSubscription(req, res, next) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Admins and paying subscribers always have full access
    if (user.is_admin || user.subscription_status === 'active') {
      return next();
    }

    // Beta users: check time AND session limits
    if (user.has_beta_access) {
      // 1. Time limit — block if expired
      if (user.beta_expires_at && new Date(user.beta_expires_at) <= new Date()) {
        return res.status(402).json({
          error: 'Beta trial expired',
          paywall: true,
          reason: 'trial_expired',
          message: 'Your 14-day trial has ended. Please subscribe to continue.',
        });
      }

      // 2. Turn limit — count total AI responses across all modes (1 turn = 1 message in + 1 response out)
      const turnResult = await query(
        `SELECT (
          COALESCE((SELECT COUNT(*) FROM messages WHERE user_id = $1 AND role = 'assistant'), 0) +
          COALESCE((SELECT COUNT(*) FROM session_messages sm JOIN sessions s ON s.id = sm.session_id WHERE s.user_id = $1 AND sm.role = 'assistant'), 0)
        )::int AS total_turns`,
        [user.id]
      );
      const turnCount = parseInt(turnResult.rows[0]?.total_turns || 0);
      const bonus = user.session_bonus || 0;
      const limit = SESSION_TRIAL_LIMIT + bonus;

      if (turnCount >= limit) {
        return res.status(402).json({
          error: 'Session limit reached',
          paywall: true,
          reason: 'session_limit',
          message: `You've used all ${limit} trial sessions. Please subscribe to continue.`,
        });
      }

      return next();
    }

    // No access — not approved yet
    return res.status(402).json({
      error: 'Subscription required',
      paywall: true,
      reason: 'no_access',
      message: 'Please subscribe to access this feature',
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ error: 'Subscription check failed' });
  }
}

export default requireSubscription;
