const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const path = require('path');
const UserController = require('../controllers/users-controller');

const envPathFileUrl = path.join(__dirname, '../.env');

require('dotenv')
    .config({ path: envPathFileUrl });

router.post('/cadastro/aluno', (req, res ) => {

    mysql.getConnection((error, conn) => {
        if (!error) {
            conn.query('SELECT * FROM Alunos WHERE Email = ? AND Ativo = 1', [req.body.email], (error, results) => {
                
                if (error) { return res.status(200).send({ error: error }) }
                if (results.length > 0) {
                    conn.release();
                    res.status(200).send({
                         mensagem: 'Aluno ja cadastrado',
                         status: true
                 })
                } 
                else {
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if (errBcrypt) { return res.status(200).send({ error: errBcrypt }) }
                        conn.query('SELECT * FROM Alunos WHERE Email = ? AND Ativo = 0', [req.body.email], (error, results) => {
                            if (error) { return res.status(200).send({ error: error }) }
                            if (results.length > 0) {
                                conn.query(`UPDATE Alunos SET Nome = ?,
                                                                    receberNotificacoes = ?,
                                                                    Telefone = ?,
                                                                    Senha = ?,
                                                                    Ativo = 1
                                                                    WHERE id = ?`, 
                                [req.body.nome, req.body.receberNot, req.body.telefone, hash, results[0].id],
                                (error) =>{
                                    conn.release();
                                    if (error) {
                                        return res.status(200).send({
                                            error: error,
                                              
                                            status: false
                                        });
                                    }
                                    res.status(201).send({
                                        mensagem: 'Aluno Cadastrado com sucesso',
                                        id: results[0].id,
                                        status: true
                                    }); 
                                })
                            }else{
                                conn.query(
                                    'INSERT INTO Alunos (Nome, Email, Senha, Telefone, receberNotificacoes) VALUES (?,?,?,?,?)',
                                    [req.body.nome, req.body.email, hash, req.body.telefone, req.body.receberNot],
                                    (error, resultado) => {
                                        conn.release();
                                        if (error) {
                                            return res.status(200).send({
                                                error: error,
                                                  
                                                status: false
                                            });
                                        }
                                        res.status(201).send({
                                            mensagem: 'Aluno Cadastrado com sucesso',
                                            id: resultado.insertId,
                                            status: true
                                        });
                                    }
                                )
                            }
                        })
                        
                    })
                }
            })
        } else { console.log(error) }

    })
});

router.post('/cadastro/professor', (req, res ) => {
    mysql.getConnection((error, conn) => {
        if (!error) {
            conn.query('SELECT * FROM Professores WHERE Email = ? AND Ativo = 1', [req.body.email], (error, results) => {
                if (error) { return res.status(200).send({ error: error }) }
                
                if (results.length > 0) {
                    conn.release();
                    res.status(200).send({ 
                        mensagem: 'Professor ja cadastrado',
                        status: false
                    })
                } else {
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if (errBcrypt) { return res.status(200).send({ error: errBcrypt }) }
                        conn.query('SELECT * FROM Professores WHERE Email = ? AND Ativo = 0', [req.body.email], (error, results) => {
                            
                            if (error) { return res.status(200).send({ error: error }) }
                            if (results.length > 0) {
                                conn.query(`UPDATE Professores SET Nome = ?,
                                                                    receberNotificacoes = ?,
                                                                    Telefone = ?,
                                                                    Senha = ?,
                                                                    Ativo = 1
                                                                    WHERE id = ?`, 
                                [req.body.nome, req.body.receberNot, req.body.telefone, hash, results[0].id],
                                (error, resultado) =>{
                                    conn.release();
                                    if (error) {
                                        return res.status(200).send({
                                            error: error,
                                              
                                            status: false
                                        });
                                    }
                                    res.status(201).send({
                                        mensagem: 'Professor Cadastrado com sucesso',
                                        status: true
                                    }); 
                                })
                            }else{
                                conn.query(
                                    'INSERT INTO Professores (Nome, Email, Senha, Telefone, receberNotificacoes) VALUES (?,?,?,?,?)',
                                    [req.body.nome, req.body.email, hash, req.body.telefone, req.body.receberNot],
                                    (error, resultado) => {
                                        conn.release();
                                        if (error) {
                                            return res.status(200).send({
                                                error: error,
                                                  
                                                status: false
                                            });
                                        }
                                        res.status(201).send({
                                            mensagem: 'Professor Cadastrado com sucesso',
                                            status: true
                                        });
                                    }
                                )
                            }
                        })
                        
                    })
                }
            })
        } else { 
            return res.status(200).send({
                error: "Erro de conexão no servidor", 
                status: false
            });
        }

    })
});

