import { Router } from 'express';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool, { query } from '../db/index.js';
import { sendPasswordResetEmail, sendMagicLinkEmail, sendWelcomeEmail, sendNewUserAdminNotification } from '../services/email.js';
import { logEvent } from '../services/analytics.js';

const router = Router();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set before starting the server');
}
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Validate an invite token (public — no auth required)
router.get('/invite/:token', async (req, res) => {
  try {
    const result = await query(
      `SELECT email, has_beta_access, expires_at, accepted_at
       FROM invites WHERE token = $1`,
      [req.params.token]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invite not found' });
    }
    const invite = result.rows[0];
    if (invite.accepted_at) {
      return res.status(410).json({ error: 'This invite has already been used' });
    }
    if (new Date(invite.expires_at) < new Date()) {
      return res.status(410).json({ error: 'This invite has expired' });
    }
    res.json({ email: invite.email, has_beta_access: invite.has_beta_access });
  } catch (error) {
    console.error('Invite validation error:', error);
    res.status(500).json({ error: 'Failed to validate invite' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, display_name, invite_token } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!display_name || !display_name.trim()) {
    return res.status(400).json({ error: 'Your name is required' });
  }

  const emailTrimmed = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailTrimmed) || emailTrimmed.length > 255) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    // Validate invite token if provided
    let grantBetaAccess = false;
    let inviteId = null;
    if (invite_token) {
      const inviteResult = await query(
        `SELECT id, email, has_beta_access, expires_at, accepted_at
         FROM invites WHERE token = $1`,
        [invite_token]
      );
      if (inviteResult.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid invite link' });
      }
      const invite = inviteResult.rows[0];
      if (invite.accepted_at) {
        return res.status(400).json({ error: 'This invite has already been used' });
      }
      if (new Date(invite.expires_at) < new Date()) {
        return res.status(400).json({ error: 'This invite has expired' });
      }
      if (invite.email !== emailTrimmed) {
        return res.status(400).json({ error: 'This invite was sent to a different email address' });
      }
      grantBetaAccess = invite.has_beta_access;
      inviteId = invite.id;
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [emailTrimmed]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUserId = randomUUID();
    const result = await query(
      `INSERT INTO users (id, email, password_hash, display_name, has_beta_access, subscription_status)
       VALUES ($1, $2, $3, $4, $5, 'inactive')
       RETURNING id, email, display_name, is_admin, has_beta_access, subscription_status`,
      [newUserId, emailTrimmed, password_hash, display_name?.trim() || null, grantBetaAccess]
    );

    // Mark invite as accepted
    if (inviteId) {
      await query(
        `UPDATE invites SET accepted_at = NOW() WHERE id = $1`,
        [inviteId]
      );
    }

    const user = result.rows[0];

    if (inviteId) {
      logEvent(user.id, 'invite_accepted', { invited_by: null });
    }

    // Send welcome email to new user and notify admin (non-blocking)
    const adminEmail = process.env.ADMIN_EMAIL || 'vince@vincebeese.com';
    sendWelcomeEmail({ toEmail: user.email, displayName: user.display_name }).catch((err) =>
      console.error('Welcome email failed:', err.message)
    );
    sendNewUserAdminNotification({
      adminEmail,
      newUserEmail: user.email,
      newUserName: user.display_name,
    }).catch((err) => console.error('Admin notification email failed:', err.message));

    // Only set auth cookie if the user has beta access (invite-based signup).
    // Non-beta users must wait for admin approval before they can log in.
    if (user.has_beta_access) {
      const versionRow = await query(`SELECT value FROM app_settings WHERE key = 'jwt_version'`).catch(() => ({ rows: [] }));
      const jwtVersion = versionRow.rows[0]?.value || '1';
      const sessionVersionRow = await query(`SELECT session_version FROM users WHERE id = $1`, [user.id]).catch(() => ({ rows: [] }));
      const sessionVersion = sessionVersionRow.rows[0]?.session_version ?? 1;
      const token = jwt.sign({ userId: user.id, jwt_version: jwtVersion, session_version: sessionVersion }, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('auth_token', token, {
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
    }

    res.status(201).json({
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
      has_beta_access: user.has_beta_access,
      subscription_status: user.subscription_status,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Account not configured. Contact your administrator.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const versionRow = await query(`SELECT value FROM app_settings WHERE key = 'jwt_version'`).catch(() => ({ rows: [] }));
    const jwtVersion = versionRow.rows[0]?.value || '1';
    const token = jwt.sign({ userId: user.id, jwt_version: jwtVersion, session_version: user.session_version ?? 1 }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    res.json({
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
      has_beta_access: user.has_beta_access,
      subscription_status: user.subscription_status,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/magic-link/request', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const userResult = await query(
      'SELECT id, email FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    // Always return 200 to prevent user enumeration
    if (userResult.rows.length === 0) {
      return res.json({ ok: true });
    }

    const user = userResult.rows[0];
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await query(
      `INSERT INTO magic_link_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    );

    const baseUrl = process.env.APP_URL ||
      (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000');
    const magicUrl = `${baseUrl}/auth/magic?token=${token}`;

    try {
      await sendMagicLinkEmail({ toEmail: user.email, magicUrl });
    } catch (emailErr) {
      console.error('Failed to send magic link email:', emailErr.message);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Magic link request error:', error);
    res.status(500).json({ error: 'Failed to send sign-in link' });
  }
});

router.get('/magic-link/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const consumed = await client.query(
        `UPDATE magic_link_tokens
         SET used_at = NOW()
         WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()
         RETURNING user_id`,
        [token]
      );

      if (consumed.rows.length === 0) {
        await client.query('ROLLBACK');
        const check = await query(
          `SELECT used_at, expires_at FROM magic_link_tokens WHERE token = $1`,
          [token]
        );
        if (check.rows.length === 0) {
          return res.status(404).json({ error: 'Sign-in link not found' });
        }
        if (check.rows[0].used_at) {
          return res.status(410).json({ error: 'This sign-in link has already been used' });
        }
        return res.status(410).json({ error: 'This sign-in link has expired' });
      }

      await client.query('COMMIT');

      const userId = consumed.rows[0].user_id;
      const userResult = await query(
        `SELECT id, email, is_admin, has_beta_access, beta_expires_at,
                subscription_status, subscription_ends_at, created_at
         FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = userResult.rows[0];
      const versionRow = await query(`SELECT value FROM app_settings WHERE key = 'jwt_version'`).catch(() => ({ rows: [] }));
      const jwtVersion = versionRow.rows[0]?.value || '1';
      const sessionVerRow = await query(`SELECT session_version FROM users WHERE id = $1`, [user.id]).catch(() => ({ rows: [] }));
      const sessionVersion = sessionVerRow.rows[0]?.session_version ?? 1;
      const jwtToken = jwt.sign({ userId: user.id, jwt_version: jwtVersion, session_version: sessionVersion }, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('auth_token', jwtToken, {
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      res.json({ ok: true, user });
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Magic link verify error:', error);
    res.status(500).json({ error: 'Failed to verify sign-in link' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const userResult = await query(
      'SELECT id, email FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    // Always return 200 to prevent user enumeration
    if (userResult.rows.length === 0) {
      return res.json({ ok: true });
    }

    const user = userResult.rows[0];
    logEvent(user.id, 'password_reset_requested', {});
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    );

    const baseUrl = process.env.APP_URL ||
      (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000');
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail({ toEmail: user.email, resetUrl });
    } catch (emailErr) {
      console.error('Failed to send reset email:', emailErr.message);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

router.get('/reset-password/validate', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    const result = await query(
      `SELECT id, expires_at, used_at FROM password_reset_tokens WHERE token = $1`,
      [token]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reset link not found' });
    }
    const row = result.rows[0];
    if (row.used_at) {
      return res.status(410).json({ error: 'This reset link has already been used' });
    }
    if (new Date(row.expires_at) < new Date()) {
      return res.status(410).json({ error: 'This reset link has expired' });
    }
    res.json({ ok: true });
  } catch (error) {
    console.error('Reset validate error:', error);
    res.status(500).json({ error: 'Failed to validate token' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    // First check the token exists and is not expired/used (for a clear error message)
    const check = await query(
      `SELECT used_at, expires_at FROM password_reset_tokens WHERE token = $1`,
      [token]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Reset link not found' });
    }
    if (check.rows[0].used_at) {
      return res.status(410).json({ error: 'This reset link has already been used' });
    }
    if (new Date(check.rows[0].expires_at) < new Date()) {
      return res.status(410).json({ error: 'This reset link has expired' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Atomically consume the token — only one concurrent request will match WHERE used_at IS NULL
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const consumed = await client.query(
        `UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()
         RETURNING user_id`,
        [token]
      );

      if (consumed.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(410).json({ error: 'This reset link has already been used' });
      }

      await client.query(
        `UPDATE users SET password_hash = $1, session_version = session_version + 1 WHERE id = $2`,
        [password_hash, consumed.rows[0].user_id]
      );

      await client.query('COMMIT');
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('auth_token', { path: '/' });
  res.json({ ok: true });
});

router.get('/me', async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'Not logged in' });
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

    const result = await query(
      `SELECT id, email, display_name, is_admin, has_beta_access, beta_expires_at,
              subscription_status, subscription_ends_at, session_bonus, created_at,
              session_version
       FROM users WHERE id = $1`,
      [payload.userId]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Not logged in' });
    }
    const user = result.rows[0];

    // Check per-user session_version — invalidates tokens after password change/reset
    if ((payload.session_version ?? 1) !== (user.session_version ?? 1)) {
      return res.status(401).json({ error: 'Session expired, please sign in again' });
    }

    const { session_version: _sv, ...userResponse } = user;
    res.json(userResponse);
  } catch (err) {
    return res.status(401).json({ error: 'Not logged in' });
  }
});

export default router;
