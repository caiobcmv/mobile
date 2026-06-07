const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
     console.log('Entrou no login');
    const { email, senha, password } = req.body;
    const actualSenha = senha || password;
    console.log('Login tentativa:', email);

    try {
        const resultado = await pool.query(
            `SELECT u.*, array_agg(r.name) AS roles
             FROM users u
             JOIN user_roles ur ON ur.user_id = u.id
             JOIN roles r ON r.id = ur.role_id
             LEFT JOIN student_profiles sp ON sp.user_id = u.id
             WHERE (u.email = $1 OR u.cpf = $1 OR sp.ra = $1) AND u.status = 'active'
             GROUP BY u.id`,
            [email]
        );

        const usuario = resultado.rows[0];

        if (!usuario) {
            return res.status(401).json({ erro: "Email ou senha incorretos." });
        }

        if (!actualSenha) {
            return res.status(400).json({ erro: "Senha não fornecida." });
        }

        const senhaCorreta = await bcrypt.compare(actualSenha, usuario.password_hash);
        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Email ou senha incorretos." });
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
                perfis: usuario.roles, // array: ['student'], ['coordinator'], ['super_admin']
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        const user = {
            id: usuario.id,
            name: usuario.full_name,
            email: usuario.email,
            role: usuario.roles && usuario.roles.length > 0 ? (
                usuario.roles.includes('super_admin') ? 'superadmin' :
                usuario.roles.includes('coordinator') ? 'coordenador' : 'aluno'
            ) : 'aluno'
        };

        res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token,
            perfis: usuario.roles,
            primeiroAcesso,
            nome: usuario.full_name,
            email: usuario.email,
            user
        });

    } catch (err) {
        res.status(500).json({ erro: "Erro no login: " + err.message });
    }
};

exports.setup = async (req, res) => {
    const { email, senha, nome } = req.body;

    try {
        // Verifica se já existe um super_admin
        const existe = await pool.query(
            `SELECT u.id FROM users u
             JOIN user_roles ur ON ur.user_id = u.id
             JOIN roles r ON r.id = ur.role_id
             WHERE r.name = 'super_admin'`
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ erro: "Super Admin já existe. Rota desativada." });
        }

        const senhaCripto = await bcrypt.hash(senha, 10);

        const novoUsuario = await pool.query(
            `INSERT INTO users (full_name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, full_name, email`,
            [nome, email, senhaCripto]
        );

        const userId = novoUsuario.rows[0].id;

        const role = await pool.query(
            `SELECT id FROM roles WHERE name = 'super_admin'`
        );

        await pool.query(
            `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`,
            [userId, role.rows[0].id]
        );

        res.status(201).json({
            mensagem: "Super Admin criado com sucesso!",
            dados: novoUsuario.rows[0]
        });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.trocarSenha = async (req, res) => {
    const { senhaAtual, novaSenha } = req.body;
    const userId = req.usuario.id;

    try {
        const resultado = await pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        );

        const usuario = resultado.rows[0];

        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.password_hash);
        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Senha atual incorreta." });
        }

        if (novaSenha.length < 6) {
            return res.status(400).json({ erro: "A nova senha deve ter pelo menos 6 caracteres." });
        }

        const novaSenhaCripto = await bcrypt.hash(novaSenha, 10);

        await pool.query(
            `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
            [novaSenhaCripto, userId]
        );

        res.status(200).json({ mensagem: "Senha alterada com sucesso!" });

    } catch (err) {
        res.status(500).json({ erro: "Erro ao trocar senha: " + err.message });
    }
};

exports.primeiroAcesso = async (req, res) => {
    const { novaSenha } = req.body;
    const userId = req.usuario.id;

    try {
        if (!novaSenha || novaSenha.length < 6) {
            return res.status(400).json({ erro: "A nova senha deve ter pelo menos 6 caracteres." });
        }

        const novaSenhaCripto = await bcrypt.hash(novaSenha, 10);

        await pool.query(
            `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
            [novaSenhaCripto, userId]
        );

        res.status(200).json({ mensagem: "Senha redefinida com sucesso!" });

    } catch (err) {
        res.status(500).json({ erro: "Erro ao redefinir senha: " + err.message });
    }
};

exports.me = async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT u.id, u.full_name as nome, u.email, array_agg(r.name) AS perfis
             FROM users u
             JOIN user_roles ur ON ur.user_id = u.id
             JOIN roles r ON r.id = ur.role_id
             WHERE u.id = $1
             GROUP BY u.id`,
            [req.usuario.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        const usuario = resultado.rows[0];

        res.status(200).json({
            id: usuario.id,
            full_name: usuario.nome,
            nome: usuario.nome,
            email: usuario.email,
            perfis: usuario.perfis,
            user: {
                id: usuario.id,
                name: usuario.nome,
                email: usuario.email,
                role: usuario.perfis && usuario.perfis.length > 0 ? (
                    usuario.perfis.includes('super_admin') ? 'superadmin' :
                    usuario.perfis.includes('coordinator') ? 'coordenador' : 'aluno'
                ) : 'aluno'
            }
        });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao obter dados do usuário: " + err.message });
    }
};