router.post('/login/aluno', (req, res ) => {
    try{
        mysql.getConnection((error, conn) => {
            if(error) {return res.status(200).send({error: error})}
            const query = 'SELECT * FROM Alunos WHERE Email = ? AND Ativo = 1';
            conn.query(query, [req.body.email],(error, results) =>{
                conn.release();
                if(error) {return res.status(200).send({error: error})}
                if(results.length <1) {
                    return res.status(200).send ({
                        mensagem: 'E-mail ou Senha incorretos',
                        status: false
                     })
                 
                }
                bcrypt.compare(req.body.senha, results[0].Senha, (err, result) =>{
                    if(result){
                        let jwtToken = jwt.sign({
                            id_usuario: results[0].id,
                            email: results[0].Email
                        },
                        process.env.JWT_KEY,
                        {
                             expiresIn: "1h"
                        });
     
                        return res.status(200).send({
                            mensagem:'Autenticado com sucesso',
                            nome: results[0].Nome,
                            email: results[0].Email,
                            userID: results[0].id,
                            pfp: results[0].ProfilePicture,
                            expotoken: results[0].ExpoToken,
                            tipoUsuario: 2,
                            token: jwtToken,
                            status: true
                         })
                    }else{
                     return res.status(200).send({
                         mensagem: 'E-mail ou Senha incorretos',
                         status: false
                      })
                     }
                })
            })
        })
    }catch(error){
        return res.status(200).send({
            message: 'Erro ao realizar login',
            error: error,
            status: false
        });
    }
   
});

router.post('/login/professor', (req, res ) => {
    try{
        mysql.getConnection((error, conn) => {
            if(error) {return res.status(200).send({error: error})}
            const query = 'SELECT * FROM Professores WHERE Email = ? AND Ativo = 1';
            conn.query(query, [req.body.email],(error, results) =>{
                conn.release();
                if(error) {return res.status(200).send({error: error})}
                if(results.length <1) {
                    return res.status(200).send ({
                        mensagem: 'E-mail ou Senha incorretos',
                        status: false
                     })
                }
                bcrypt.compare(req.body.senha, results[0].Senha, (err, result) =>{
                    if(result){
                        let jwtToken = jwt.sign({
                            id_usuario: results[0].id,
                            email: results[0].Email
                        },
                        process.env.JWT_KEY,
                        {
                             expiresIn: "1h"
                        });
     
                        return res.status(200).send({
                            mensagem:'Autenticado com sucesso',
                            nome: results[0].Nome,
                            email: results[0].Email,
                            userID: results[0].id,
                            pfp: results[0].ProfilePicture,
                            expotoken: results[0].ExpoToken,
                            tipoUsuario: 1,
                            token: jwtToken,
                            status: true
                         })
                    }
                    else{
                        return res.status(200).send({
                            mensagem: 'E-mail ou Senha incorretos',
                            status: false
                         })
                    }
                })
            })
        })
    }catch(error){
        return res.status(200).send({
            message: 'Erro ao realizar login',
            error: error,
            status: false
        });
    }
    
 });

router.patch('/senha/aluno', (req, res ) =>{
    mysql.getConnection((error, conn) => {
        if(error) {
            return res.status(200).send({error: error})
        }
        conn.query('SELECT * FROM Alunos WHERE id = ?', [req.body.id], (error, results) => {
            if (error) 
                return res.status(200).send({
                    mensagem: "Houve um erro na conexão",
                    error: error,
                    status:false
                })
            
            if (results.length == 0) {
                conn.release();
                return res.status(200).send({
                    mensagem: 'Aluno não encontrado',
                    status:false
                })
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(200).send({ error: errBcrypt }) }
                    bcrypt.compare(req.body.senhaAntiga, results[0].Senha, (err, result) =>{
                        if(result){
                            conn.query(`UPDATE Alunos SET Senha = ? WHERE id = ?`,
                            [hash, req.body.id],
                            (error,     ) => {
                                conn.release();
                                if (error) {
                                    return res.status(200).send({
                                        error: error,
                                          
                                        status: false
                                    });
                                }
                                res.status(200).send({
                                    mensagem: 'Senha Alterada com Sucesso',
                                    status: true
                                });
                            })
                        }else{
                            return res.status(200).send({
                                mensagem: 'Senha antiga incorreta',
                                status: false
                            })
                        }
                })
            })
        }});
    })
})

