const pool = require('../config/database');

async function main() {
  try {
    console.log("Checking columns of view_submissoes_alunos...");
    const res = await pool.query(`
      SELECT * FROM view_submissoes_alunos
      LIMIT 1
    `);
    console.log(JSON.stringify(res.rows[0], null, 2));
  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await pool.end();
  }
}

main();
