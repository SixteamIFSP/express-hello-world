const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const DesempenhoController = require('../controllers/desempenho-controller');

router.post('/criar/desempenho', (req, res) => {

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO DesempenhoAluno (Desempenho, AlunoId, createdAt, TurmaId) VALUES (?, ?, ?, ?)',
            [req.body.nome, req.body.alunoId, req.body.date, req.body.turma],
            (error) => {
                conn.release();
                if (error) {
                    return res.status(200).send({
                        error: error,
                        status: false
                    });
                }
                res.status(201).send({
                    mensagem: 'Desempenho criado com sucesso',
                    status: true
                });
            }
        )
    })
})


router.get('/parametro', (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT    Parametros.id,
                           Parametros.NomeParametro,
                           Parametros.TipoParametroId,
                           TipoParametro.Tipo
                    FROM   Parametros
                INNER JOIN TipoParametro
                        ON TipoParametro.id = Parametros.TipoParametroId`,
            (error, resultado) => {
                conn.release();
                if (error) {
                    return res.status(200).send({
                        error: error,
                        status: false
                    });
                }
                res.status(200).send({
                    mensagem: 'Busca realizada com sucesso',
                    resultado,
                    status: true
                });
            }
        )
    })
})

router.get('/tipo_parametro', (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT * FROM TipoParametro`,
            (error, resultado) => {
                conn.release();
                if (error) {
                    return res.status(200).send({
                        error: error,

                        status: false
                    });
                }
                res.status(200).send({
                    mensagem: 'Busca realizada com sucesso',
                    resultado,
                    status: true
                });
            }
        )
    })
})

router.post('/busca/aluno', (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT     Alunos.Nome,
                        DesempenhoAluno.AlunoId,
                        DesempenhoAluno.id,
                        DesempenhoAluno.Desempenho,
                        DesempenhoAluno.createdAt
                FROM    DesempenhoAluno
           INNER JOIN   Alunos
                 ON     Alunos.id = DesempenhoAluno.AlunoId
           INNER JOIN   Turmas
                ON      Turmas.id = DesempenhoAluno.TurmaId
                 WHERE  DesempenhoAluno.AlunoId = ? AND Turmas.ProfessorId = ?`,
            [req.body.aluno, req.body.professor],
            (error, resultado) => {
                conn.release();
                if (resultado.length < 1) {
                    return res.status(200).send({
                        mensagem: "Desempenhos não encontrados",
                        status: false
                    });
                }
                const result = {
                    NomeAluno: resultado[0].Nome,
                    desempenhos: resultado.map(desem => {
                        return {
                            id: desem.id,
                            nome: desem.Desempenho,
                            criação: desem.createdAt
                        }
                    }),
                }
                res.status(200).send({
                    mensagem: 'Busca realizada com sucesso',
                    result: result,
                    status: true
                });
            }
        )
    })
})

router.get('/busca/desempenho/detalhe/:id_desempenho', (req, res) => {
    const id = req.params.id_desempenho
    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT     Parametros.NomeParametro,
                        TipoParametro.Tipo,
                        Desempenho_Parametro.Valor,
                        DesempenhoAluno.Desempenho
                FROM    Desempenho_Parametro
            INNER JOIN  DesempenhoAluno
                ON      DesempenhoAluno.id = Desempenho_Parametro.DesempenhoAlunoId
            INNER JOIN  Parametros
                 ON     Parametros.id = Desempenho_Parametro.ParametroId
            INNER JOIN  TipoParametro
                 ON     TipoParametro.id = Parametros.TipoParametroId
                 WHERE  Desempenho_Parametro.DesempenhoAlunoId = ?`,
            [id],
            (error, resultado) => {
                conn.release();
                if (resultado.length == 0) {
                    return res.status(200).send({
                        mensagem: "Parametros não encontrados",
                        status: false
                    });
                }
                const result = {
                    Nome: resultado[0].Desempenho,
                    Parametros: resultado.map(param => {
                        return {
                            nome: param.NomeParametro,
                            valor: param.Valor,
                            tipo: param.Tipo
                        }
                    }),

                }
                if (error) {
                    return res.status(200).send({
                        error: error,

                        status: false
                    });
                }
                res.status(200).send({
                    mensagem: 'Busca realizada com sucesso',
                    result: result,
                    status: true
                });
            }
        )
    })
})

