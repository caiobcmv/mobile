const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'atividades_complementares_senac',
  user: 'postgres',
  password: '123456',
});

async function main() {
  try {
    console.log("Connecting...");
    
    // 1. Add column semestre to student_profiles
    console.log("Adding semestre column...");
    await pool.query(`
      ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS semestre integer DEFAULT 1;
    `);
    
    // 2. Distribute semesters for existing student profiles
    console.log("Updating semesters for existing profiles...");
    await pool.query(`UPDATE student_profiles SET semestre = 1 WHERE id = 1;`);
    await pool.query(`UPDATE student_profiles SET semestre = 2 WHERE id = 2;`);
    await pool.query(`UPDATE student_profiles SET semestre = 3 WHERE id = 3;`);
    await pool.query(`UPDATE student_profiles SET semestre = 4 WHERE id = 4;`);
    await pool.query(`UPDATE student_profiles SET semestre = 5 WHERE id = 5;`);
    
    // 3. Populate risk table using the query rules in populate_analytics.sql
    console.log("Truncating risk tables...");
    await pool.query(`TRUNCATE TABLE classificacao_risco CASCADE;`);
    
    console.log("Inserting calculated risk classification...");
    await pool.query(`
      INSERT INTO classificacao_risco (aluno_id, course_id, percentual_conclusao, submissoes_pendentes, submissoes_rejeitadas, dias_sem_submeter, horas_aprovadas, horas_restantes, nivel_risco, justificativa)
      SELECT 
          u.id AS aluno_id,
          uc.course_id,
          COALESCE(ROUND((SUM(s.approved_hours) FILTER (WHERE s.status = 'approved') / c.minimum_required_hours) * 100, 2), 0) AS percentual_conclusao,
          COUNT(s.id) FILTER (WHERE s.status = 'submitted') AS submissoes_pendentes,
          COUNT(s.id) FILTER (WHERE s.status = 'rejected') AS submissoes_rejeitadas,
          COALESCE(EXTRACT(DAY FROM NOW() - MAX(s.created_at))::integer, 999) AS dias_sem_submeter,
          COALESCE(SUM(s.approved_hours) FILTER (WHERE s.status = 'approved'), 0) AS horas_aprovadas,
          GREATEST(c.minimum_required_hours - COALESCE(SUM(s.approved_hours) FILTER (WHERE s.status = 'approved'), 0), 0) AS horas_restantes,
          -- Risk calculation
          CASE 
              WHEN COALESCE(SUM(s.approved_hours) FILTER (WHERE s.status = 'approved'), 0) / c.minimum_required_hours * 100 < 40 
                   AND (COALESCE(EXTRACT(DAY FROM NOW() - MAX(s.created_at))::integer, 999) > 30 OR COUNT(s.id) FILTER (WHERE s.status = 'rejected') > 3) 
                   THEN 'alto'::nivel_risco_enum
              WHEN (COALESCE(SUM(s.approved_hours) FILTER (WHERE s.status = 'approved'), 0) / c.minimum_required_hours * 100 BETWEEN 40 AND 74.99)
                   OR COUNT(s.id) FILTER (WHERE s.status = 'submitted') >= 3 
                   THEN 'medio'::nivel_risco_enum
              ELSE 'baixo'::nivel_risco_enum
          END AS nivel_risco,
          -- Justification
          CASE 
              WHEN COALESCE(SUM(s.approved_hours) FILTER (WHERE s.status = 'approved'), 0) / c.minimum_required_hours * 100 < 40 
                   AND (COALESCE(EXTRACT(DAY FROM NOW() - MAX(s.created_at))::integer, 999) > 30 OR COUNT(s.id) FILTER (WHERE s.status = 'rejected') > 3) 
                   THEN 'Crítico: Aluno com baixo progresso e inatividade ou rejeições frequentes.'
              WHEN (COALESCE(SUM(s.approved_hours) FILTER (WHERE s.status = 'approved'), 0) / c.minimum_required_hours * 100 BETWEEN 40 AND 74.99)
                   OR COUNT(s.id) FILTER (WHERE s.status = 'submitted') >= 3 
                   THEN 'Atenção: Aluno em progresso intermediário ou com várias submissões pendentes.'
              ELSE 'Estável: Aluno com ótimo progresso e sem pendências.'
          END AS justificativa
      FROM users u
      JOIN user_courses uc ON uc.user_id = u.id
      JOIN courses c ON c.id = uc.course_id
      LEFT JOIN submissions s ON s.user_course_id = uc.id
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id
      WHERE r.name = 'student' AND uc.is_active = true
      GROUP BY u.id, uc.course_id, c.minimum_required_hours;
    `);

    console.log("Verifying calculated risk count...");
    const check = await pool.query("SELECT COUNT(*) FROM classificacao_risco");
    console.log("Total risk records:", check.rows[0].count);

  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await pool.end();
  }
}

main();
