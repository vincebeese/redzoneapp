import { query } from '../db/index.js';
import { sendTrialWarningEmail, sendTrialExpiredEmail } from './email.js';

const CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000; // every 6 hours

async function sendIfNotSent(userId, type, toEmail, displayName, extra = {}, emailFn = sendTrialWarningEmail) {
  try {
    await query(
      `INSERT INTO trial_notifications (user_id, notification_type) VALUES ($1, $2)`,
      [userId, type]
    );
    // Insert succeeded — not sent before, so send now
    await emailFn({ toEmail, displayName, type, ...extra });
    console.log(`Trial notification [${type}] sent to ${toEmail}`);
  } catch (err) {
    if (err.code === '23505') {
      // Unique constraint violation — already sent, skip silently
    } else {
      console.error(`Trial notification [${type}] failed for ${toEmail}:`, err.message);
    }
  }
}

export async function runTrialCheck() {
  try {
    // Fetch all active beta users who are not yet on a paid plan and not admins
    const { rows: users } = await query(`
      SELECT u.id, u.email, u.display_name, u.beta_expires_at, u.session_bonus,
        (
          COALESCE((SELECT COUNT(*) FROM messages m WHERE m.user_id = u.id AND m.role = 'assistant'), 0) +
          COALESCE((SELECT COUNT(*) FROM session_messages sm JOIN sessions s ON s.id = sm.session_id WHERE s.user_id = u.id AND sm.role = 'assistant'), 0)
        )::int AS session_count
      FROM users u
      WHERE u.has_beta_access = true
        AND u.is_admin = false
        AND u.subscription_status != 'active'
        AND u.beta_expires_at IS NOT NULL
    `);

    const now = new Date();

    for (const user of users) {
      const expires = new Date(user.beta_expires_at);
      const msLeft = expires - now;
      const daysLeft = msLeft / (1000 * 60 * 60 * 24);
      const sessions = user.session_count || 0;

      // Post-expiry emails
      if (msLeft <= 0) {
        const daysExpired = Math.abs(msLeft) / (1000 * 60 * 60 * 24);
        if (daysExpired >= 5) {
          await sendIfNotSent(user.id, 'expired_5day', user.email, user.display_name, {}, sendTrialExpiredEmail);
        } else if (daysExpired >= 1) {
          await sendIfNotSent(user.id, 'expired_1day', user.email, user.display_name, {}, sendTrialExpiredEmail);
        }
        continue;
      }

      // Time-based warnings
      if (daysLeft <= 7 && daysLeft > 2) {
        await sendIfNotSent(user.id, '7day', user.email, user.display_name, { daysLeft: Math.ceil(daysLeft) });
      }
      if (daysLeft <= 2) {
        await sendIfNotSent(user.id, '2day', user.email, user.display_name, { daysLeft: Math.ceil(daysLeft) });
      }

      // Session-based warnings
      if (sessions >= 75) {
        await sendIfNotSent(user.id, '75session', user.email, user.display_name, { sessionCount: sessions });
      } else if (sessions >= 50) {
        await sendIfNotSent(user.id, '50session', user.email, user.display_name, { sessionCount: sessions });
      }
    }

    console.log(`Trial check complete. Checked ${users.length} beta users.`);
  } catch (err) {
    console.error('Trial check error:', err.message);
  }
}

export function startTrialChecker() {
  // Run once shortly after server startup, then every 6 hours
  setTimeout(() => {
    runTrialCheck();
    setInterval(runTrialCheck, CHECK_INTERVAL_MS);
  }, 30 * 1000); // 30-second delay on startup to let DB settle

  console.log('Trial checker scheduled (every 6 hours).');
}
