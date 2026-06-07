const pool = require('../config/database');

async function main() {
  try {
    console.log("Fetching latest 5 submissions...");
    const res = await pool.query(`
      SELECT s.id, s.title, s.status, s.created_at, uc.user_id, u.full_name, u.email,
             (SELECT COUNT(*) FROM submission_files sf WHERE sf.submission_id = s.id) as files_count
      FROM submissions s
      JOIN user_courses uc ON uc.id = s.user_course_id
      JOIN users u ON u.id = uc.user_id
      ORDER BY s.created_at DESC
      LIMIT 5
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await pool.end();
  }
}

main();
