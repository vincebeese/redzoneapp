import { Router } from 'express';
import { query } from '../db/index.js';
import { ensureUser } from '../middleware/auth.js';

const router = Router();

function visibilityClause(user) {
  if (user.is_admin) return `visibility IN ('all', 'beta', 'admin')`;
  if (user.has_beta_access || user.subscription_status === 'active') return `visibility IN ('all', 'beta')`;
  return `visibility = 'all'`;
}

// GET /api/modes — active modes visible to the current user
router.get('/', ensureUser, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, slug, display_name, description, icon, visibility, sort_order
       FROM modes
       WHERE is_active = true AND ${visibilityClause(req.user)}
       ORDER BY sort_order ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching modes:', error);
    res.status(500).json({ error: 'Failed to fetch modes' });
  }
});

// GET /api/modes/:slug — single active mode visible to the current user
router.get('/:slug', ensureUser, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, slug, display_name, description, icon, visibility
       FROM modes
       WHERE slug = $1 AND is_active = true AND ${visibilityClause(req.user)}`,
      [req.params.slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Mode not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching mode:', error);
    res.status(500).json({ error: 'Failed to fetch mode' });
  }
});

export default router;
