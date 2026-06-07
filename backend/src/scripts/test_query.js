const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_qZjJTw4tdp5R@ep-old-surf-aqlcx7ts-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    console.log("Connecting to database...");
    const userRes = await pool.query("SELECT id, full_name, email FROM users WHERE email = 'ricardo@senac.com'");
    if (userRes.rows.length === 0) {
      console.log("Ricardo Oliveira not found in database.");
      return;
    }
    const ricardo = userRes.rows[0];
    console.log("Found user:", ricardo);

    console.log("Running getMeusCursos query...");
    const query = `SELECT c.id, c.name, c.code, c.modalidade,
                          COALESCE(
                              (SELECT COUNT(*)::int 
                               FROM submissions s
                               JOIN user_courses uc ON uc.id = s.user_course_id
                               WHERE uc.course_id = c.id AND s.status NOT IN ('approved', 'rejected')), 
                              0
                          ) AS pending_count
                   FROM courses c
                   JOIN course_coordinators cc ON cc.course_id = c.id
                   WHERE cc.user_id = $1 AND cc.is_active = true AND c.is_active = true
                   ORDER BY c.name`;
    const res = await pool.query(query, [ricardo.id]);
    console.log("Query succeeded! Result rows:", res.rows);
  } catch (err) {
    console.error("Query failed with error:", err);
  } finally {
    await pool.end();
  }
}

main();
