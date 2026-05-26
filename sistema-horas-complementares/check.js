const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_qZjJTw4tdp5R@ep-old-surf-aqlcx7ts-pooler.c-8.us-east-1.aws.neon.tech/neondb',
  ssl: { rejectUnauthorized: false }
});
pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
  .then(r => {
    console.log('Tables in database:', r.rows.map(x=>x.table_name));
    pool.end();
  })
  .catch(e => {
    console.error(e);
    pool.end();
  });
