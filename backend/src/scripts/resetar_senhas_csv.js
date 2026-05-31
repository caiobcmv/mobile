/**
 * Script: resetar_senhas_csv.js
 * 
 * Os usuários importados do CSV têm hashes SHA-256 que não funcionam
 * com o bcrypt do sistema. Este script redefine a senha de TODOS para 123456
 * e recria os usuários originais do seed (admin, Ricardo, Helena).
 */

const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function run() {
    console.log('\n🔐 Redefinindo senhas para compatibilidade com bcrypt...\n');

    // Gera hash bcrypt para 123456
    const hash = await bcrypt.hash('123456', 10);
    console.log('Hash gerado:', hash.substring(0, 20) + '...');

    // 1) Atualiza todos os usuários com a nova senha bcrypt
    const res = await pool.query(
        `UPDATE users SET password_hash = $1`,
        [hash]
    );
    console.log(`\n✅ ${res.rowCount} usuários tiveram a senha redefinida para: 123456\n`);

    // 2) Recria o Super Admin original (se não existir)
    const adminExiste = await pool.query(`SELECT id FROM users WHERE email = 'admin@senac.com'`);
    if (adminExiste.rows.length === 0) {
        const admin = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, status) VALUES ($1,$2,$3,'active') RETURNING id`,
            ['Super Admin', 'admin@senac.com', hash]
        );
        const roleId = await pool.query(`SELECT id FROM roles WHERE name='super_admin'`);
        await pool.query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1,$2)`, [admin.rows[0].id, roleId.rows[0].id]);
        console.log('✅ Super Admin criado: admin@senac.com / 123456');
    } else {
        await pool.query(`UPDATE users SET password_hash=$1 WHERE email='admin@senac.com'`, [hash]);
        console.log('✅ Super Admin atualizado: admin@senac.com / 123456');
    }

    // 3) Recria o Coordenador Ricardo original (se não existir)
    const ricardoExiste = await pool.query(`SELECT id FROM users WHERE email = 'ricardo@senac.com'`);
    if (ricardoExiste.rows.length === 0) {
        const ricardo = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, status) VALUES ($1,$2,$3,'active') RETURNING id`,
            ['Ricardo Oliveira', 'ricardo@senac.com', hash]
        );
        const roleId = await pool.query(`SELECT id FROM roles WHERE name='coordinator'`);
        await pool.query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1,$2)`, [ricardo.rows[0].id, roleId.rows[0].id]);
        await pool.query(`INSERT INTO coordinator_profiles (user_id, departamento, cargo) VALUES ($1,$2,$3)`, [ricardo.rows[0].id, 'Tecnologia da Informação', 'Coordenador de Área']);
        // Vincula ao primeiro curso de TI
        const curso = await pool.query(`SELECT id FROM courses WHERE code='ADS' LIMIT 1`);
        if (curso.rows.length > 0) {
            await pool.query(`DELETE FROM course_coordinators WHERE course_id = $1`, [curso.rows[0].id]);
            await pool.query(`INSERT INTO course_coordinators (user_id, course_id) VALUES ($1,$2)`, [ricardo.rows[0].id, curso.rows[0].id]);
        }
        console.log('✅ Coordenador criado: ricardo@senac.com / 123456');
    } else {
        await pool.query(`UPDATE users SET password_hash=$1 WHERE email='ricardo@senac.com'`, [hash]);
        const ricardoId = ricardoExiste.rows[0].id;
        const curso = await pool.query(`SELECT id FROM courses WHERE code='ADS' LIMIT 1`);
        if (curso.rows.length > 0) {
            await pool.query(`DELETE FROM course_coordinators WHERE course_id = $1`, [curso.rows[0].id]);
            await pool.query(`INSERT INTO course_coordinators (user_id, course_id) VALUES ($1,$2)`, [ricardoId, curso.rows[0].id]);
        }
        console.log('✅ Coordenador atualizado: ricardo@senac.com / 123456');
    }

    // 4) Recria a Coordenadora Helena original (se não existir)
    const helenaExiste = await pool.query(`SELECT id FROM users WHERE email = 'helena@senac.com'`);
    if (helenaExiste.rows.length === 0) {
        const helena = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, status) VALUES ($1,$2,$3,'active') RETURNING id`,
            ['Helena Souza', 'helena@senac.com', hash]
        );
        const roleId = await pool.query(`SELECT id FROM roles WHERE name='coordinator'`);
        await pool.query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1,$2)`, [helena.rows[0].id, roleId.rows[0].id]);
        await pool.query(`INSERT INTO coordinator_profiles (user_id, departamento, cargo) VALUES ($1,$2,$3)`, [helena.rows[0].id, 'Design e Comunicação', 'Coordenadora de Área']);
        const curso = await pool.query(`SELECT id FROM courses WHERE code='DG' OR code='DSG' LIMIT 1`);
        if (curso.rows.length > 0) {
            await pool.query(`DELETE FROM course_coordinators WHERE course_id = $1`, [curso.rows[0].id]);
            await pool.query(`INSERT INTO course_coordinators (user_id, course_id) VALUES ($1,$2)`, [helena.rows[0].id, curso.rows[0].id]);
        }
        console.log('✅ Coordenadora criada: helena@senac.com / 123456');
    } else {
        await pool.query(`UPDATE users SET password_hash=$1 WHERE email='helena@senac.com'`, [hash]);
        const helenaId = helenaExiste.rows[0].id;
        const curso = await pool.query(`SELECT id FROM courses WHERE code='DG' OR code='DSG' LIMIT 1`);
        if (curso.rows.length > 0) {
            await pool.query(`DELETE FROM course_coordinators WHERE course_id = $1`, [curso.rows[0].id]);
            await pool.query(`INSERT INTO course_coordinators (user_id, course_id) VALUES ($1,$2)`, [helenaId, curso.rows[0].id]);
        }
        console.log('✅ Coordenadora atualizada: helena@senac.com / 123456');
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ PRONTO! Todos os usuários com senha: 123456');
    console.log('═══════════════════════════════════════════════');
    console.log('\n📋 Usuários originais garantidos:');
    console.log('   🛡️  admin@senac.com       → Super Admin');
    console.log('   👔  ricardo@senac.com     → Coordenador (ADS)');
    console.log('   👔  helena@senac.com      → Coordenadora (Design)');
    console.log('   + 527 usuários do CSV com senha redefinida');
    console.log('\n🔑 Senha de todos: 123456\n');
}

run()
    .then(() => pool.end())
    .catch(e => { console.error('❌ Erro:', e.message); pool.end(); });
