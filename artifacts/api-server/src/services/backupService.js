import { Storage } from '@google-cloud/storage';
import cron from 'node-cron';
import { query } from '../db/index.js';

const TABLES = [
  'users',
  'sessions',
  'session_messages',
  'messages',
  'deals',
  'deal_documents',
  'seller_profiles',
  'saved_artifacts',
  'analytics_events',
  'api_spend_log',
  'trial_notifications',
  'invites',
  'modes',
  'resource_center_tools',
  'resource_center_categories',
  'artifact_templates',
  'app_settings',
];

const KEEP_WEEKS = 4;

function rowsToCsv(rows) {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val) => {
    if (val === null || val === undefined) return '';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

async function runBackup() {
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  if (!bucketId) {
    console.error('Backup skipped: DEFAULT_OBJECT_STORAGE_BUCKET_ID not set');
    return;
  }

  const storage = new Storage();
  const bucket = storage.bucket(bucketId);
  const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const folderPrefix = `backups/${dateStr}/`;

  console.log(`Starting database backup for ${dateStr}...`);

  let exported = 0;
  let failed = 0;

  for (const table of TABLES) {
    try {
      const { rows } = await query(`SELECT * FROM ${table}`);
      const csv = rowsToCsv(rows);
      const file = bucket.file(`${folderPrefix}${table}.csv`);
      await file.save(csv, { contentType: 'text/csv', resumable: false });
      console.log(`  Backed up: ${table} (${rows.length} rows)`);
      exported++;
    } catch (err) {
      console.error(`  Failed to back up table ${table}:`, err.message);
      failed++;
    }
  }

  // Write a manifest file with metadata
  const manifest = {
    date: dateStr,
    tables: TABLES,
    exported,
    failed,
    createdAt: new Date().toISOString(),
  };
  try {
    await bucket
      .file(`${folderPrefix}manifest.json`)
      .save(JSON.stringify(manifest, null, 2), { contentType: 'application/json', resumable: false });
  } catch (err) {
    console.error('  Failed to write backup manifest:', err.message);
  }

  console.log(`Backup complete: ${exported} tables exported, ${failed} failed.`);

  // Prune backups older than KEEP_WEEKS weeks
  await pruneOldBackups(bucket);
}

async function pruneOldBackups(bucket) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - KEEP_WEEKS * 7);

  try {
    const [files] = await bucket.getFiles({ prefix: 'backups/' });
    const deleted = new Set();

    for (const file of files) {
      // Extract date from path: backups/YYYY-MM-DD/table.csv
      const match = file.name.match(/^backups\/(\d{4}-\d{2}-\d{2})\//);
      if (!match) continue;
      const backupDate = new Date(match[1]);
      if (backupDate < cutoff) {
        await file.delete();
        deleted.add(match[1]);
      }
    }

    if (deleted.size > 0) {
      console.log(`Pruned ${deleted.size} old backup(s): ${[...deleted].join(', ')}`);
    }
  } catch (err) {
    console.error('Failed to prune old backups:', err.message);
  }
}

export function startBackupScheduler() {
  // Run every Sunday at midnight UTC
  cron.schedule('0 0 * * 0', () => {
    runBackup().catch((err) => console.error('Backup job error:', err));
  }, { timezone: 'UTC' });

  console.log('Database backup scheduler started (weekly, Sundays at midnight UTC).');
}

export { runBackup };
