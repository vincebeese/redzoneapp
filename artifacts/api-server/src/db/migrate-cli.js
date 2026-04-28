import { runMigrations } from './migrate.js';
import pool from './index.js';

runMigrations()
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
