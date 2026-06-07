const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env') });

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      connectionString: 'postgresql://neondb_owner:npg_qZjJTw4tdp5R@ep-old-surf-aqlcx7ts-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require',
      ssl: { rejectUnauthorized: false }
    });

async function main() {
  try {
    console.log("Querying all users from database...");
    const res = await pool.query(`
      SELECT 
        u.id, 
        u.full_name, 
        u.email, 
        u.phone, 
        u.cpf, 
        u.status, 
        u.created_at,
        COALESCE(
          (SELECT STRING_AGG(r.name, ', ') 
           FROM user_roles ur 
           JOIN roles r ON ur.role_id = r.id 
           WHERE ur.user_id = u.id),
          'sem função'
        ) AS roles
      FROM users u
      ORDER BY u.id ASC
    `);
    
    console.log(`Total users found: ${res.rows.length}`);
    
    // Write JSON file
    const jsonPath = path.join(__dirname, 'users_output.json');
    fs.writeFileSync(jsonPath, JSON.stringify(res.rows, null, 2), 'utf8');
    console.log(`JSON list written to: ${jsonPath}`);
    
    // Write Markdown Table
    let md = "# Lista de Usuários do Banco Neon\n\n";
    md += `Total de usuários: **${res.rows.length}**\n\n`;
    md += "| ID | Nome Completo | E-mail | Telefone | CPF | Status | Função | Criado Em |\n";
    md += "|---|---|---|---|---|---|---|---|\n";
    
    for (const row of res.rows) {
      const createdAt = row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'N/A';
      md += `| ${row.id} | ${row.full_name} | ${row.email} | ${row.phone || '-'} | ${row.cpf || '-'} | ${row.status} | ${row.roles} | ${createdAt} |\n`;
    }
    
    const mdPath = path.join(__dirname, 'users_list.md');
    fs.writeFileSync(mdPath, md, 'utf8');
    console.log(`Markdown list written to: ${mdPath}`);
    
  } catch (err) {
    console.error("Database query failed:", err);
  } finally {
    await pool.end();
  }
}

main();
