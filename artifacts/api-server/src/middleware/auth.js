import jwt from 'jsonwebtoken';
import { query } from '../db/index.js';
import { logEvent } from '../services/analytics.js';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set before starting the server');
}
const JWT_SECRET = process.env.JWT_SECRET;

const THIRTY_MINUTES = 30 * 60 * 1000;

export async function ensureUser(req, res, next) {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Check jwt_version to support forced session flush
    try {
      const settingsResult = await query(
        `SELECT value FROM app_settings WHERE key = 'jwt_version'`
      );
      const dbVersion = settingsResult.rows[0]?.value || '1';
      if (String(payload.jwt_version ?? '1') !== dbVersion) {
        return res.status(401).json({ error: 'Session expired, please sign in again' });
      }
    } catch {
      // If app_settings unavailable, allow through
    }

    const result = await query('SELECT * FROM users WHERE id = $1', [payload.userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = result.rows[0];

    // Check per-user session_version to invalidate tokens after password change/reset
    const dbSessionVersion = req.user.session_version ?? 1;
    if ((payload.session_version ?? 1) !== dbSessionVersion) {
      return res.status(401).json({ error: 'Session expired, please sign in again' });
    }

    // Session tracking — fire session_start if first request or gap > 30 min
    const lastAt = req.user.last_event_at ? new Date(req.user.last_event_at).getTime() : 0;
    if (!lastAt || Date.now() - lastAt > THIRTY_MINUTES) {
      logEvent(req.user.id, 'app_session_start');
      query(`UPDATE users SET last_event_at = NOW() WHERE id = $1`, [req.user.id]).catch(() => {});
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export default ensureUser;
