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

const tables = [
  'users',
  'roles',
  'user_roles',
  'courses',
  'student_profiles',
  'coordinator_profiles',
  'user_courses',
  'course_coordinators',
  'categories',
  'course_activity_rules',
  'submissions',
  'submission_files',
  'validations',
  'notifications',
  'audit_logs',
  'trusted_devices',
  'insights',
  'recomendacoes',
  'classificacao_risco',
  'pipeline_execucoes'
];

async function main() {
  try {
    console.log("Connecting to database to reset auto-increment sequences...");
    for (const table of tables) {
      try {
        const checkSequence = await pool.query(`SELECT pg_get_serial_sequence('${table}', 'id') AS seq`);
        const seqName = checkSequence.rows[0]?.seq;
        if (seqName) {
          console.log(`Resetting sequence for table: ${table} (${seqName})`);
          await pool.query(`
            SELECT setval(
              '${seqName}',
              COALESCE((SELECT MAX(id) FROM ${table}), 0) + 1,
              false
            )
          `);
        } else {
          console.log(`No sequence found for table: ${table}`);
        }
      } catch (tableErr) {
        console.warn(`[Warning] Could not reset sequence for table ${table}:`, tableErr.message);
      }
    }
    console.log("All sequences successfully reset!");
  } catch (err) {
    console.error("Critical error resetting sequences:", err);
  } finally {
    await pool.end();
  }
}

main();
