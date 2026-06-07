const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcryptjs');
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
    console.log("Starting database update process...");
    
    // 1. Generate bcrypt hash for '123456'
    const senha = '123456';
    const hashBcrypt = await bcrypt.hash(senha, 10);
    console.log(`Bcrypt hash generated for '${senha}': ${hashBcrypt}`);

    // 2. Reset passwords for all existing users to the bcrypt hash so anyone can log in with '123456'
    console.log("Updating password hashes for all users to bcrypt hash of '123456'...");
    const updateRes = await pool.query('UPDATE users SET password_hash = $1', [hashBcrypt]);
    console.log(`Updated ${updateRes.rowCount} users.`);

    // 3. Re-create or reset Ricardo Oliveira (ricardo@senac.com)
    console.log("Checking if Ricardo Oliveira (ricardo@senac.com) exists...");
    const ricardoCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['ricardo@senac.com']);
    
    let ricardoId;
    if (ricardoCheck.rows.length > 0) {
      ricardoId = ricardoCheck.rows[0].id;
      console.log(`Ricardo Oliveira found with ID ${ricardoId}. Resetting details...`);
      await pool.query(
        `UPDATE users 
         SET full_name = $1, password_hash = $2, phone = $3, cpf = $4, status = 'active', last_login_at = NULL, updated_at = NOW() 
         WHERE id = $5`,
        ['Ricardo Oliveira', hashBcrypt, '(11)99999-0001', '111.111.111-01', ricardoId]
      );
    } else {
      console.log("Ricardo Oliveira not found. Inserting new user...");
      const insertRes = await pool.query(
        `INSERT INTO users (full_name, email, password_hash, phone, cpf, status, last_login_at) 
         VALUES ($1, $2, $3, $4, $5, 'active', NULL) 
         RETURNING id`,
        ['Ricardo Oliveira', 'ricardo@senac.com', hashBcrypt, '(11)99999-0001', '111.111.111-01']
      );
      ricardoId = insertRes.rows[0].id;
      console.log(`Ricardo Oliveira inserted with ID ${ricardoId}.`);
    }

    // 4. Assign role 'coordinator' to Ricardo
    console.log("Assigning role 'coordinator' to Ricardo...");
    const roleRes = await pool.query("SELECT id FROM roles WHERE name = 'coordinator'");
    if (roleRes.rows.length === 0) {
      throw new Error("Role 'coordinator' not found in roles table!");
    }
    const coordinatorRoleId = roleRes.rows[0].id;

    // Check if link exists
    const userRoleCheck = await pool.query(
      "SELECT id FROM user_roles WHERE user_id = $1 AND role_id = $2",
      [ricardoId, coordinatorRoleId]
    );
    if (userRoleCheck.rows.length === 0) {
      await pool.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
        [ricardoId, coordinatorRoleId]
      );
      console.log("Assigned coordinator role to Ricardo.");
    } else {
      console.log("Ricardo already has coordinator role.");
    }

    // 5. Ensure Ricardo has coordinator profile
    console.log("Ensuring Ricardo has coordinator profile...");
    const profileCheck = await pool.query("SELECT id FROM coordinator_profiles WHERE user_id = $1", [ricardoId]);
    if (profileCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO coordinator_profiles (user_id, departamento, cargo, data_admissao) 
         VALUES ($1, 'Tecnologia da Informação', 'Coordenador de Área', '2020-01-10')`,
        [ricardoId]
      );
      console.log("Created coordinator profile for Ricardo.");
    } else {
      console.log("Ricardo already has a coordinator profile.");
    }

    // 6. Set Ricardo as the coordinator of ADS (course_id = 1)
    console.log("Checking current coordinator for course_id = 1 (ADS)...");
    const currentCoord = await pool.query("SELECT user_id, id FROM course_coordinators WHERE course_id = 1");
    if (currentCoord.rows.length > 0) {
      const coordUserId = currentCoord.rows[0].user_id;
      if (coordUserId !== ricardoId) {
        console.log(`Course 1 currently coordinated by user ID ${coordUserId}. Removing assignment to obey uniqueness...`);
        await pool.query("DELETE FROM course_coordinators WHERE course_id = 1");
        console.log(`Inserting Ricardo as coordinator of course 1...`);
        await pool.query(
          "INSERT INTO course_coordinators (user_id, course_id, is_active) VALUES ($1, 1, true)",
          [ricardoId]
        );
      } else {
        console.log("Ricardo is already the coordinator of course 1.");
      }
    } else {
      console.log(`No coordinator for course 1. Inserting Ricardo...`);
      await pool.query(
        "INSERT INTO course_coordinators (user_id, course_id, is_active) VALUES ($1, 1, true)",
        [ricardoId]
      );
    }

    // 7. Reset sequences to prevent conflicts on future inserts
    console.log("Resetting serial sequences for modified tables...");
    const tables = ['users', 'user_roles', 'coordinator_profiles', 'course_coordinators'];
    for (const table of tables) {
      const checkSequence = await pool.query(`SELECT pg_get_serial_sequence('${table}', 'id') AS seq`);
      const seqName = checkSequence.rows[0]?.seq;
      if (seqName) {
        await pool.query(`
          SELECT setval('${seqName}', COALESCE((SELECT MAX(id) FROM ${table}), 0) + 1, false)
        `);
        console.log(`  Reset sequence ${seqName} for ${table}.`);
      }
    }

    console.log("\nDatabase update finished successfully!");
    console.log("You can now log in as coordinator using:");
    console.log("  Email: ricardo@senac.com");
    console.log("  Senha: 123456");
    console.log("  Curso: Análise e Desenvolvimento de Sistemas (ADS)");
    
  } catch (err) {
    console.error("Error updating database:", err);
  } finally {
    await pool.end();
  }
}

main();
