
CREATE OR REPLACE VIEW view_usuario_com_roles AS
SELECT
    u.id,
    u.full_name,
    u.email,
    u.password_hash,
    u.status,
    u.last_login_at,
    u.two_factor_code,
    u.two_factor_expires_at,
    u.two_factor_attempts,
    array_agg(r.name) AS roles
FROM users u
JOIN user_roles ur
    ON ur.user_id = u.id
JOIN roles r
    ON r.id = ur.role_id
WHERE u.status = 'active'
GROUP BY
    u.id,
    u.full_name,
    u.email,
    u.password_hash,
    u.status,
    u.last_login_at,
    u.two_factor_code,
    u.two_factor_expires_at,
    u.two_factor_attempts;


CREATE OR REPLACE VIEW view_cursos_por_usuario AS
SELECT
    cc.user_id,
    c.id AS course_id,
    c.name AS course_name,
    c.code AS course_code,
    c.minimum_required_hours,
    c.is_active AS course_active
FROM course_coordinators cc
JOIN courses c
    ON c.id = cc.course_id
WHERE
    cc.is_active = true
    AND c.is_active = true;


CREATE OR REPLACE VIEW view_submissoes_completo AS
SELECT
    s.id AS id,
    s.id AS submission_id,
    s.user_course_id,
    s.category_id,
    s.title,
    s.description,
    s.activity_date,
    s.submitted_at,
    s.requested_hours,
    s.approved_hours,
    s.status,
    s.institution_name,
    s.certificate_number,
    s.organizer_name,
    s.created_at,
    s.updated_at,
    uc.course_id,
    uc.user_id AS student_user_id,
    u.full_name AS student_name,
    u.email AS student_email,
    sp.ra,
    c.name AS course_name,
    cat.name AS category_name,
    (SELECT sf.storage_path FROM submission_files sf WHERE sf.submission_id = s.id LIMIT 1) AS storage_path
FROM submissions s
JOIN user_courses uc
    ON uc.id = s.user_course_id
JOIN users u
    ON u.id = uc.user_id
LEFT JOIN student_profiles sp
    ON sp.user_id = u.id
JOIN courses c
    ON c.id = uc.course_id
JOIN categories cat
    ON cat.id = s.category_id;


CREATE OR REPLACE VIEW view_alunos_do_curso AS
SELECT
    u.id AS user_id,
    u.full_name,
    u.email,
    u.phone,
    u.status AS user_status,
    sp.ra,
    uc.id AS user_course_id,
    uc.course_id,
    uc.enrollment_date,
    uc.status_matricula,
    uc.is_active AS matricula_ativa
FROM users u
JOIN user_courses uc
    ON uc.user_id = u.id
JOIN user_roles ur
    ON ur.user_id = u.id
JOIN roles r
    ON r.id = ur.role_id
LEFT JOIN student_profiles sp
    ON sp.user_id = u.id
WHERE
    r.name = 'student'
    AND uc.is_active = true;


CREATE OR REPLACE VIEW view_resumo_aluno_por_curso AS
SELECT
    u.id AS user_id,
    u.full_name,
    u.email,
    sp.ra,
    c.id AS course_id,
    c.name AS course_name,
    c.minimum_required_hours AS total_obrigatorio,
    COALESCE(
        SUM(s.approved_hours)
        FILTER (WHERE s.status = 'approved'),
        0
    ) AS total_integralizado,
    COUNT(s.id) AS total_submissoes
FROM users u
JOIN user_courses uc
    ON uc.user_id = u.id
JOIN courses c
    ON c.id = uc.course_id
LEFT JOIN student_profiles sp
    ON sp.user_id = u.id
LEFT JOIN submissions s
    ON s.user_course_id = uc.id
JOIN user_roles ur
    ON ur.user_id = u.id
JOIN roles r
    ON r.id = ur.role_id
WHERE
    r.name = 'student'
    AND uc.is_active = true
GROUP BY
    u.id,
    u.full_name,
    u.email,
    sp.ra,
    c.id,
    c.name,
    c.minimum_required_hours;


CREATE OR REPLACE VIEW view_resumo_por_categoria AS
SELECT
    u.id AS user_id,
    u.full_name,
    c.id AS course_id,
    c.name AS course_name,
    cat.id AS category_id,
    cat.name AS category_name,
    car.min_hours,
    car.max_hours,
    car.is_required,
    uc.id AS user_course_id,
    COALESCE(
        SUM(s.approved_hours)
        FILTER (WHERE s.status = 'approved'),
        0
    ) AS horas_aprovadas,
    COALESCE(
        SUM(s.requested_hours)
        FILTER (
            WHERE s.status NOT IN ('approved', 'rejected')
        ),
        0
    ) AS horas_em_analise,
    GREATEST(
        car.max_hours -
        COALESCE(
            SUM(s.approved_hours)
            FILTER (WHERE s.status = 'approved'),
            0
        ),
        0
    ) AS horas_restantes
