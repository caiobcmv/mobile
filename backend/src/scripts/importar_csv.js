/**
 * Script: importar_csv.js
 * Importa todos os CSVs da pasta dados_população_banco para o banco PostgreSQL.
 * 
 * Uso:
 *   node src/scripts/importar_csv.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const CSV_DIR = 'C:\\Users\\User\\Downloads\\dados_população_banco';

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Lê um CSV e retorna array de objetos { col: valor }
async function lerCSV(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];
        let headers = null;
        const rl = readline.createInterface({ input: fs.createReadStream(filePath, 'utf8') });
        rl.on('line', (line) => {
            if (!headers) {
                headers = line.split(',');
                return;
            }
            // Parser simples de CSV (sem aspas internas)
            const vals = line.split(',');
            const obj = {};
            headers.forEach((h, i) => {
                obj[h.trim()] = vals[i] !== undefined ? vals[i].trim() : null;
            });
            rows.push(obj);
        });
        rl.on('close', () => resolve({ headers, rows }));
        rl.on('error', reject);
    });
}

function nullify(val) {
    if (val === '' || val === 'None' || val === 'NULL' || val === null || val === undefined) return null;
    if (val === 'True') return true;
    if (val === 'False') return false;
    return val;
}

async function truncarTabelas() {
    console.log('🗑️  Limpando tabelas para reimportação...');
    // Ordem inversa de dependência
    await client.query(`
        TRUNCATE TABLE 
            validations, submission_files, submissions,
            user_courses, student_profiles, coordinator_profiles,
            course_coordinators, course_activity_rules, user_roles,
            users, courses, categories, roles
        RESTART IDENTITY CASCADE
    `);
    console.log('   ✅ Tabelas limpas.\n');
}

async function importarRoles() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'roles.csv'));
    console.log(`📥 Importando roles (${rows.length} registros)...`);
    for (const r of rows) {
        await client.query(
            `INSERT INTO roles (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
            [r.id, r.name, nullify(r.description)]
        );
    }
    await client.query(`SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles))`);
    console.log('   ✅ roles importados.\n');
}

async function importarCourses() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'courses.csv'));
    console.log(`📥 Importando courses (${rows.length} registros)...`);
    for (const r of rows) {
        await client.query(
            `INSERT INTO courses (id, name, code, minimum_required_hours, description, modalidade, turno, semestres, is_active, created_at, updated_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING`,
            [r.id, r.name, r.code, r.minimum_required_hours, nullify(r.description),
             nullify(r.modalidade), nullify(r.turno), nullify(r.semestres),
             nullify(r.is_active), nullify(r.created_at), nullify(r.updated_at)]
        );
    }
    await client.query(`SELECT setval('courses_id_seq', (SELECT MAX(id) FROM courses))`);
    console.log('   ✅ courses importados.\n');
}

async function importarCategories() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'categories.csv'));
    console.log(`📥 Importando categories (${rows.length} registros)...`);
    for (const r of rows) {
        await client.query(
            `INSERT INTO categories (id, name, description)
             VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING`,
            [r.id, r.name, nullify(r.description)]
        );
    }
    await client.query(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))`);
    console.log('   ✅ categories importadas.\n');
}

async function importarUsers() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'users.csv'));
    console.log(`📥 Importando users (${rows.length} registros)...`);
    let ok = 0;
    for (const r of rows) {
        try {
            await client.query(
                `INSERT INTO users (id, full_name, email, password_hash, phone, cpf, status, created_at, updated_at, last_login_at)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (id) DO NOTHING`,
                [r.id, r.full_name, r.email, r.password_hash, nullify(r.phone),
                 nullify(r.cpf), nullify(r.status) || 'active',
                 nullify(r.created_at), nullify(r.updated_at), nullify(r.last_login_at)]
            );
            ok++;
        } catch(e) {
            console.warn(`   ⚠️  User ${r.email}: ${e.message}`);
        }
    }
    await client.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`);
    console.log(`   ✅ ${ok}/${rows.length} users importados.\n`);
}

async function importarUserRoles() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'user_roles.csv'));
    console.log(`📥 Importando user_roles (${rows.length} registros)...`);
    let ok = 0;
    for (const r of rows) {
        try {
            await client.query(
                `INSERT INTO user_roles (user_id, role_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
                [r.user_id, r.role_id]
            );
            ok++;
        } catch(e) {
            console.warn(`   ⚠️  user_role user_id=${r.user_id}: ${e.message}`);
        }
    }
    console.log(`   ✅ ${ok}/${rows.length} user_roles importados.\n`);
}

async function importarStudentProfiles() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'student_profiles.csv'));
    console.log(`📥 Importando student_profiles (${rows.length} registros)...`);
    let ok = 0;
    for (const r of rows) {
        try {
            await client.query(
                `INSERT INTO student_profiles (user_id, ra, created_at, updated_at)
                 VALUES ($1,$2,$3,$4) ON CONFLICT (user_id) DO NOTHING`,
                [r.user_id, nullify(r.ra), nullify(r.created_at), nullify(r.updated_at)]
            );
            ok++;
        } catch(e) {
            console.warn(`   ⚠️  student_profile user_id=${r.user_id}: ${e.message}`);
        }
    }
    console.log(`   ✅ ${ok}/${rows.length} student_profiles importados.\n`);
}

async function importarCoordinatorProfiles() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'coordinator_profiles.csv'));
    console.log(`📥 Importando coordinator_profiles (${rows.length} registros)...`);
    let ok = 0;
    for (const r of rows) {
        try {
            await client.query(
                `INSERT INTO coordinator_profiles (user_id, departamento, cargo, data_admissao, created_at, updated_at)
                 VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (user_id) DO NOTHING`,
                [r.user_id, nullify(r.departamento), nullify(r.cargo),
                 nullify(r.data_admissao), nullify(r.created_at), nullify(r.updated_at)]
            );
            ok++;
        } catch(e) {
            console.warn(`   ⚠️  coordinator_profile user_id=${r.user_id}: ${e.message}`);
        }
    }
    console.log(`   ✅ ${ok}/${rows.length} coordinator_profiles importados.\n`);
}

async function importarCourseCoordinators() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'course_coordinators.csv'));
    console.log(`📥 Importando course_coordinators (${rows.length} registros)...`);
    let ok = 0;
    for (const r of rows) {
        try {
            await client.query(
                `INSERT INTO course_coordinators (user_id, course_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
                [r.user_id, r.course_id]
            );
            ok++;
        } catch(e) {
            console.warn(`   ⚠️  course_coordinator: ${e.message}`);
        }
    }
    console.log(`   ✅ ${ok}/${rows.length} course_coordinators importados.\n`);
}

async function importarCourseActivityRules() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'course_activity_rules.csv'));
    console.log(`📥 Importando course_activity_rules (${rows.length} registros)...`);
    let ok = 0;
    for (const r of rows) {
        try {
            await client.query(
                `INSERT INTO course_activity_rules (id, course_id, category_id, min_hours, max_hours, is_required, notes, created_at, updated_at)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO NOTHING`,
                [r.id, r.course_id, r.category_id, nullify(r.min_hours), nullify(r.max_hours),
                 nullify(r.is_required), nullify(r.notes), nullify(r.created_at), nullify(r.updated_at)]
            );
            ok++;
        } catch(e) {
            console.warn(`   ⚠️  rule id=${r.id}: ${e.message}`);
        }
    }
    await client.query(`SELECT setval('course_activity_rules_id_seq', (SELECT MAX(id) FROM course_activity_rules))`);
    console.log(`   ✅ ${ok}/${rows.length} course_activity_rules importadas.\n`);
}

async function importarUserCourses() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'user_courses.csv'));
    console.log(`📥 Importando user_courses (${rows.length} registros)...`);
    let ok = 0;
    for (const r of rows) {
        try {
            await client.query(
                `INSERT INTO user_courses (id, user_id, course_id, status_matricula, is_active, created_at)
                 VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
                [r.id, r.user_id, r.course_id,
                 nullify(r.status_matricula) || 'ativo',
                 nullify(r.is_active) !== null ? nullify(r.is_active) : true,
                 nullify(r.created_at)]
            );
            ok++;
        } catch(e) {
            console.warn(`   ⚠️  user_course id=${r.id}: ${e.message}`);
        }
    }
    await client.query(`SELECT setval('user_courses_id_seq', (SELECT MAX(id) FROM user_courses))`);
    console.log(`   ✅ ${ok}/${rows.length} user_courses importados.\n`);
}

async function importarSubmissions() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'submissions.csv'));
    console.log(`📥 Importando submissions (${rows.length} registros)...`);
    let ok = 0;
    for (const r of rows) {
        try {
            await client.query(
                `INSERT INTO submissions (id, user_course_id, category_id, title, description, activity_date, submitted_at, requested_hours, approved_hours, status, institution_name, certificate_number, organizer_name, created_at, updated_at)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) ON CONFLICT (id) DO NOTHING`,
                [r.id, r.user_course_id, r.category_id, r.title,
                 nullify(r.description), nullify(r.activity_date), nullify(r.submitted_at),
                 nullify(r.requested_hours), nullify(r.approved_hours),
                 nullify(r.status) || 'draft',
                 nullify(r.institution_name), nullify(r.certificate_number),
                 nullify(r.organizer_name), nullify(r.created_at), nullify(r.updated_at)]
            );
            ok++;
        } catch(e) {
            console.warn(`   ⚠️  submission id=${r.id}: ${e.message}`);
        }
    }
    await client.query(`SELECT setval('submissions_id_seq', (SELECT MAX(id) FROM submissions))`);
    console.log(`   ✅ ${ok}/${rows.length} submissions importadas.\n`);
}

async function importarValidations() {
    const { rows } = await lerCSV(path.join(CSV_DIR, 'validations.csv'));
    console.log(`📥 Importando validations (${rows.length} registros)...`);
    let ok = 0;
    for (const r of rows) {
        try {
            await client.query(
                `INSERT INTO validations (id, submission_id, validator_user_id, validation_status, previous_status, comment, approved_hours, validated_at)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
                [r.id, r.submission_id, r.validator_user_id,
                 nullify(r.validation_status), nullify(r.previous_status),
                 nullify(r.comment), nullify(r.approved_hours),
                 nullify(r.validated_at) || nullify(r.created_at)]
            );
            ok++;
        } catch(e) {
            console.warn(`   ⚠️  validation id=${r.id}: ${e.message}`);
        }
    }
    await client.query(`SELECT setval('validations_id_seq', (SELECT MAX(id) FROM validations))`);
    console.log(`   ✅ ${ok}/${rows.length} validations importadas.\n`);
}

async function main() {
    await client.connect();
    console.log('\n🚀 Iniciando importação dos CSVs...\n');
    
    try {
        await truncarTabelas();
        await importarRoles();
        await importarCourses();
        await importarCategories();
        await importarUsers();
        await importarUserRoles();
        await importarStudentProfiles();
        await importarCoordinatorProfiles();
        await importarCourseCoordinators();
        await importarCourseActivityRules();
        await importarUserCourses();
        await importarSubmissions();
        await importarValidations();

        // Contagem final
        const counts = await client.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) as users,
                (SELECT COUNT(*) FROM courses) as courses,
                (SELECT COUNT(*) FROM categories) as categories,
                (SELECT COUNT(*) FROM submissions) as submissions,
                (SELECT COUNT(*) FROM validations) as validations,
                (SELECT COUNT(*) FROM user_courses) as user_courses,
                (SELECT COUNT(*) FROM student_profiles) as student_profiles,
                (SELECT COUNT(*) FROM coordinator_profiles) as coordinator_profiles
        `);

        const c = counts.rows[0];
        console.log('═══════════════════════════════════════');
        console.log('✅ IMPORTAÇÃO CONCLUÍDA COM SUCESSO!');
        console.log('═══════════════════════════════════════');
        console.log(`   👥 Usuários:              ${c.users}`);
        console.log(`   📚 Cursos:                ${c.courses}`);
        console.log(`   🏷️  Categorias:            ${c.categories}`);
        console.log(`   📄 Submissões:            ${c.submissions}`);
        console.log(`   ✔️  Validações:            ${c.validations}`);
        console.log(`   🎓 Vínculos aluno/curso:  ${c.user_courses}`);
        console.log(`   👨‍🎓 Perfis de alunos:      ${c.student_profiles}`);
        console.log(`   🧑‍💼 Perfis coordenadores:  ${c.coordinator_profiles}`);
        console.log('═══════════════════════════════════════\n');

    } catch (err) {
        console.error('❌ Erro durante importação:', err.message);
    } finally {
        await client.end();
    }
}

main();
