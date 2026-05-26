const { Pool } = require('pg');

const connStr = 'postgresql://neondb_owner:npg_qZjJTw4tdp5R@ep-old-surf-aqlcx7ts-pooler.c-8.us-east-1.aws.neon.tech/neondb';

const pool = new Pool({
  connectionString: connStr,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function test() {
  try {
    console.log('Testing query on users...');
    const res = await pool.query('SELECT * FROM users');
    console.log('Success! Rows:', res.rows.length);
  } catch (err) {
    console.error('Query failed!');
    console.error('Error object:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
  } finally {
    await pool.end();
  }
}

test();