FROM users u
JOIN user_courses uc
    ON uc.user_id = u.id
JOIN courses c
    ON c.id = uc.course_id
JOIN course_activity_rules car
    ON car.course_id = uc.course_id
JOIN categories cat
    ON cat.id = car.category_id
LEFT JOIN submissions s
    ON s.user_course_id = uc.id
    AND s.category_id = cat.id
JOIN user_roles ur
    ON ur.user_id = u.id
JOIN roles r
    ON r.id = ur.role_id
WHERE
    r.name = 'student'
    AND uc.is_active = true
GROUP BY
    u.id,
    u.full_name,
    c.id,
    c.name,
    cat.id,
    cat.name,
    car.min_hours,
    car.max_hours,
    car.is_required,
    uc.id;


CREATE OR REPLACE VIEW view_dashboard_coordenador AS
SELECT
    uc.course_id,
    c.name AS course_name,
    COUNT(s.id) AS total_submissoes,
    COUNT(s.id)
        FILTER (WHERE s.status = 'submitted') AS pendentes,
    COUNT(s.id)
        FILTER (WHERE s.status = 'approved') AS aprovadas,
    COUNT(s.id)
        FILTER (WHERE s.status = 'rejected') AS reprovadas,
    ROUND(
        COALESCE(
            AVG(s.approved_hours)
            FILTER (WHERE s.status = 'approved'),
            0
        ),
        1
    ) AS media_horas,
    COUNT(DISTINCT uc.user_id) AS total_alunos
FROM user_courses uc
JOIN courses c
    ON c.id = uc.course_id
JOIN user_roles ur
    ON ur.user_id = uc.user_id
JOIN roles r
    ON r.id = ur.role_id
LEFT JOIN submissions s
    ON s.user_course_id = uc.id
WHERE
    r.name = 'student'
    AND uc.is_active = true
GROUP BY
    uc.course_id,
    c.name;


CREATE OR REPLACE VIEW view_relatorio_geral AS
SELECT
    uc.course_id,
    c.name AS course_name,
    COALESCE(
        SUM(s.approved_hours)
        FILTER (WHERE s.status = 'approved'),
        0
    ) AS total_horas_aprovadas,
    COUNT(s.id) AS total_submissoes,
    COUNT(s.id)
        FILTER (WHERE s.status = 'approved') AS total_aprovadas,
    COUNT(s.id)
        FILTER (WHERE s.status = 'rejected') AS total_reprovadas,
    COUNT(s.id)
        FILTER (
            WHERE s.status NOT IN ('approved', 'rejected')
        ) AS total_pendentes,
    CASE
        WHEN COUNT(s.id) > 0 THEN
            ROUND(
                (
                    COUNT(s.id)
                    FILTER (WHERE s.status = 'approved')::NUMERIC
                    / COUNT(s.id)
                ) * 100,
                1
            )
        ELSE 0
    END AS eficiencia_percentual,
    COUNT(DISTINCT uc.user_id) AS total_alunos,
    COALESCE(
        SUM(s.approved_hours)
        FILTER (WHERE s.status = 'approved')
        / NULLIF(COUNT(DISTINCT uc.user_id), 0),
        0
    ) AS media_horas_por_aluno
FROM user_courses uc
JOIN courses c
    ON c.id = uc.course_id
JOIN user_roles ur
    ON ur.user_id = uc.user_id
JOIN roles r
    ON r.id = ur.role_id
LEFT JOIN submissions s
    ON s.user_course_id = uc.id
WHERE
    r.name = 'student'
    AND uc.is_active = true
GROUP BY
    uc.course_id,
    c.name;

CREATE OR REPLACE VIEW view_coordenadores AS
SELECT
    u.id,
    u.full_name,
    u.email,
    u.phone,
    u.cpf,
    u.status,
    cp.departamento,
    cp.cargo,
    cp.data_nascimento,
    cp.data_admissao,
    cp.observacoes_internas,
    array_agg(DISTINCT c.id)
        FILTER (WHERE c.id IS NOT NULL) AS course_ids,
    array_agg(DISTINCT c.name)
        FILTER (WHERE c.name IS NOT NULL) AS course_names
FROM users u
JOIN user_roles ur
    ON ur.user_id = u.id
JOIN roles r
    ON r.id = ur.role_id
LEFT JOIN coordinator_profiles cp
    ON cp.user_id = u.id
LEFT JOIN course_coordinators cc
    ON cc.user_id = u.id
    AND cc.is_active = true
LEFT JOIN courses c
    ON c.id = cc.course_id
WHERE r.name = 'coordinator'
GROUP BY
    u.id,
    u.full_name,
    u.email,
    u.phone,
    u.cpf,
    u.status,
    cp.departamento,
    cp.cargo,
    cp.data_nascimento,
    cp.data_admissao,
    cp.observacoes_internas;