router.patch('/senha/professor', (req, res ) =>{
    mysql.getConnection((error, conn) => {
        if(error) 
            return res.status(200).send({
                mensagem: "Houve um erro na conexão",
                error: error,
                status:false
            })
        
        conn.query('SELECT * FROM Professores WHERE id = ?', [req.body.id], (error, results) => {
            if (error)
                return res.status(200).send({ 
                    mensagem: "Houve um erro na Query",
                    error: error,
                    status:false
                }) 

            if (results.length == 0) {
                conn.release();
                res.status(200).send({ 
                    mensagem: 'Professor não encontrado',
                    status:false

                })
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) 
                        return res.status(200).send({
                            error: errBcrypt,
                            status:false
                        })
                    
                bcrypt.compare(req.body.senhaAntiga, results[0].Senha, (err, result) =>{
                    if(result){
                        conn.query(`UPDATE Professores SET Senha = ? WHERE id = ?`,
                        [hash, req.body.id],
                        (error,     ) => {
                            conn.release();
                            if (error) {
                                return res.status(200).send({
                                    error: error, 
                                    status: false
                                });
                            }
                            res.status(200).send({
                                mensagem: 'Senha Alterada com Sucesso',
                                status: true
                            });
                        })
                    }else{
                        return res.status(200).send({
                            mensagem: 'Senha antiga incorreta',
                            status: false
                        })
                    }                   
                })
                })
            }
        });
    })
})

router.patch('/perfil/aluno', (req, res ) =>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(200).send({error: error})}
        conn.query('SELECT * FROM Alunos WHERE id = ?', [req.body.id], (error, results) => {
            if (error) { return res.status(200).send({ error: error }) }
            if (results.length == 0) {
                conn.release();
                res.status(200).send({ mensagem: 'Aluno não encontrado' })
            } else {
                conn.query(`UPDATE Alunos SET Nome = ?,
                                              receberNotificacoes = ?,
                                              Telefone = ?
                                        WHERE id = ?`,
                [req.body.nome, req.body.recebernotificacoes, req.body.telefone, req.body.id],
                (error,     ) => {
                    conn.release();
                    if (error) {
                        return res.status(200).send({
                            error: error,
                              
                            status: false
                        });
                    }
                    res.status(201).send({
                        mensagem: 'Perfil Alterado com Sucesso',
                        status: true
                    });
                })
            }    
        })
    })
});

router.patch('/perfil/professor', (req, res ) =>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(200).send({error: error})}
        conn.query('SELECT * FROM Professores WHERE id = ?', [req.body.id], (error, results) => {
            if (error) { return res.status(200).send({ error: error }) }
            if (results.length == 0) {
                conn.release();
                res.status(200).send({ mensagem: 'Professor não encontrado' })
            } else {
                conn.query(`UPDATE Professores SET Nome = ?,
                                              receberNotificacoes = ?,
                                              Telefone = ?
                                        WHERE id = ?`,
                [req.body.nome, req.body.recebernotificacoes, req.body.telefone, req.body.id],
                (error) => {
                    conn.release();
                    if (error) {
                        return res.status(200).send({
                            error: error,
                              
                            status: false
                        });
                    }
                    res.status(201).send({
                        mensagem: 'Perfil Alterado com Sucesso',
                        status: true
                    });
                })
            }    
        })
    })
});

router.get('/busca/aluno/:id_aluno', (req, res ) =>{
    const id = req.params.id_aluno
    mysql.getConnection((error, conn) =>{
        conn.query(
            `SELECT * FROM Alunos WHERE Alunos.id = ?`,
            [id],
            (error, resultado ) => {
                conn.release();
                if (resultado.length <= 0) {
                    return res.status(200).send({
                        mensagem: 'Aluno não encontrado',
                        
                        status: false
                    });
                }
                const result = {
                    id: resultado[0].id,
                    Nome: resultado[0].Nome,
                    Email: resultado[0].Email,
                    Telefone: resultado[0].Telefone,
                    ReceberNot: resultado[0].receberNotificacoes,
                    pfp: resultado[0].ProfilePicture
                }
                res.status(200).send({
                    mensagem: 'Busca realizada com sucesso',
                    result,
                    status: true
                });
            }
        )
    })
})

router.get('/busca/professor/:id_professor', (req, res ) =>{
    let id = req.params.id_professor
    mysql.getConnection((error, conn) =>{
        conn.query(
            `SELECT * FROM Professores WHERE Professores.id = ?`,
            [id],
            (error, resultado  ) => {
                conn.release();
                if (resultado.length <= 0) {
                    return res.status(200).send({
                        mensagem: 'Professor não encontrado',
                          
                        status: false
                    });
                }
                const result = {
                    id: resultado[0].id,
                    Nome: resultado[0].Nome,
                    Email: resultado[0].Email,
                    Telefone: resultado[0].Telefone,
                    ReceberNot: resultado[0].receberNotificacoes,
                    pfp: resultado[0].ProfilePicture
                }
                res.status(200).send({
                    mensagem: 'Busca realizada com sucesso',
                    result,
                    status: true
                });
            }
        )
    })
})

