const mysql = require('../database/mysql.js');

exports.postTriagem = async (req, res) => {
    try {
        const query = 'INSERT INTO Triagem (Data_Nascimento, Altura, Peso, Problema_Ortopedico, Doencas_Cronicas, Lesoes, AlunoId, Exercicios, Comentario, DisfuncaoColuna, Fumante, LimitacaoMovimento, PossuiCirurgia, RemedioControlado, SenteDoresArticulacoes, Suplementos, ObjetivoCompeticao, ObjetivoCondicionamento, ObjetivoEmagrecimento, ObjetivoHipertrofia, Colesterol) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        const result = await mysql.execute(query, [        
            req.body.dataNascimento,
            req.body.altura,
            req.body.peso,
            req.body.problemaOrtopedico,
            req.body.doencasCronicas,
            req.body.lesoes,
            req.body.alunoId,
            req.body.jaFezExercicios,
            req.body.comentario,
            req.body.disfuncaoColuna,
            req.body.fumante,
            req.body.limitacaoMovimento,
            req.body.possuiCirurgia,
            req.body.remedioControlado,
            req.body.senteDoresArticulacoes,
            req.body.suplementos,
            req.body.objetivoCompeticao,
            req.body.objetivoCondicionamento,
            req.body.objetivoEmagrecimento,
            req.body.objetivoHipertrofia,
            req.body.colesterol
        ]);

        const response = {
            message: 'Triagem registrada com sucesso!',
            status: true
        }

        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({
            message: 'Não foi possivel registrar a Triagem. Tente Novamente!',
            error: error,
            status: false
        });
    }
};

exports.getTriagem = async (req, res) => {
    try {
        const query = `SELECT * FROM Triagem WHERE AlunoId = ?`;
        const result = await mysql.execute(query, [
            req.params.id_aluno
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Este aluno não realizou a Triagem.',
                status: false
            })
        }
        const response = {
            message: 'Triagem encotrada',
            result: result,
            status: true
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({
            message: 'Triagem não encontrada',
            status: false
        });
    }
};

exports.updateTriagem = async (req, res) => {
    try {
        const query = 'UPDATE Triagem SET Altura = ?, Peso = ?, Problema_Ortopedico = ?, Doencas_Cronicas = ?, Lesoes = ? WHERE id = ?';
        const result = await mysql.execute(query, [
            req.body.altura,
            req.body.peso,
            req.body.problemaOrtopedico,
            req.body.doencasCronicas,
            req.body.lesoes,
            req.body.id
        ]);
        const response = {
            message: 'Triagem Atualizada com Sucesso!',
            status: true
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({
            error: error,
            message: 'Não foi possível atualizar a Triagem. Tente Novamente!',
            status: false
        });
    }
};