CREATE OR REPLACE VIEW view_submissoes_alunos AS
SELECT
    s.id,
    s.user_course_id,
    s.category_id,
    s.title,
    s.description,
    s.activity_date,
    s.submitted_at,
    s.requested_hours,
    s.approved_hours,
    s.status,
    s.institution_name,
    s.certificate_number,
    s.organizer_name,
    s.created_at,
    s.updated_at,
    uc.user_id,
    uc.course_id,
    c.name AS course_name,
    cat.name AS category_name,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'id', sf.id,
            'original_filename', sf.original_filename,
            'storage_path', sf.storage_path,
            'ocr_confidence', sf.ocr_confidence,
            'uploaded_at', sf.uploaded_at
        )
    ) FILTER (WHERE sf.id IS NOT NULL) AS arquivos
FROM submissions s
JOIN user_courses uc
    ON uc.id = s.user_course_id
JOIN courses c
    ON c.id = uc.course_id
JOIN categories cat
    ON cat.id = s.category_id
LEFT JOIN submission_files sf
    ON sf.submission_id = s.id
GROUP BY
    s.id,
    uc.user_id,
    uc.course_id,
    c.name,
    cat.name;

CREATE OR REPLACE VIEW view_submissoes_arquivos AS
SELECT
    s.id AS submission_id,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'id', sf.id,
            'original_filename', sf.original_filename,
            'storage_path', sf.storage_path,
            'ocr_confidence', sf.ocr_confidence,
            'uploaded_at', sf.uploaded_at
        )
    ) FILTER (WHERE sf.id IS NOT NULL) AS arquivos
FROM submissions s
LEFT JOIN submission_files sf
    ON sf.submission_id = s.id
GROUP BY s.id;


CREATE OR REPLACE VIEW view_regras_atividades AS
SELECT
    car.id,
    car.course_id,
    car.category_id,
    car.min_hours,
    car.max_hours,
    car.is_required,
    cat.name AS category_name,
    c.name AS course_name,
    cc.user_id AS coordinator_user_id
FROM course_activity_rules car
JOIN categories cat
    ON cat.id = car.category_id
JOIN courses c
    ON c.id = car.course_id
JOIN course_coordinators cc
    ON cc.course_id = c.id
WHERE cc.is_active = true;


CREATE OR REPLACE VIEW view_contadores_dashboard AS
SELECT
    uc.course_id,

    COUNT(DISTINCT u.id) AS total_alunos,

    COUNT(s.id)
        FILTER (
            WHERE s.status NOT IN ('approved', 'rejected')
        ) AS pendentes,

    COUNT(s.id)
        FILTER (
            WHERE s.status = 'approved'
        ) AS aprovadas

FROM users u
JOIN user_courses uc
    ON uc.user_id = u.id
JOIN user_roles ur
    ON ur.user_id = u.id
JOIN roles r
    ON r.id = ur.role_id
LEFT JOIN submissions s
    ON s.user_course_id = uc.id
WHERE
    r.name = 'student'
    AND uc.is_active = true
GROUP BY uc.course_id;

CREATE OR REPLACE VIEW view_submissoes_por_categoria AS
SELECT
    uc.course_id,
    cat.id AS category_id,
    cat.name AS categoria,
    COUNT(*) AS total
FROM submissions s
JOIN user_courses uc
    ON uc.id = s.user_course_id
JOIN categories cat
    ON cat.id = s.category_id
GROUP BY
    uc.course_id,
    cat.id,
    cat.name;

CREATE OR REPLACE VIEW view_cursos_mais_envios AS
SELECT
    uc.course_id,
    c.name AS nome_curso,
    COUNT(*) AS total_envios
FROM submissions s
JOIN user_courses uc
    ON uc.id = s.user_course_id
JOIN courses c
    ON c.id = uc.course_id
GROUP BY
    uc.course_id,
    c.name;

CREATE OR REPLACE VIEW view_submissoes_detalhes AS
SELECT 
    vsc.submission_id AS id,
    vsc.submission_id,
    vsc.user_course_id,
    vsc.category_id,
    vsc.title,
    vsc.description,
    vsc.activity_date,
    vsc.submitted_at,
    vsc.requested_hours,
    vsc.approved_hours,
    vsc.status,
    vsc.institution_name,
    vsc.certificate_number,
    vsc.organizer_name,
    vsc.created_at,
    vsc.updated_at,
    vsc.course_id,
    vsc.student_user_id,
    vsc.student_name,
    vsc.student_email,
    vsc.ra,
    vsc.course_name,
    vsc.category_name,
    COALESCE(vsa.arquivos, '[]'::json) AS arquivos,
    vsc.storage_path,
    (SELECT sf.ocr_extracted_text FROM submission_files sf WHERE sf.submission_id = vsc.submission_id LIMIT 1) AS ocr_extracted_text,
    (SELECT v.comment FROM validations v WHERE v.submission_id = vsc.submission_id ORDER BY v.validated_at DESC LIMIT 1) AS comment
FROM view_submissoes_completo vsc
LEFT JOIN view_submissoes_arquivos vsa ON vsa.submission_id = vsc.submission_id;
