import { query } from './index.js';

/**
 * Critical columns that must exist in each table.
 * If any are missing, the server logs a loud error at startup
 * so schema drift is caught immediately rather than silently
 * breaking features in production.
 *
 * To update: add new tables/columns here when you add them to the schema.
 */
const REQUIRED_COLUMNS = {
  users: [
    'id', 'email', 'is_admin', 'has_beta_access', 'beta_expires_at',
    'stripe_customer_id', 'subscription_status', 'session_bonus',
  ],
  analytics_events: [
    'id', 'user_id', 'event_type', 'properties', 'created_at',
  ],
  trial_notifications: [
    'id', 'user_id', 'notification_type', 'sent_at',
  ],
  deals: [
    'id', 'user_id', 'name', 'zone', 'status', 'turn_count',
  ],
  sessions: [
    'id', 'user_id', 'mode_slug', 'created_at',
  ],
  messages: [
    'id', 'user_id', 'role', 'content', 'created_at',
  ],
  session_messages: [
    'id', 'session_id', 'role', 'content',
  ],
};

export async function runSchemaCheck() {
  let passed = true;

  try {
    const { rows } = await query(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = ANY($1)
    `, [Object.keys(REQUIRED_COLUMNS)]);

    // Build a set of "table.column" strings from what's actually in the DB
    const existing = new Set(rows.map(r => `${r.table_name}.${r.column_name}`));

    const missing = [];
    for (const [table, columns] of Object.entries(REQUIRED_COLUMNS)) {
      for (const col of columns) {
        if (!existing.has(`${table}.${col}`)) {
          missing.push(`${table}.${col}`);
        }
      }
    }

    if (missing.length > 0) {
      console.error('');
      console.error('╔══════════════════════════════════════════════════════╗');
      console.error('║           SCHEMA MISMATCH — ACTION REQUIRED          ║');
      console.error('╠══════════════════════════════════════════════════════╣');
      missing.forEach(col => console.error(`║  MISSING: ${col.padEnd(42)}║`));
      console.error('╠══════════════════════════════════════════════════════╣');
      console.error('║  Run: pnpm --filter @workspace/api-server migrate    ║');
      console.error('╚══════════════════════════════════════════════════════╝');
      console.error('');
      passed = false;
    } else {
      console.log('Schema check passed — all required columns present.');
    }
  } catch (err) {
    console.error('Schema check failed to run:', err.message);
    passed = false;
  }

  return passed;
}
