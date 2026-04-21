import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dev-only data snapshots — must not run in production
const DEV_ONLY_MIGRATIONS = new Set([
  '006_seed_production_data.sql',
  '007_sync_dev_to_prod.sql',
  '008_executive_briefing_spec.sql',
  '009_sync_prod_snapshot.sql',
]);

// Security-blocked migrations — must never run in any environment.
// 010: hardcoded privileged account bootstrap (deleted from repo; blocked here for safety)
// 019: unconditionally reset a named account to a known password (deleted from repo)
const SECURITY_BLOCKED_MIGRATIONS = new Set([
  '010_admin_user.sql',
  '019_reset_admin_password.sql',
]);

async function migrate() {
  console.log('Running database migrations...');

  try {
    // Create migrations tracking table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).sort().filter(f => f.endsWith('.sql'));

    // Get already-applied migrations
    const applied = await pool.query('SELECT filename FROM _migrations');
    const appliedSet = new Set(applied.rows.map(r => r.filename));

    for (const file of files) {
      if (SECURITY_BLOCKED_MIGRATIONS.has(file)) {
        // Mark as applied so they can never be re-introduced accidentally
        await pool.query(
          'INSERT INTO _migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
          [file]
        );
        console.log(`Skipped (security-blocked): ${file}`);
        continue;
      }

      if (DEV_ONLY_MIGRATIONS.has(file)) {
        // Mark as applied so they never run in any environment
        await pool.query(
          'INSERT INTO _migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
          [file]
        );
        console.log(`Skipped (dev-only): ${file}`);
        continue;
      }

      if (appliedSet.has(file)) {
        console.log(`Already applied: ${file}`);
        continue;
      }

      console.log(`Applying migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          'INSERT INTO _migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
          [file]
        );
        await client.query('COMMIT');
        console.log(`Migration ${file} applied successfully`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Migration ${file} failed: ${err.message}`);
      } finally {
        client.release();
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
