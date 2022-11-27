const mysql = require('../database/mysql.js');

const { successResponse, errorResponse } = require('../commons/responseStructure');

exports.patchExpoTokenProfessor = async (req, res) => {
    try {
        const query = 'UPDATE Professores SET ExpoToken = ? WHERE id = ?';
        const result = await mysql.execute(query, [
            req.body.expotoken,
            req.body.id
        ]);

        if(result.changedRows > 0){
            res.status(200).send({
                mensagem: 'Atualizado com sucesso',
                status: true
            })
        }else{
            res.status(200).send({
                mensagem: 'Não Atualizado',
                status: false
            })
        }
    } catch (error) {
        return res.status(200).send({
            message: 'Não foi possivel atualizar. Tente Novamente!',
            status: false
        });
    }
};

exports.patchExpoTokenAluno = async (req, res) => {
    try {
        const query = 'UPDATE Alunos SET ExpoToken = ? WHERE id = ?';
        const result = await mysql.execute(query, [
            req.body.expotoken,
            req.body.id
        ]);

        if(result.changedRows > 0){
            res.status(200).send({
                mensagem: 'Atualizado com sucesso',
                status: true
            })
        }else{
            res.status(200).send({
                mensagem: 'Não Atualizado',
                status: false
            })
        }
    } catch (error) {
        return res.status(200).send({
            message: 'Não foi possivel atualizar. Tente Novamente!',
            status: false
        });
    }
};