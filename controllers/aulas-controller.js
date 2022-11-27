const mysql = require('../database/mysql.js');
const notification = require('../controllers/notification-controller');

exports.postAula= async (req, res) => {
    try {
        const query = 'INSERT INTO Aulas (NomeAula, Data, Descricao, TurmaId) VALUES (?,?,?,?)';
        const result = await mysql.execute(query, [
            req.body.topico,
            req.body.data,
            req.body.descricao,
            req.body.turma
        ]);

        const response = {
            message: 'Aula criada com sucesso',
            status: true
        }
        const aluno = await mysql.execute(
            `SELECT ExpoToken FROM Alunos 
             INNER JOIN Aluno_Turma 
                ON Aluno_Turma.AlunoId = Alunos.id
                    WHERE Aluno_Turma.TurmaId = ? and Alunos.receberNotificacoes = 1`,
            [req.body.turma]
        )

        let dataMessage = {
            sound: "default",
            body: "Aula nova publicada!",
            data: {status: true}
        }
        aluno.map(alun => {
            notification.handleNotification([alun.ExpoToken], dataMessage)
        })
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({
            error: error,
            message: 'Não foi possivel criar aula',
            status: false
        });
    }
};

exports.getAula= async (req, res) => {
    try {
        const query = `SELECT   Aulas.id,
                                Aulas.NomeAula,
                                Aulas.Data
                        FROM    Aulas
                    INNER JOIN  Turmas
                            ON  Turmas.id = Aulas.TurmaId
                    INNER JOIN  Aluno_Turma
                            ON  Aluno_Turma.TurmaId = Turmas.id
                        WHERE   Aluno_Turma.AlunoId = ? and Aulas.Ativo = 1`;
        const result = await mysql.execute(query, [
            req.params.id_aluno
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Não foi encontrado aula',
                status: false
            })
        }

        const response = {
            message: 'Aulas encontradas',
            result: result.map(aula =>{
                return{
                    id: aula.id,
                    nome: aula.NomeAula,
                    data: aula.Data  
                }
            }),
            status: true
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({ 
            message: 'Não foi possivel encontrar aula',
            status: false
        });
    }
};

exports.getAulaDetalhe= async (req, res) => {
    try {
        const query = `SELECT * FROM Aulas WHERE id = ? and Ativo = 1`;
        const result = await mysql.execute(query, [
            req.params.id_aula
        ]);
        if (result.length == 0) {
            return res.status(200).send({
                message: 'Não foi encontrado aula',
                status: false
            })
        }
        const response = {
            message: 'Aula encontrada',
            result: result,
            status: true
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({ 
            message: 'Não foi possivel encontrar aula',
            status: false
        });
    }
};

exports.getAulaProfessor = async (req, res) => {
    try {
        const query = `SELECT   Aulas.id,
                                Aulas.NomeAula,
                                Aulas.Data
                        FROM    Aulas
                    INNER JOIN  Turmas
                            ON  Turmas.id = Aulas.TurmaId
                        WHERE   Turmas.ProfessorId = ? and Aulas.Ativo = 1`;
        const result = await mysql.execute(query, [
            req.params.id_professor
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Não foi encontrado aula',
                status: false
            })
        }
        const response = {
            result: result.map(aula =>{
                return{
                    id: aula.id,
                    nome: aula.NomeAula,
                    data: aula.Data  
                }
            }),
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({ 
            message: 'Não foi possivel encontrar aula',
            status: false
        });
    }
};

exports.getAulaTurma = async (req, res) => {
    try {
        const query = `SELECT   Aulas.id,
                                Aulas.NomeAula,
                                Aulas.Data
                        FROM    Aulas
                        WHERE   Aulas.TurmaId = ? and Aulas.Ativo = 1`;
        const result = await mysql.execute(query, [
            req.params.id_turma
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Não foi encontrado aula',
                status: false
            })
        }

        const response = {
            message: 'Aulas encontradas',
            result: result.map(aula =>{
                return{
                    id: aula.id,
                    nome: aula.NomeAula,
                    data: aula.Data  
                }
            }),
            status: true
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({ 
            message: 'Não foi possivel encontrar aula',
            status: false
        });
    }
};

exports.deleteAula= async (req, res) => {
    try {
        const query = 'UPDATE Aulas SET Ativo = 0 WHERE id = ?';
        const result = await mysql.execute(query, [
            req?.params.id_aula,
        ]);

        const response = {
            message: 'Aula Cancelada',
            status: true
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({ 
            message: 'Não foi possivel cancelar a aula',
            status: false
        });
    }
};

exports.getDiaAulaProfessor= async (req, res) => {
    try {
        const query = `SELECT   Aulas.id,
                                Aulas.NomeAula,
                                Aulas.Data
                        FROM    Aulas
                        INNER JOIN  Turmas
                            ON  Turmas.id = Aulas.TurmaId
                        WHERE   Turmas.ProfessorId = ? and Aulas.Ativo = 1`;
        const result = await mysql.execute(query, [
            req.params.id_professor
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Não encontrado',
                status: false
            })
        }

        const response = {
            message: 'Aulas encontradas',
            result: result.map(aula =>
             
                aula.Data 
                
            ),
            status: true
        }

        return res.status(201).send(response);
        } catch (error) {
            return res.status(200).send({ 
                message: 'Não encontrado',
                status: false
            });
        }
};

exports.getDiaAulaAluno= async (req, res) => {
    try {
        const query = `SELECT   Aulas.id,
                                Aulas.NomeAula,
                                Aulas.Data
                        FROM    Aulas
                    INNER JOIN  Turmas
                            ON  Turmas.id = Aulas.TurmaId
                    INNER JOIN  Aluno_Turma
                            ON  Aluno_Turma.TurmaId = Turmas.id
                        WHERE   Aluno_Turma.AlunoId = ? and Aulas.Ativo = 1`;
        const result = await mysql.execute(query, [
            req.params.id_aluno
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Não encontrado',
                status: false
            })
        }

        const response = {
            message: 'Aulas encontradas',
            result: result.map(aula =>             
                aula.Data                 
            ),
            status: true
        }

        return res.status(201).send(response);
        } catch (error) {
            return res.status(200).send({ 
                message: 'Não encontrado',
                status: false
            });
        }
};

