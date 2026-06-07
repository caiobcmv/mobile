const pool = require('../config/database');
const multer = require('multer');
const path = require('path');
const { executarOCR } = require('../services/ocrService');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const nomeUnico =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;

        cb(null, nomeUnico);
    }
});

const fileFilter = (req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase();

    const extensoesPermitidas = [
        '.jpg',
        '.jpeg',
        '.png',
        '.pdf'
    ];

    if (extensoesPermitidas.includes(extensao)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Tipo de arquivo não permitido. Use JPG, PNG ou PDF.'
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

function getFileType(originalname) {
    const ext = path.extname(originalname).toLowerCase();

    if (ext === '.pdf') return 'pdf';

    if (
        ext === '.jpg' ||
        ext === '.jpeg' ||
        ext === '.png'
    ) {
        return 'image';
    }

    return 'other';
}

const executarOCREAtualizar = async (fileId, caminhoFisico, mimetype) => {
    try {
        const resultadoOCR = await executarOCR(
            caminhoFisico,
            mimetype
        );

        await pool.query(
            `
            UPDATE submission_files
            SET ocr_extracted_text = $1,
                ocr_confidence = $2
            WHERE id = $3
            `,
            [
                resultadoOCR.texto || resultadoOCR.textoBruto || '',
                resultadoOCR.confianca || 0,
                fileId
            ]
        );
        console.log(`[OCR Background] Arquivo ${fileId} processado com sucesso.`);
    } catch (err) {
        console.error(`[OCR Background Error] Erro ao processar arquivo ${fileId} em segundo plano:`, err.message);
    }
};

/**
 * Utilizada dentro da criação da submissão
 * usando a mesma transação (client).
 */
const processarEInserirArquivo = async (
    client,
    submissionId,
    file
) => {
    const resultado = await client.query(
        `
        INSERT INTO submission_files
        (
            submission_id,
            original_filename,
            storage_path,
            file_type,
            mime_type,
            file_size_kb,
            ocr_extracted_text,
            ocr_confidence
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4::file_type_enum,
            $5,
            $6,
            $7,
            $8
        )
        RETURNING *
        `,
        [
            submissionId,
            file.originalname,
            `/uploads/${file.filename}`,
            getFileType(file.originalname),
            file.mimetype,
            Math.round(file.size / 1024),
            'Processando OCR...',
            0
        ]
    );

    const arquivoInserido = resultado.rows[0];

    const caminhoFisico = path.join(
        __dirname,
        '../../uploads',
        file.filename
    );

    // Executa em segundo plano sem bloquear a requisição HTTP principal
    setImmediate(() => {
        executarOCREAtualizar(arquivoInserido.id, caminhoFisico, file.mimetype)
            .catch(err => console.error("Erro na execução em segundo plano do OCR:", err));
    });

    return {
        ...arquivoInserido,
        dados_ia_extraidos: {
            titulo: 'Processando...',
            instituicao: 'Processando...',
            duracao: 'Processando...',
            ano: 'Processando...'
        }
    };
};

/**
 * POST /aluno/submissao/:submission_id/arquivo
 */
exports.uploadCertificado = [
    upload.any(),

    async (req, res) => {
        const { submission_id } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                erro: 'Nenhum arquivo enviado.'
            });
        }

        const client = await pool.connect();

        try {
            const submissao = await client.query(
                `
                SELECT s.id
                FROM submissions s
                JOIN user_courses uc
                    ON uc.id = s.user_course_id
                WHERE s.id = $1
                  AND uc.user_id = $2
                `,
                [
                    submission_id,
                    req.usuario.id
                ]
            );

            if (submissao.rows.length === 0) {
                return res.status(404).json({
                    erro: 'Submissão não encontrada.'
                });
            }

            const arquivosInseridos =
                await Promise.all(
                    req.files.map(file =>
                        processarEInserirArquivo(
                            client,
                            submission_id,
                            file
                        )
                    )
                );

            res.status(201).json({
                mensagem:
                    `${arquivosInseridos.length} certificado(s) enviado(s) com sucesso!`,
                arquivos: arquivosInseridos
            });

        } catch (err) {
            console.error(err);

            res.status(500).json({
                erro: err.message
            });
        } finally {
            client.release();
        }
    }
];

/**
 * GET /aluno/submissao/:submission_id/arquivo
 */
exports.getCertificado = async (req, res) => {
    const { submission_id } = req.params;

    try {
        const resultado = await pool.query(
            `
            SELECT *
            FROM submission_files
            WHERE submission_id = $1
            ORDER BY uploaded_at DESC
            `,
            [submission_id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Nenhum arquivo encontrado.'
            });
        }

        res.status(200).json(
            resultado.rows
        );

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
};

module.exports.upload = upload;
module.exports.processarEInserirArquivo =processarEInserirArquivo;