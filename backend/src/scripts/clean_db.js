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

const query = `
  TRUNCATE TABLE 
    users, 
    roles, 
    user_roles, 
    courses, 
    student_profiles, 
    coordinator_profiles, 
    user_courses, 
    course_coordinators, 
    categories, 
    course_activity_rules, 
    submissions, 
    submission_files, 
    validations, 
    notifications, 
    audit_logs, 
    trusted_devices, 
    insights, 
    recomendacoes, 
    classificacao_risco, 
    pipeline_execucoes 
  RESTART IDENTITY 
  CASCADE;
`;

async function main() {
  try {
    console.log("Connecting to database to clear all table records...");
    await pool.query(query);
    console.log("All tables successfully cleared and sequences reset to 1!");
  } catch (err) {
    console.error("Error clearing database tables:", err.message);
  } finally {
    await pool.end();
  }
}

main();
