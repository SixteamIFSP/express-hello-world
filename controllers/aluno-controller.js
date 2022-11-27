const mysql = require('../database/mysql.js');

exports.getAluno = async (req, res)=> {
    let response;
    const textQuery = "%" + req.params.query + "%"

    try {
        const query = 'SELECT * FROM Alunos WHERE ativo = 1 AND nome like ? OR email like ?';
        const result = await mysql.execute(query, [
            textQuery,
            textQuery
        ]);
        if (result<1){
             response = {
                message: 'Não há alunos com esse codigo',
                result: [],
                status: false
            }
        }
        else {
                response = {
                message: 'Busca Realizada com sucesso',
                result: result.map(aula =>{
                    return{
                        id: aula.id,
                        nome: aula.Nome,
                        email: aula.Email,
                        pfp: aula.ProfilePicture,
                    }
                }),
                status: true
            }
        }
        
        return res.status(200).send(response);
    } catch (error) {
        return res.status(200).send({
            error: error,
            message: 'Erro ao buscar aluno',
            status: false
        });
    }

}