router.post('/busca/desempenho/parametro', (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT     Parametros.NomeParametro,
                        TipoParametro.Tipo,
                        Desempenho_Parametro.Valor,
                        DesempenhoAluno.Desempenho,
                        Alunos.Nome,
                        DesempenhoAluno.createdAt
                FROM    Desempenho_Parametro
            INNER JOIN  DesempenhoAluno
                ON      DesempenhoAluno.id = Desempenho_Parametro.DesempenhoAlunoId
            INNER JOIN  Alunos
                ON      Alunos.id = DesempenhoAluno.AlunoId
            INNER JOIN  Parametros
                 ON     Parametros.id = Desempenho_Parametro.ParametroId
            INNER JOIN  TipoParametro
                 ON     TipoParametro.id = Parametros.TipoParametroId
                 WHERE  DesempenhoAluno.AlunoId = ? AND Desempenho_Parametro.ParametroId = ? ORDER BY DesempenhoAluno.createdAt`,
            [req.body.aluno, req.body.parametro],
            (error, resultado) => {
                conn.release();
                if (resultado.length < 1) {
                    return res.status(200).send({
                        mensagem: "Parametros não encontrados",
                        status: false
                    });
                }
                const result = {
                    Nome: resultado[0].Nome,
                    Parametro: resultado[0].NomeParametro,
                    Tipo: resultado[0].Tipo,
                    Parametros: resultado.map(param => {
                        return {
                            valor: param.Valor,
                            data: param.createdAt
                        }
                    }),
                }
                if (error) {
                    return res.status(200).send({
                        error: error,

                        status: false
                    });
                }
                res.status(200).send({
                    mensagem: 'Busca realizada com sucesso',
                    result: result,
                    status: true
                });
            }
        )
    })
})

router.post('/parametros/aluno', async (req, res) => {
    try {
        mysql.getConnection((error, conn) => {
            conn.query(
                `SELECT DISTINCT  Alunos.Nome,
                            Turmas.TurmaNome,
                            Parametros.id,
                            Parametros.NomeParametro,
                            TipoParametro.Tipo
                    FROM    Desempenho_Parametro
              INNER JOIN    DesempenhoAluno
					ON      DesempenhoAluno.id = Desempenho_Parametro.DesempenhoAlunoId
               INNER JOIN   Alunos
                     ON     Alunos.id = DesempenhoAluno.AlunoId
               INNER JOIN   Turmas
                    ON      Turmas.id = DesempenhoAluno.TurmaId
                INNER JOIN  Parametros
                    ON      Parametros.id = Desempenho_Parametro.ParametroId
               INNER JOIN   TipoParametro
                    ON      TipoParametro.id = Parametros.TipoParametroId
                    WHERE   Alunos.id = ? AND Turmas.id = ?`,
                [req.body.aluno, req.body.turma],
                (error, resultado) => {
                    conn.release();
                    if (resultado.length < 1) {
                        return res.status(200).send({
                            mensagem: "Parametros não encontrados",
                            status: false
                        });
                    }
                    const result = {
                        NomeAluno: resultado[0].Nome,
                        Turma: resultado[0].NomeTurma,
                        parametros: resultado.map(param => {
                            return {
                                id: param.id,
                                nome: param.NomeParametro,
                                tipo: param.Tipo
                            }
                        }),
                    }
                    res.status(200).send({
                        mensagem: 'Busca realizada com sucesso',
                        result: result,
                        status: true
                    });
                }
            )
        })
    } catch (error) {
        return res.status(200).send({
            error: error,
            status: false
        });
    }
})

router.get('/busca/aluno', (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT     Alunos.Nome,
                        DesempenhoAluno.AlunoId,
                        DesempenhoAluno.id,
                        DesempenhoAluno.Desempenho,
                        DesempenhoAluno.createdAt
                FROM    DesempenhoAluno
           INNER JOIN   Alunos
                 ON     Alunos.id = DesempenhoAluno.AlunoId
           INNER JOIN   Turmas
                ON      Turmas.id = DesempenhoAluno.TurmaId
                 WHERE  DesempenhoAluno.AlunoId = ? AND Turmas.ProfessorId = ?`,
            [req.body.aluno, req.body.professor],
            (error, resultado) => {
                conn.release();
                if (resultado.length < 1) {
                    return res.status(200).send({
                        mensagem: "Desempenhos não encontrados",
                        status: false
                    });
                }
                const result = {
                    NomeAluno: resultado[0].Nome,
                    desempenhos: resultado.map(desem => {
                        return {
                            id: desem.id,
                            nome: desem.Desempenho,
                            criacao: desem.createdAt
                        }
                    }),
                }
                res.status(200).send({
                    mensagem: 'Busca realizada com sucesso',
                    result: result,
                    status: true
                });
            }
        )
    })
})

