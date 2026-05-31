const { Pool } = require('pg');
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

console.log('DB_USER:', process.env.DB_USER);

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

module.exports = pool;