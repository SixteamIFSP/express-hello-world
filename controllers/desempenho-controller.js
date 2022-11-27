const mysql = require('../database/mysql.js');

exports.getDesempenhoAluno = async (req, res) => {
    try {
        const query = `SELECT   Alunos.Nome,
                                DesempenhoAluno.AlunoId,
                                DesempenhoAluno.id,
                                DesempenhoAluno.Desempenho,
                                DesempenhoAluno.createdAt
                    FROM        DesempenhoAluno
                    INNER JOIN   Alunos
                            ON   Alunos.id = DesempenhoAluno.AlunoId
                        WHERE    DesempenhoAluno.AlunoId = ?`;
        const result = await mysql.execute(query, [
            req.params.id_aluno
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Não foi encontrado Desempenho',
                status: false
            })
        }

        const response = {
            message: 'Desempenho encontrado',
            result: result.map(desem => {
                return {
                    id: desem.id,
                    nome: desem.Desempenho,
                    criação: desem.createdAt
                }
            }),
            status: true
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({
            message: 'Não foi possivel encontrar Desempenho',
            status: false
        });
    }
};

exports.getDesempenhoAlunoParametrosTurma = async (req, res) => {
    try {
        const query = `SELECT    Parametros.NomeParametro,
                                 TipoParametro.Tipo,
                                 Desempenho_Parametro.Valor,
                                 DesempenhoAluno.Desempenho,
                                 Alunos.Nome,
                                 DesempenhoAluno.createdAt
                        FROM     Desempenho_Parametro
                    INNER JOIN   DesempenhoAluno
                        ON       DesempenhoAluno.id = Desempenho_Parametro.DesempenhoAlunoId
                    INNER JOIN   Alunos
                        ON       Alunos.id = DesempenhoAluno.AlunoId
                    INNER JOIN   Parametros
                        ON       Parametros.id = Desempenho_Parametro.ParametroId
                    INNER JOIN   TipoParametro
                        ON       TipoParametro.id = Parametros.TipoParametroId
                        WHERE    DesempenhoAluno.AlunoId = ? AND Desempenho_Parametro.ParametroId = ? AND DesempenhoAluno.TurmaId = ? ORDER BY DesempenhoAluno.createdAt`;
        const result = await mysql.execute(query, [
            req.body.aluno,
            req.body.parametro,
            req.body.turma
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Não foi encontrado Desempenho',
                status: false
            })
        }

        const response = {
            Nome: result[0].Nome,
            Parametro: result[0].NomeParametro,
            Tipo: result[0].Tipo,
            Parametros: result.map(param => {
                return {
                    valor: param.Valor,
                    data: param.createdAt
                    }
            })
        }
        return res.status(200).send({
            mensagem: 'Busca realizada com sucesso',
            result: response,
            status: true
        });
    } catch (error) {
        return res.status(200).send({
            message: 'Não foi possivel encontrar Desempenho',
            error: error,
            status: false
        });
    }
};