router.post('/inserir/parametro', (req, res) => {

    mysql.getConnection((error, conn) => {

        conn.query('SELECT * FROM Parametros WHERE NomeParametro = ?', [req.body.parametro], (error, results) => {
            if (error) { return res.status(200).send({ error: error }) }
            if (results.length > 0) {
                return res.status(200).send({
                    mensagem: "Parametro ja inserido",
                    status: false
                });
            } else {
                conn.query(
                    'INSERT INTO Parametros (NomeParametro, TipoParametroId) VALUES (?, ?)',
                    [req.body.parametro, req.body.tipoparametroid],
                    (error) => {
                        if (error) {
                            return res.status(200).send({
                                mensagem: "Parametro ja inserido",
                                status: false
                            });
                        }
                        res.status(201).send({
                            mensagem: "Parametro inserido",
                            status: true
                        })
                    }
                )
            }
        })
    })
})

router.post('/inserir/parametro/desempenho', (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO Desempenho_Parametro (ParametroId, DesempenhoAlunoId, Valor) VALUES (?, ?, ?)',
            [req.body.parametro, req.body.desempenho, req.body.valor],
            (error) => {
                conn.release();
                if (error) {
                    return res.status(200).send({
                        mensagem: "Parametro ja inserido",
                        status: false
                    });
                }
                res.status(201).send({
                    mensagem: "Parametro inserido no Desempenho!",
                    status: true
                })
            }
        )

    })
})

router.delete('/excluir/desempenho/:id_desempenho', (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM DesempenhoAluno WHERE id = ?',
            [req.params.id_desempenho],
            (error, resultado) => {
                conn.release();
                if (resultado.length == 0) {
                    return res.status(200).send({
                        mensagem: 'Desempenho não encontrado',
                        status: false
                    });
                }
                else {
                    conn.query(
                        'DELETE FROM DesempenhoAluno WHERE id = ?',
                        [req.params.id_desempenho],
                        (error) => {
                            if (error) {
                                return res.status(200).send({
                                    mensagem: 'Desempenho não encontrado',
                                    status: false
                                });
                            }
                            else {
                                res.status(200).send({
                                    mensagem: 'Desempenho Excluido',
                                    status: true
                                });
                            }
                        }
                    )
                }
            }
        )
    })
})

router.get('/buscaAluno/:id_aluno', DesempenhoController.getDesempenhoAluno);
router.post('/buscaParametroTurma', DesempenhoController.getDesempenhoAlunoParametrosTurma);


module.exports = router;
