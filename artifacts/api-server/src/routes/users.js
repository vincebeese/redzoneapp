import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/index.js';
import { ensureUser } from '../middleware/auth.js';

const router = Router();

// GET /api/users/me — profile + usage stats
router.get('/me', ensureUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const [activeDealsResult, totalTurnsResult, recentDealsResult] = await Promise.all([
      query(
        `SELECT COUNT(*)::int AS count FROM deals WHERE user_id = $1 AND status = 'active'`,
        [userId]
      ),
      query(
        `SELECT COALESCE(SUM(turn_count), 0)::int AS total FROM deals WHERE user_id = $1`,
        [userId]
      ),
      query(
        `SELECT id, name, zone, status, deal_value, turn_count, updated_at
         FROM deals WHERE user_id = $1
         ORDER BY updated_at DESC LIMIT 5`,
        [userId]
      ),
    ]);

    res.json({
      id: req.user.id,
      email: req.user.email,
      display_name: req.user.display_name || null,
      is_admin: req.user.is_admin,
      has_beta_access: req.user.has_beta_access,
      beta_expires_at: req.user.beta_expires_at,
      subscription_status: req.user.subscription_status,
      subscription_ends_at: req.user.subscription_ends_at,
      has_companion_course: req.user.has_companion_course ?? false,
      onboarding_skipped: req.user.onboarding_skipped ?? false,
      created_at: req.user.created_at,
      usage: {
        active_deals: activeDealsResult.rows[0].count,
        total_deal_slots: 10,
        total_turns: totalTurnsResult.rows[0].total,
        deals: recentDealsResult.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users/me/skip-onboarding — permanently dismiss the seller profile prompt
router.post('/me/skip-onboarding', ensureUser, async (req, res) => {
  try {
    await query(
      `UPDATE users SET onboarding_skipped = true WHERE id = $1`,
      [req.user.id]
    );
    res.json({ ok: true });
  } catch (error) {
    console.error('Error skipping onboarding:', error);
    res.status(500).json({ error: 'Failed to update' });
  }
});

// PATCH /api/users/me — update display_name
router.patch('/me', ensureUser, async (req, res) => {
  try {
    const { display_name } = req.body;

    if (!display_name || typeof display_name !== 'string') {
      return res.status(400).json({ error: 'display_name is required' });
    }
    if (display_name.trim().length === 0) {
      return res.status(400).json({ error: 'display_name cannot be empty' });
    }
    if (display_name.trim().length > 50) {
      return res.status(400).json({ error: 'display_name must be 50 characters or less' });
    }

    const result = await query(
      `UPDATE users SET display_name = $1 WHERE id = $2
       RETURNING id, email, display_name, is_admin, has_beta_access,
                 beta_expires_at, subscription_status, created_at`,
      [display_name.trim(), req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// PATCH /api/users/me/password — change password
router.patch('/me/password', ensureUser, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Both current and new password are required' });
    }
    if (new_password.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }
    if (current_password === new_password) {
      return res.status(400).json({ error: 'New password must be different from current password' });
    }

    const userResult = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );
    const valid = await bcrypt.compare(current_password, userResult.rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hash = await bcrypt.hash(new_password, 12);
    await query(
      'UPDATE users SET password_hash = $1, session_version = session_version + 1 WHERE id = $2',
      [hash, req.user.id]
    );

    res.clearCookie('auth_token', { path: '/' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// DELETE /api/users/me — permanently delete account
router.delete('/me', ensureUser, async (req, res) => {
  try {
    const { confirm } = req.body;
    if (confirm !== 'DELETE') {
      return res.status(400).json({ error: 'Must confirm with "DELETE"' });
    }

    const userId = req.user.id;

    // Explicit ordered delete to satisfy all FK constraints:
    // 1. messages (references both user_id and deal_id)
    await query('DELETE FROM messages WHERE user_id = $1', [userId]);
    // 2. session_messages cascade from sessions, so delete sessions next
    //    (session_messages.session_id → sessions.id CASCADE handles session_messages)
    await query('DELETE FROM sessions WHERE user_id = $1', [userId]);
    // 3. deals (messages already gone, safe to delete)
    await query('DELETE FROM deals WHERE user_id = $1', [userId]);
    // 4. finally the user record
    await query('DELETE FROM users WHERE id = $1', [userId]);

    // Clear the auth cookie
    res.clearCookie('auth_token');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// GET /api/users/profile — seller profile
router.get('/profile', ensureUser, async (req, res) => {
  try {
    const result = await query(
      `SELECT icp, avg_deal_size, sales_cycle, win_themes, loss_patterns,
              user_role, has_read_rzs, common_deal_killers
       FROM seller_profiles WHERE user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    res.status(500).json({ error: 'Failed to fetch seller profile' });
  }
});

// PATCH /api/users/profile — upsert seller profile
router.patch('/profile', ensureUser, async (req, res) => {
  try {
    const { icp, avg_deal_size, sales_cycle, win_themes, loss_patterns,
            user_role, has_read_rzs, common_deal_killers } = req.body;

    const fields = { icp, avg_deal_size, sales_cycle, win_themes, loss_patterns,
                     user_role, has_read_rzs, common_deal_killers };
    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined && val !== null && typeof val !== 'string') {
        return res.status(400).json({ error: `${key} must be a string` });
      }
      if (typeof val === 'string' && val.length > 1000) {
        return res.status(400).json({ error: `${key} must be 1000 characters or less` });
      }
    }
    if (has_read_rzs && !['yes', 'no', ''].includes(has_read_rzs)) {
      return res.status(400).json({ error: 'has_read_rzs must be "yes" or "no"' });
    }

    const result = await query(
      `INSERT INTO seller_profiles (user_id, icp, avg_deal_size, sales_cycle, win_themes, loss_patterns,
                                    user_role, has_read_rzs, common_deal_killers, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         icp = EXCLUDED.icp,
         avg_deal_size = EXCLUDED.avg_deal_size,
         sales_cycle = EXCLUDED.sales_cycle,
         win_themes = EXCLUDED.win_themes,
         loss_patterns = EXCLUDED.loss_patterns,
         user_role = EXCLUDED.user_role,
         has_read_rzs = EXCLUDED.has_read_rzs,
         common_deal_killers = EXCLUDED.common_deal_killers,
         updated_at = NOW()
       RETURNING icp, avg_deal_size, sales_cycle, win_themes, loss_patterns,
                 user_role, has_read_rzs, common_deal_killers`,
      [req.user.id, icp || null, avg_deal_size || null, sales_cycle || null,
       win_themes || null, loss_patterns || null,
       user_role || null, has_read_rzs || null, common_deal_killers || null]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving seller profile:', error);
    res.status(500).json({ error: 'Failed to save seller profile' });
  }
});

// GET /api/users/subscription — subscription status check
router.get('/subscription', ensureUser, async (req, res) => {
  try {
    const hasAccess =
      req.user.subscription_status === 'active' ||
      (req.user.has_beta_access &&
        (!req.user.beta_expires_at || new Date(req.user.beta_expires_at) > new Date()));

    res.json({
      hasAccess,
      subscriptionStatus: req.user.subscription_status,
      hasBetaAccess: req.user.has_beta_access,
      betaExpiresAt: req.user.beta_expires_at,
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ error: 'Failed to check subscription' });
  }
});

export default router;
