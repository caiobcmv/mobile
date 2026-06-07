const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env') });

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      host: 'localhost',
      port: 5432,
      database: 'atividades_complementares_senac',
      user: 'postgres',
      password: '123456',
    });

async function main() {
  try {
    const userRes = await pool.query("SELECT * FROM users WHERE email = 'ricardo@senac.com'");
    console.log("User Ricardo:", userRes.rows[0]);

    if (userRes.rows.length > 0) {
      const uId = userRes.rows[0].id;
      const roleRes = await pool.query(
        "SELECT r.name FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = $1",
        [uId]
      );
      console.log("Ricardo Roles:", roleRes.rows);

      const profileRes = await pool.query("SELECT * FROM coordinator_profiles WHERE user_id = $1", [uId]);
      console.log("Ricardo Profile:", profileRes.rows[0]);

      const coordRes = await pool.query(
        "SELECT cc.*, c.name AS course_name FROM course_coordinators cc JOIN courses c ON c.id = cc.course_id WHERE cc.user_id = $1",
        [uId]
      );
      console.log("Ricardo Courses Coordinated:", coordRes.rows);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

main();
