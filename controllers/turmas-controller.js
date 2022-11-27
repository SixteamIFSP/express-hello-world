const mysql = require('../database/mysql.js');
const responseStructure = require('../commons/responseStructure');
const notification = require('../controllers/notification-controller');
const { errorResponse, successResponse} =  responseStructure()

exports.getTurmaDetalhe = async (req, res) => {
    try {
        const query = `SELECT * FROM Turmas WHERE id = ?`;
        const result = await mysql.execute(query, [
            req.params.id_turma
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Turma não encontrada',
                status: false
            })
        }
        return res.status(200).send(successResponse('Turma encontrada',  true, result));
    } catch (error) {
        return res.status(200).send({
            message: 'Turma não encontrada',
            status: false
        });
    }
};

exports.criarTurma = async (req, res) => {
    try {
        const query =  'INSERT INTO Turmas (TurmaNome, ProfessorId, Descricao) VALUES (?, ?, ?)';
        const result = await mysql.execute(query, 
            [
                req.body.nome,
                req.body.professorId,
                req.body.descricao
            ]
        )

        const response = {
            mensagem: `Turma criada com sucesso`,
            resultado: '',
            status: result.affectedRows>0
        }

       
        res.status(201).send(response);

    } catch(error){

        return res.status(200).send({
            error:error,
            mensagem: 'Erro ao criar turma',
            status: false
        });
    }        
}

exports.buscaPorAlunos = async (req, res) => {
    const id = req.params.id_aluno;
    const resultado = await mysql.execute(
            'select t.id,  t.TurmaNome, t.Descricao, t.ProfessorId from Turmas as t INNER join Aluno_Turma as a where t.id = a.TurmaId and a.AlunoId = ?',
            [id],)
                         
        if(!resultado.length){
            return res.status(200).send(errorResponse('Não há turmas para esse aluno.', false));
        }
        res.status(200).send(successResponse('Busca realizada com sucesso.', true, resultado));
}

exports.alterarTurma = async (req, res) => {
    try {
        const querySelect = 'update Turmas set TurmaNome = ?, Descricao = ? where id = ?'
        const result = await  mysql.execute(querySelect, [
            req.body.titulo,
            req.body.descricao,
            req.body.turmaId,
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
                error:error,
                mensagem: 'Erro ao atualizar',
                status: false
            });
    }
    
}

exports.adicionarAluno = async (req, res) => {
    try {
        const querySelect = 'SELECT * FROM Aluno_Turma WHERE alunoId = ? and TurmaId = ? '
        const result = await  mysql.execute(querySelect, [
            req.body.alunoId,
            req.body.turmaId
        ]);
        
        if (result.length < 1) {
            const response = await mysql.execute(
                'INSERT INTO Aluno_Turma (AlunoId, TurmaId) VALUES (?, ?)',
                [req.body.alunoId, req.body.turmaId]  
            )
            const aluno = await mysql.execute(
                'SELECT * FROM Alunos WHERE id = ? and receberNotificacoes = 1',
                [req.body.alunoId]
            )
            
            let dataMessage = {
                sound: "default",
                body: "Você foi adicionado a uma Turma!",
                data: {status: true}
            }
            notification.handleNotification([aluno[0].ExpoToken], dataMessage);

            res.status(201).send({
                mensagem: 'Aluno Cadastrado com sucesso',
                status: true
            })
        } 
        else {
            res.status(200).send({
                mensagem: 'Aluno já cadastrado',
                status: false
        })
        }
    } catch (error) {
            return res.status(200).send({
                error:error,
                mensagem: 'Erro ao adicionar',
                status: false
            });
    }
    
}

exports.removerAluno = async (req, res) => {
    try {
        const querySelect = 'SELECT * FROM Aluno_Turma WHERE AlunoId = ? and TurmaId = ?'
        const result = await  mysql.execute(querySelect, [
            req.body.alunoId,
            req.body.turmaId
        ]);
        
        if (result.length > 0) {
            const response = await mysql.execute(
                'DELETE FROM Aluno_Turma WHERE TurmaId = ? and AlunoId = ?',
                [req.body.turmaId, req.body.alunoId]  
            )
            const aluno = await mysql.execute(
                'SELECT * FROM Alunos WHERE id = ? and receberNotificacoes = 1',
                [req.body.alunoId]
            )
            
            let dataMessage = {
                sound: "default",
                body: "Você foi removido de uma Turma :(",
                data: {status: true}
            }
            notification.handleNotification([aluno[0].ExpoToken], dataMessage);

            res.status(201).send({
                mensagem: 'Aluno removido com sucesso',
                status: true
            })
        } 
        else {
            res.status(200).send({
                mensagem: 'Erro ao apagar aluno',
                status: false
        })
        }
    } catch (error) {
            return res.status(200).send({
                error:error,
                mensagem: 'Erro ao apagar',
                status: false
            });
    }
    
}

