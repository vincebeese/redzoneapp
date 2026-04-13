import { Router } from 'express';
import { query } from '../db/index.js';
import { ensureUser } from '../middleware/auth.js';

const router = Router();

const ALLOWED_MODES = new Set(['coach', 'mindset']);

router.get('/', ensureUser, async (req, res) => {
  const { mode } = req.query;

  try {
    let sql;
    let params;

    if (mode) {
      // Get sessions for a specific mode (used by mode pages)
      if (!ALLOWED_MODES.has(mode)) return res.status(400).json({ error: 'mode must be coach or mindset' });
      sql = `SELECT s.id, s.mode_slug, s.title, s.created_at, s.updated_at,
              (SELECT content FROM session_messages sm WHERE sm.session_id = s.id ORDER BY sm.created_at ASC LIMIT 1) AS first_message,
              (SELECT COUNT(*)::int FROM session_messages sm WHERE sm.session_id = s.id) AS message_count
       FROM sessions s
       WHERE s.user_id = $1 AND s.mode_slug = $2
       ORDER BY s.updated_at DESC
       LIMIT 10`;
      params = [req.user.id, mode];
    } else {
      // Get all sessions across all modes (used by dashboard)
      sql = `SELECT s.id, s.mode_slug, s.title, s.created_at, s.updated_at,
              (SELECT content FROM session_messages sm WHERE sm.session_id = s.id ORDER BY sm.created_at ASC LIMIT 1) AS first_message,
              (SELECT COUNT(*)::int FROM session_messages sm WHERE sm.session_id = s.id) AS message_count
       FROM sessions s
       WHERE s.user_id = $1
       ORDER BY s.updated_at DESC
       LIMIT 5`;
      params = [req.user.id];
    }

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('List sessions error:', err);
    res.status(500).json({ error: 'Failed to load sessions' });
  }
});

router.get('/search', ensureUser, async (req, res) => {
  const { mode, q } = req.query;
  if (!mode || !ALLOWED_MODES.has(mode)) return res.status(400).json({ error: 'mode must be coach or mindset' });

  if (!q || !q.trim()) {
    try {
      const result = await query(
        `SELECT s.id, s.mode_slug, s.title, s.created_at, s.updated_at,
                (SELECT content FROM session_messages sm WHERE sm.session_id = s.id ORDER BY sm.created_at ASC LIMIT 1) AS first_message,
                (SELECT COUNT(*) FROM session_messages sm WHERE sm.session_id = s.id) AS message_count
         FROM sessions s
         WHERE s.user_id = $1 AND s.mode_slug = $2
         ORDER BY s.updated_at DESC
         LIMIT 10`,
        [req.user.id, mode]
      );
      return res.json(result.rows);
    } catch (err) {
      console.error('List sessions error:', err);
      return res.status(500).json({ error: 'Failed to load sessions' });
    }
  }

  try {
    const result = await query(
      `SELECT DISTINCT s.id, s.mode_slug, s.title, s.created_at, s.updated_at,
              (SELECT content FROM session_messages sm2 WHERE sm2.session_id = s.id ORDER BY sm2.created_at ASC LIMIT 1) AS first_message,
              (SELECT COUNT(*) FROM session_messages sm3 WHERE sm3.session_id = s.id) AS message_count
       FROM sessions s
       JOIN session_messages sm ON sm.session_id = s.id
       WHERE s.user_id = $1 AND s.mode_slug = $2 AND sm.content ILIKE $3
       ORDER BY s.updated_at DESC
       LIMIT 20`,
      [req.user.id, mode, `%${q.trim()}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Search sessions error:', err);
    res.status(500).json({ error: 'Failed to search sessions' });
  }
});

router.get('/:id/messages', ensureUser, async (req, res) => {
  const sessionId = parseInt(req.params.id, 10);
  try {
    const sessionResult = await query(
      `SELECT id FROM sessions WHERE id = $1 AND user_id = $2`,
      [sessionId, req.user.id]
    );
    if (sessionResult.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await query(
      `SELECT id, role, content, created_at FROM session_messages WHERE session_id = $1 ORDER BY created_at ASC`,
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

router.post('/', ensureUser, async (req, res) => {
  const { mode_slug } = req.body;
  if (!mode_slug || !ALLOWED_MODES.has(mode_slug)) {
    return res.status(400).json({ error: 'mode_slug must be coach or mindset' });
  }

  try {
    // Enforce 100-session lifetime cap for beta trial users
    const isBetaTrial = req.user.has_beta_access &&
      req.user.subscription_status !== 'active' &&
      !req.user.is_admin;

    if (isBetaTrial) {
      const countResult = await query(
        `SELECT COUNT(*)::int AS count FROM sessions WHERE user_id = $1`,
        [req.user.id]
      );
      const sessionCount = countResult.rows[0].count;
      const sessionLimit = 100 + (req.user.session_bonus || 0);

      if (sessionCount >= sessionLimit) {
        // Hard-stop: collapse the trial expiry to now so the middleware blocks future requests
        await query(`UPDATE users SET beta_expires_at = NOW() WHERE id = $1`, [req.user.id]);
        return res.status(402).json({
          error: 'Trial session limit reached',
          paywall: true,
          reason: 'sessions',
        });
      }
    }

    const result = await query(
      `INSERT INTO sessions (user_id, mode_slug) VALUES ($1, $2) RETURNING id, mode_slug, created_at, updated_at`,
      [req.user.id, mode_slug]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

router.post('/:id/messages', ensureUser, async (req, res) => {
  const sessionId = parseInt(req.params.id, 10);
  const { role, content } = req.body;
  if (!role || !content) return res.status(400).json({ error: 'role and content are required' });

  try {
    const sessionResult = await query(
      `SELECT id FROM sessions WHERE id = $1 AND user_id = $2`,
      [sessionId, req.user.id]
    );
    if (sessionResult.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await query(
      `INSERT INTO session_messages (session_id, role, content) VALUES ($1, $2, $3) RETURNING id, role, content, created_at`,
      [sessionId, role, content]
    );
    await query(
      `UPDATE sessions SET updated_at = NOW() WHERE id = $1`,
      [sessionId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Save message error:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

router.patch('/:id', ensureUser, async (req, res) => {
  const sessionId = parseInt(req.params.id, 10);
  const { title } = req.body;

  try {
    const sessionResult = await query(
      `SELECT id FROM sessions WHERE id = $1 AND user_id = $2`,
      [sessionId, req.user.id]
    );
    if (sessionResult.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const newTitle = (title && title.trim()) ? title.trim() : null;
    const result = await query(
      `UPDATE sessions SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING id, mode_slug, title, created_at, updated_at`,
      [newTitle, sessionId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update session error:', err);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

router.delete('/:id', ensureUser, async (req, res) => {
  const sessionId = parseInt(req.params.id, 10);
  try {
    const sessionResult = await query(
      `SELECT id FROM sessions WHERE id = $1 AND user_id = $2`,
      [sessionId, req.user.id]
    );
    if (sessionResult.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await query(`DELETE FROM sessions WHERE id = $1`, [sessionId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete session error:', err);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;
