const mysql = require('../database/mysql.js');

exports.getDashboardProf= async (req, res) => {
    try {
        const queryAula = `SELECT COUNT (Aulas.id) AS TOTAL_AULAS
                        FROM    Aulas
                        INNER JOIN  Turmas
                        ON  Turmas.id = Aulas.TurmaId
                        WHERE   Turmas.ProfessorId = ?`;

        const resultAula = await mysql.execute(queryAula, [
            req.params.id_professor
        ]);

        const queryTurma = `SELECT COUNT (Turmas.id) AS TOTAL_TURMAS
                        FROM    Turmas
                        WHERE   Turmas.ProfessorId = ?`;

        const resultTurma = await mysql.execute(queryTurma, [
            req.params.id_professor
        ]);

        const queryAlunos = `SELECT COUNT (Aluno_Turma.AlunoId) AS TOTAL_ALUNOS
                        FROM    Aluno_Turma
                        INNER JOIN  Turmas
                        ON  Turmas.id = Aluno_Turma.TurmaId
                        WHERE   Turmas.ProfessorId = ?`;

        const resultAlunos = await mysql.execute(queryAlunos, [
            req.params.id_professor
        ]);

        const response = {
            mensagem: 'Resultado:',
            result: {
                Aula: resultAula[0].TOTAL_AULAS,
                Turmas: resultTurma[0].TOTAL_TURMAS,
                Alunos: resultAlunos[0].TOTAL_ALUNOS
            },           
            status: true
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(200).send({ 
            error:error,
            message: 'Não encontrado',
            status: false
        });
    }
};  

exports.getDashboardAluno= async (req, res) => {
    try {
        const queryAulasAluno = `SELECT COUNT(Aulas.id) AS TOTAL_AULAS
                        FROM    Aulas
                        INNER JOIN  Aluno_Turma
                        ON  Aluno_Turma.TurmaId = Aulas.TurmaId
                        WHERE   Aluno_Turma.AlunoId = ?`;

        const resultAulasAluno = await mysql.execute(queryAulasAluno, [
            req.params.id_aluno
        ]);

        const queryTurmasAluno = `SELECT COUNT(TurmaId) AS TOTAL_TURMAS
                        FROM    Aluno_Turma
                        WHERE   Aluno_Turma.AlunoId = ?`;

        const resultTurmasAluno = await mysql.execute(queryTurmasAluno, [
            req.params.id_aluno
        ]);

        const response = {
            mensagem: 'Resultado:',
            result: {
                Aula: resultAulasAluno[0].TOTAL_AULAS,
                Turmas: resultTurmasAluno[0].TOTAL_TURMAS
            },           
            status: true
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(200).send({ 
            error:error,
            message: 'Não foi possivel encontrar aula',
            status: false
        });
    }
};