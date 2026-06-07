const pool = require('../config/database');

async function main() {
  try {
    console.log("Fetching latest 10 audit logs...");
    const res = await pool.query(`
      SELECT * FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 10
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await pool.end();
  }
}

main();
