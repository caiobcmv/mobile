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
    console.log("=== COORDINATORS ===");
    const coordRes = await pool.query(`
      SELECT u.id, u.full_name, u.email, c.name AS course_name
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON r.id = ur.role_id
      LEFT JOIN course_coordinators cc ON u.id = cc.user_id
      LEFT JOIN courses c ON cc.course_id = c.id
      WHERE r.name = 'coordinator'
      ORDER BY u.id ASC
    `);
    console.log(JSON.stringify(coordRes.rows, null, 2));

    console.log("\n=== STUDENTS ===");
    const studentRes = await pool.query(`
      SELECT u.id, u.full_name, u.email, sp.ra, c.name AS course_name
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON r.id = ur.role_id
      LEFT JOIN student_profiles sp ON u.id = sp.user_id
      LEFT JOIN user_courses uc ON u.id = uc.user_id
      LEFT JOIN courses c ON uc.course_id = c.id
      WHERE r.name = 'student' AND (uc.is_active = true OR uc.is_active IS NULL)
      ORDER BY u.id ASC
      LIMIT 15
    `);
    console.log(JSON.stringify(studentRes.rows, null, 2));

  } catch (err) {
    console.error("Error fetching lists:", err);
  } finally {
    await pool.end();
  }
}

main();
