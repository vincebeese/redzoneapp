import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to Neon database');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

export const query = (text, params) => pool.query(text, params);

export default pool;
