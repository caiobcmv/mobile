-- Clean up first
TRUNCATE TABLE classificacao_risco CASCADE;
TRUNCATE TABLE insights CASCADE;
TRUNCATE TABLE recomendacoes CASCADE;

-- Calculate and insert into classificacao_risco
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
    -- Nível de risco
    CASE 
        WHEN COALESCE(SUM(s.approved_hours) FILTER (WHERE s.status = 'approved'), 0) / c.minimum_required_hours * 100 < 40 
             AND (COALESCE(EXTRACT(DAY FROM NOW() - MAX(s.created_at))::integer, 999) > 30 OR COUNT(s.id) FILTER (WHERE s.status = 'rejected') > 3) 
             THEN 'alto'::nivel_risco_enum
        WHEN (COALESCE(SUM(s.approved_hours) FILTER (WHERE s.status = 'approved'), 0) / c.minimum_required_hours * 100 BETWEEN 40 AND 74.99)
             OR COUNT(s.id) FILTER (WHERE s.status = 'submitted') >= 3 
             THEN 'medio'::nivel_risco_enum
        ELSE 'baixo'::nivel_risco_enum
    END AS nivel_risco,
    -- Justificativa
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

-- Populate insights based on classificacao_risco
INSERT INTO insights (perfil_destino, referencia_tipo, referencia_id, tipo_insight, titulo, descricao, nivel_alerta, valor_numerico)
SELECT 
    'coordenador'::perfil_destino_enum,
    'aluno',
    aluno_id,
    'risco_' || nivel_risco,
    'Aluno em risco ' || nivel_risco,
    justificativa,
    CASE WHEN nivel_risco = 'alto' THEN 'alto'::nivel_alerta_enum ELSE 'medio'::nivel_alerta_enum END,
    percentual_conclusao
FROM classificacao_risco
WHERE nivel_risco IN ('alto', 'medio')
ON CONFLICT (referencia_tipo, referencia_id) DO UPDATE SET 
    tipo_insight = EXCLUDED.tipo_insight,
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    nivel_alerta = EXCLUDED.nivel_alerta,
    valor_numerico = EXCLUDED.valor_numerico;

-- Insert static insights for categories/courses
INSERT INTO insights (perfil_destino, referencia_tipo, referencia_id, tipo_insight, titulo, descricao, nivel_alerta, valor_numerico)
SELECT 
    'coordenador'::perfil_destino_enum,
    'curso',
    c.id,
    'ia_generativa',
    'Análise Preditiva - IA',
    'Revisar critérios de avaliação da categoria Eventos.<br>• Estabelecer prazos claros para reduzir o tempo médio.',
    'medio'::nivel_alerta_enum,
    0
FROM courses c
ON CONFLICT (referencia_tipo, referencia_id) DO UPDATE SET 
    descricao = EXCLUDED.descricao;

-- Populate recomendacoes based on classificacao_risco
INSERT INTO recomendacoes (perfil_destino, referencia_id, nome_regra, titulo, recomendacao, motivo, prioridade)
SELECT 
    'aluno'::perfil_destino_enum,
    aluno_id,
    'aluno_risco_alto_retomada',
    'Retome suas submissões urgentemente',
    'Você está com apenas ' || percentual_conclusao || '% da carga exigida. Submeta novas atividades o quanto antes.',
    'Percentual de conclusão crítico.',
    'alta'::prioridade_enum
FROM classificacao_risco
WHERE nivel_risco = 'alto';
