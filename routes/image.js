const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const fs = require('fs')
const { uploadFile, getFileStream } = require('../database/s3');

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

router.get('/document/:key', (req, res) => {
    const key = req.params.key
    const readStream = getFileStream(key)
    readStream.pipe(res)

})

router.post('/document', upload.single('image'), async (req, res) => {
    const file = req.file
    const result = await uploadFile(file)
    res.status(200).send({
        mensagem: 'Upload realizado com sucesso',
        imagePath: `/imagem/document/${result.Key}`,
        Key: result.Key,
        status: true
    });
})


router.post('/document/artemarcial', async (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `INSERT INTO ArtesMarciais_Professor (ProfessorId, ArteMarcialId, Document) VALUES (?, ?, ?)`,
            [req.body.professor, req.body.artemarcial, req.body.dockey],
            (error) => {
                conn.release();
                if (error) {
                    return res.status(200).send({
                        mensagem: "Arte Marcial ja inserida",
                        response: null,
                        status: false
                    });
                }
                res.status(201).send({
                    mensagem: 'Elementos inseridos com sucesso',
                    status: true
                });
            }
        )
    })
})

router.post('/document/pfp/aluno', async (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `UPDATE Alunos SET ProfilePicture = ? WHERE id = ?`,
            [req.body.imagekey, req.body.aluno],
            (error) => {
                conn.release();
                if (error) {
                    return res.status(200).send({
                        mensagem: "Erro ao inserir imagem",
                        response: null,
                        status: false
                    });
                }
                res.status(201).send({
                    mensagem: 'Imagem trocada com sucesso',
                    status: true
                });
            }
        )
    })
})

router.post('/document/pfp/professor', async (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `UPDATE Professores SET ProfilePicture = ? WHERE id = ?`,
            [req.body.imagekey, req.body.professor],
            (error) => {
                conn.release();
                if (error) {
                    return res.status(200).send({
                        mensagem: "Erro ao inserir imagem",
                        response: null,
                        status: false
                    });
                }
                res.status(201).send({
                    mensagem: 'Imagem trocada com sucesso',
                    status: true
                });
            }
        )
    })
})

module.exports = router;