exports.getAulaProfessorPorData = async (req, res) => {
    try {
        const query = `SELECT   Aulas.id,
                                Aulas.NomeAula,
                                Aulas.Data
                        FROM    Aulas
                    INNER JOIN  Turmas
                            ON  Turmas.id = Aulas.TurmaId
                        WHERE   Turmas.ProfessorId = ? and Aulas.Ativo = 1 order by Data`;
        const result = await mysql.execute(query, [
            req.params.id_professor
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Não foi encontrado aula',
                status: false
            })
        }
       var resultQuery = result.map(aula =>{
                return{
                    id: aula.id,
                    nome: aula.NomeAula,
                    data: aula.Data,
                    turma: aula.TurmaNome  
                }
            })

        if (req.params.dataAula){
            resultQuery = resultQuery.filter(
                aula => { 
                    var tzoffset = 180 * (60000 * 2);
                    return  new Date(
                        new Date(aula.data) - tzoffset).toISOString().substring(0,10) === new Date (req.params.dataAula).toISOString().substring(0,10)                }) 
        }     

        if (resultQuery.length == 0) {
            return res.status(200).send({
                message: 'Não foi encontrado aula',
                status: false
            })
        }

        const response = {
            message: 'Aulas encontradas',
            result: resultQuery,
            status: true,
        }

        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({ 
            message: 'Não foi possivel encontrar aula',
            status: false
        });
    }
};


exports.getAulaAlunoPorData = async (req, res) => {
    try {
        const query = `SELECT   Aulas.id,
                                Aulas.NomeAula,
                                Aulas.Data
                        FROM    Aulas
                    INNER JOIN  Turmas
                            ON  Turmas.id = Aulas.TurmaId
                    INNER JOIN  Aluno_Turma
                            ON  Aluno_Turma.TurmaId = Turmas.id
                        WHERE   Aluno_Turma.AlunoId = ? and Aulas.Ativo = 1 order by Aulas.Data`;
        const result = await mysql.execute(query, [
            req.params.id_aluno
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Não foi encontrado aula',
                status: false
            })
        }
       var resultQuery = result.map(aula =>{
                return{
                    id: aula.id,
                    nome: aula.NomeAula,
                    data: aula.Data,
                    turma: aula.TurmaNome  
                }
            })

        if (req.params.dataAula){
            resultQuery = resultQuery.filter(
                aula => { 
                    var tzoffset = 180 * (60000 * 2);
                    return  new Date(
                        new Date(aula.data) - tzoffset).toISOString().substring(0,10) === new Date (req.params.dataAula).toISOString().substring(0,10)
                }) 
        }     

        if (resultQuery.length == 0) {
            return res.status(200).send({
                message: 'Não foi encontrado aula',
                status: false
            })
        }

        const response = {
            message: 'Aulas encontradas',
            result: resultQuery,
            status: true,
        }

        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({
            message: 'Não foi possivel encontrar aula',
            status: false
        });
    }
};

exports.patchAula= async (req, res) => {
    try {
        const query = 'UPDATE Aulas SET NomeAula = ?, Data = ?, Descricao = ? WHERE id = ?';
        const result = await mysql.execute(query, [
            req?.body.nome,
            req?.body.data,
            req?.body.descricao,
            req?.body.id
        ]);
        if(result.changedRows > 0){
            res.status(200).send({
                mensagem: 'Atualizado com sucesso',
                status: true
            })
        } else {
            res.status(200).send({
                mensagem: 'Não Atualizado',
                status: false
            })
        }
    } catch (error) {
        return res.status(200).send({ 
            message: 'Não foi possivel atualizar a aula',
            error: error,
            status: false
        });
    }
};