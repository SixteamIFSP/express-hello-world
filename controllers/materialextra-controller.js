const mysql = require('../database/mysql.js');
const notification = require('../controllers/notification-controller');

exports.postMaterialExtra= async (req, res) => {
    try {
        const query = 'INSERT INTO MaterialExtra (NomeMaterial, Descricao, AulaId, S3Key) VALUES (?,?,?,?)';
        const result = await mysql.execute(query, [
            req.body.nomeMaterial,
            req.body.descricao,
            req.body.aulaId,
            req.body.key
        ]);

        const response = {
            message: 'Upload realizado com sucesso!',
            status: true
        }
        const aluno = await mysql.execute(
            `SELECT * FROM Alunos 
             INNER JOIN Aluno_Turma 
                ON Aluno_Turma.AlunoId = Alunos.id
            INNER JOIN Aulas 
                ON Aulas.TurmaId = Aluno_Turma.Turmaid
                    WHERE Aulas.id = ? AND Alunos.receberNotificacoes = 1`,
            [req.body.aulaId]
        )

        let dataMessage = {
            sound: "default",
            body: "Material Extra disponível para visualização!",
            data: {status: true}
        }
        aluno.map(alun => {
            notification.handleNotification([alun.ExpoToken], dataMessage)
        })
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({ 
            message: 'Não foi possivel realizar o upload do arquivo. Tente Novamente!',
            status: false
        });
    }
};

exports.getMaterialExtra= async (req, res) => {
    try {
        const query = `SELECT * FROM MaterialExtra WHERE AulaId = ?`;
        const result = await mysql.execute(query, [
            req.params.id_aula
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Esta aula não possui materiais extras.',
                status: false
            })
        }
        const response = {
            message: 'Arquivo encotrado',
            result: result,
            status: true
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({ 
            message: 'Arquivo não encontrado',
            status: false
        });
    }
};

exports.deleteMaterialExtra= async (req, res) => {
    try {
        const query = 'DELETE FROM MaterialExtra WHERE id = ?';
        const result = await mysql.execute(query, [
            req.params.id_material,
        ]);

        const response = {
            message: 'Arquivo removido com sucesso',
            status: true
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({ 
            message: 'Não foi possivel remover o arquivo',
            status: false
        });
    }
};