const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Carrega as variáveis de ambiente do arquivo .env do backend
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

const connectionString = process.env.DATABASE_URL;

const files = [
  'schema.sql',
  'triggers.sql',
  'views.sql',
  'idx.sql',
  'seed.sql',
  'populate_analytics.sql'
];

async function run() {
  let client;
  if (connectionString) {
    client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
  } else {
    client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
  }

  try {
    console.log('Conectando ao banco de dados...');
    await client.connect();
    console.log('Conectado com sucesso!');

    // Resolve o caminho da pasta banco_atv_complementares
    const dbDir = path.resolve(__dirname, '../../..', 'banco_atv_complementares');
    console.log(`Diretório dos scripts SQL: ${dbDir}`);

    for (const file of files) {
      const filePath = path.join(dbDir, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`Aviso: Arquivo ${file} não encontrado em ${filePath}, pulando...`);
        continue;
      }
      console.log(`Executando ${file}...`);
      let sqlContent = fs.readFileSync(filePath, 'utf8');
      
      if (file === 'triggers.sql') {
        // Remove triggers antes de criá-los para evitar erros de duplicidade
        const drops = [
          'DROP TRIGGER IF EXISTS trg_users_updated_at ON users CASCADE;',
          'DROP TRIGGER IF EXISTS trg_courses_updated_at ON courses CASCADE;',
          'DROP TRIGGER IF EXISTS trg_submissions_updated_at ON submissions CASCADE;',
          'DROP TRIGGER IF EXISTS trg_coordinator_profiles_updated_at ON coordinator_profiles CASCADE;',
          'DROP TRIGGER IF EXISTS trg_student_profiles_updated_at ON student_profiles CASCADE;',
          'DROP TRIGGER IF EXISTS trg_course_activity_rules_updated_at ON course_activity_rules CASCADE;',
          'DROP TRIGGER IF EXISTS trg_prevent_editing_closed ON submissions CASCADE;'
        ].join('\n');
        await client.query(drops);
      }

      if (file === 'idx.sql') {
        sqlContent = sqlContent.replace(/CREATE INDEX/ig, 'CREATE INDEX IF NOT EXISTS');
      }

      await client.query(sqlContent);
      console.log(`${file} executado com sucesso.`);
    }

    console.log('Migração do banco de dados concluída com sucesso!');
  } catch (err) {
    console.error('Erro ao executar scripts SQL no banco:', err);
  } finally {
    await client.end();
  }
}

run();
