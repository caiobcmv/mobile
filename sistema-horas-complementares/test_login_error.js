const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connStr = 'postgresql://neondb_owner:npg_qZjJTw4tdp5R@ep-old-surf-aqlcx7ts-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode';

const pool = new Pool({
  connectionString: connStr,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testLogin(email, activeSenha) {
  try {
    const resultado = await pool.query(
        `SELECT u.*, array_agg(r.name) AS roles
         FROM users u
         JOIN user_roles ur ON ur.user_id = u.id
         JOIN roles r ON r.id = ur.role_id
         WHERE u.email = $1 AND u.status = 'active'
         GROUP BY u.id`,
        [email]
    );

    const usuario = resultado.rows[0];
    console.log('User found in db:', usuario);

    if (!usuario) {
        console.log('User not found, returning 401');
        return;
    }

    const senhaCorreta = await bcrypt.compare(activeSenha, usuario.password_hash);
    console.log('Password correct:', senhaCorreta);
    if (!senhaCorreta) {
        console.log('Incorrect password, returning 401');
        return;
    }

    const primeiroAcesso = usuario.last_login_at === null;

    await pool.query(
        `UPDATE users SET last_login_at = NOW() WHERE id = $1`,
        [usuario.id]
    );

    const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            perfis: usuario.roles,
        },
        'test_secret',
        { expiresIn: '8h' }
    );

    console.log('Success! Token generated:', token);

  } catch (err) {
    console.error('Error occurred in login flow!');
    console.error('Error object:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
  } finally {
    await pool.end();
  }
}

testLogin('admin@test.com', '123');
