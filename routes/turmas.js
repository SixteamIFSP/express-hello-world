const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const TurmasController = require('../controllers/turmas-controller');

const responseStructure = require('../commons/responseStructure');

const { successResponse, errorResponse } = responseStructure();

router.post('/criar', TurmasController.criarTurma);

router.post('/alterar', TurmasController.alterarTurma);

router.get('/busca/:id_professor', (req, res) => {
    const id = req.params.id_professor;
    mysql.getConnection((error, conn) => {
        if(error) return res.status(401).send(errorResponse('Erro no fornecimento de informações para conexão com o mysql.'));
        conn.query(
            'SELECT * FROM Turmas WHERE ProfessorId = ?',
            [id],
            (error, resultado) => {
                conn.release();
                if (error) {
                    return res.status(200).send(errorResponse('Turmas não encontradas.', false));
                }
                if(!resultado.length){
                    return res.status(200).send(errorResponse('Não há turmas para esse professor.', false));
                }
                
                res.status(200).send(successResponse('Busca realizada com sucesso.', true, resultado));
            }
        )
    })
})

router.get('/busca/aluno/:id_aluno', TurmasController.buscaPorAlunos)

router.post('/adiciona', TurmasController.adicionarAluno)

router.get('/alunos/:id_turma', (req, res) => {
    const id_turma = req.params.id_turma;
    mysql.getConnection((error, conn) => {
        conn.query(`SELECT  Alunos.id,
                            Alunos.Nome,
                            Alunos.ProfilePicture
                    FROM   Aluno_Turma
                INNER JOIN Alunos
                        ON Alunos.id = Aluno_Turma.AlunoId
                    WHERE  TurmaId = ? AND Alunos.Ativo = 1`, [id_turma], (error, results) => {
            if (results.length < 1) {
                return res.status(200).send({
                    mensagem: "Alunos não encontrados",

                    status: false
                });
            }
            conn.release();
            res.status(200).send({
                mensagem: 'Busca realizada com sucesso',
                result: results,
                status: true
            });
        })
    })
})

router.post('/todos/aluno', async (req, res) => {
    try {
        mysql.getConnection((error, conn) => {
            conn.query(
                `SELECT       Alunos.Nome,
                              Turmas.TurmaNome,
                              Turmas.id
                         FROM Aluno_Turma
                   INNER JOIN Alunos
                           ON Alunos.id = Aluno_Turma.AlunoId
                   INNER JOIN Turmas
                           ON Turmas.id = Aluno_Turma.TurmaId
                        WHERE Aluno_Turma.AlunoId = ? AND Turmas.ProfessorId = ?;`,
                [req.body.aluno, req.body.professor],
                (error, resultado) => {
                    conn.release();
                    if (resultado.length < 1) {
                        return res.status(200).send({
                            message: 'Não foi encontrado Turmas',
                            status: false
                        })
                    }
                    const response = {
                        Aluno: resultado[0].Nome,
                        turmas: resultado.map(turma => {
                            return {
                                id: turma.id,
                                nome: turma.TurmaNome,
                                descricao: turma.Descricao
                            }
                        })
                    }
                    res.status(200).send({
                        mensagem: "busca realizada com sucesso",
                        result: response,
                        status: true
                    });
                })
        })

    } catch (error) {
        return res.status(200).send({
            mensagem: "Nenhuma turma encontrada",
            status: false
        });
    }
})

router.delete('/excluir/turma/:id_turma', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ mensagem: 'erro no script SQL', status: false });
        conn.query(
            'SELECT * FROM Turmas WHERE id = ?',
            [req.params.id_turma],
            (error, resultado) => {

                if (resultado.length == 0) {
                    return res.status(200).send({
                        mensagem: 'Turma não encontrada',
                        status: false
                    });
                }
                else {
                    conn.query(
                        'DELETE FROM Turmas WHERE id = ?',
                        [req.params.id_turma],
                        (error) => {
                            if (error) {
                                return res.status(200).send({
                                    mensagem: 'Turma não encontrada',
                                    status: false
                                });
                            }
                            else {
                                res.status(200).send({
                                    mensagem: 'Turma Excluida',
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

router.post('/excluir/aluno', (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM Aluno_Turma WHERE TurmaId = ? and AlunoId = ?',
            [req.body.turma, req.body.aluno],
            (error, resultado) => {
                conn.release();
                if (resultado.length == 0) {
                    return res.status(200).send({
                        mensagem: 'Turma ou aluno não encontrado',
                        status: false
                    });
                }
                else {
                    conn.query(
                        'DELETE FROM Aluno_Turma WHERE TurmaId = ? and AlunoId = ?',
                        [req.body.turma, req.body.aluno],
                        (error) => {
                            if (error) {
                                return res.status(200).send({
                                    error: error,
                                    mensagem: 'Turma ou aluno não encontrado',
                                    status: false
                                });
                            }
                            else {
                                res.status(200).send({
                                    mensagem: 'Aluno removido da turma',
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


router.post('/busca/aluno/:id_aluno', async (req, res  ) =>{
    try {
        mysql.getConnection((error, conn) =>{
            conn.query(
                `SELECT       Alunos.Nome,
                              Turmas.TurmaNome,
                              Turmas.id,
                              Turmas.Descricao
                         FROM Aluno_Turma
                   INNER JOIN Alunos
                           ON Alunos.id = Aluno_Turma.AlunoId
                   INNER JOIN Turmas
                           ON Turmas.id = Aluno_Turma.TurmaId
                        WHERE Aluno_Turma.AlunoId = ?;`,
                [req.params.id_aluno],
                (error, resultado  ) => {
                    conn.release();
                    if (resultado.length < 1) {
                        return res.status(200).send({
                            message: 'Não foi encontrado Turmas',
                            status: false
                        })
                    }
                    const response = {
                        Aluno: resultado[0].Nome,
                        turmas: resultado.map(turma => {
                            return {
                                id: turma.id,
                                nome: turma.TurmaNome,
                                descricao: turma.Descricao
                            }
                        })
                    }
                    res.status(200).send({
                        mensagem: "busca realizada com sucesso",
                        result: response,
                        status: true
                    });
                })
                })
                    
        } catch (error) {
            return res.status(200).send({
                mensagem: "Nenhuma turma encontrada", 
                status: false 
            });
        }
    })

router.get('/busca_turma/detalhe/:id_turma', TurmasController.getTurmaDetalhe);


module.exports = router;