router.delete('/excluir/professor', (req, res ) =>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(200).send({error: error})}
        const query = 'SELECT * FROM Professores WHERE id = ?';
        conn.query(query, [req.body.id],(error, results) =>{
            if(error) {return res.status(200).send({error: error})}
            if(results.length <1) {
                conn.release();
                return res.status(200).send ({
                    mensagem: 'Usuario nao encontrado',
                    status: false
                 })
            }
            bcrypt.compare(req.body.senha, results[0].Senha, (err, result) =>{
                if(result){
                    conn.query(
                        `UPDATE Professores SET Ativo = 0 WHERE Professores.id = ?`,
                        [req.body.id],
                        (error) => {
                            conn.release();
                            if (error) {
                                return res.status(200).send({
                                    error: error,
                                      
                                    status: false
                                });
                            }
                            res.status(200).send({
                                mensagem: 'Perfil excluido com Sucesso',
                                status: true
                            });
                        }
                    )
                }else{
                    return res.status(200).send({
                        mensagem: 'Senha incorreta',
                        status: false
                     })
                }
            })
        })
    })
})

router.delete('/excluir/aluno', (req, res ) =>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(200).send({error: error})}
        const query = 'SELECT * FROM Alunos WHERE id = ?';
        conn.query(query, [req.body.id],(error, results) =>{
            if(error) {return res.status(200).send({error: error})}
            if(results.length <1) {
                conn.release();
                return res.status(200).send ({
                    mensagem: 'Usuario nao encontrado',
                    status: false
                 })
            }
            bcrypt.compare(req.body.senha, results[0].Senha, (err, result) =>{
                if(result){
                    conn.query(
                        `UPDATE Alunos SET Ativo = 0 WHERE Alunos.id = ?`,
                        [req.body.id],
                        (error) => {
                            if (error) {
                                return res.status(200).send({
                                    error: error,
                                      
                                    status: false
                                });
                            }
                            conn.query(
                                `DELETE FROM Triagem WHERE AlunoId = ?`,
                                [req.body.id],
                                (error) => {
                                    conn.release();
                                    if (error) {
                                        return res.status(200).send({
                                            error: error,
                                              
                                            status: false
                                        });
                                    }
                                    res.status(200).send({
                                        mensagem: 'Perfil excluido com Sucesso',
                                        status: true
                                    });
                                }
                            )
                        }
                    )
                }else{
                    return res.status(200).send({
                        mensagem: 'Senha incorreta',
                        status: false
                     })
                }
            })
        })
    })
})

router.get('/busca/aluno/email/:email', (req, res ) =>{
    const id = req.params.email
    mysql.getConnection((error, conn) =>{
        conn.query(
            `SELECT * FROM Alunos WHERE Alunos.Email = ?`,
            [id],
            (error, resultado  ) => {
                conn.release();
                if (resultado.length <= 0) {
                    return res.status(200).send({
                        mensagem: 'Aluno não encontrado',
                          
                        status: false
                    });
                }
                const result = {
                    id: resultado[0].id,
                    Nome: resultado[0].Nome,
                    Email: resultado[0].Email,
                    Telefone: resultado[0].Telefone,
                    ReceberNot: resultado[0].receberNotificacoes,
                    pfp: resultado[0].ProfilePicture
                }
                res.status(200).send({
                    mensagem: 'Busca realizada com sucesso',
                    result,
                    status: true
                });
            }
        )
    })
})

router.get('/busca/professor/artemarcial/:id_professor', (req, res ) =>{
    const id = req.params.id_professor
    mysql.getConnection((error, conn) =>{
        conn.query(
            `SELECT     Professores.Nome,
                        ArteMarciais.ArteMarcial,
                        ArtesMarciais_Professor.Document
                FROM    ArtesMarciais_Professor
           INNER JOIN   Professores
                 ON     Professores.id = ArtesMarciais_Professor.ProfessorId
           INNER JOIN   ArteMarciais
                 ON     ArteMarciais.id = ArtesMarciais_Professor.ArteMarcialId
                 WHERE  ArtesMarciais_Professor.ProfessorId = ?`,
            [id],
            (error, resultado  ) => {
                conn.release();
                if (resultado.length <= 0) {
                    return res.status(200).send({
                        mensagem: 'Artes Marciais não encontradas',
                          
                        status: false
                    });
                }
                const result = {
                    Nome: resultado[0].Nome,
                    ArtesMarciais: resultado.map(art =>{
                        return{
                            ArteMarcial: art.ArteMarcial,
                            Documento: art.Document  
                        }
                    })
                }
                res.status(200).send({
                    mensagem: 'Busca realizada com sucesso',
                    result,
                    status: true
                });
            }
        )
    })
})

router.patch('/update/expotoken/professor', UserController.patchExpoTokenProfessor);
router.patch('/update/expotoken/aluno', UserController.patchExpoTokenAluno);

module.exports = router;


