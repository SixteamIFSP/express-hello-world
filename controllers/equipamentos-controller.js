const mysql = require('../database/mysql.js');

exports.postEquipamento = async (req, res) => {
    try {
        const query = 'INSERT INTO Equipamento (NomeEquipamento, Foto) VALUES (?,?)';
        const result = await mysql.execute(query, [
            req.body.equipamento,
            req.body.foto,
        ]);

        const response = {
            message: 'Equipamento registrado com sucesso!',
            status: true
        }

        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({
            message: 'Não foi possivel registrar o Equipamento. Tente Novamente!',
            status: false
        });
    }
};

exports.getEquipamento = async (req, res) => {
    try {
        const query = `SELECT * FROM Equipamento WHERE NomeEquipamento = ?`;
        const result = await mysql.execute(query, [
            req.params.nome_equipamento
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Equipamento não encontrado.',
                status: false
            })
        }
        const response = {
            message: 'Equipamento encontrado',
            result: result,
            status: true
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(200).send({
            message: 'Equipamento não encontrado',
            status: false
        });
    }
};

exports.postAulaEquipamento = async (req, res) => {
    try {
        const query = 'INSERT INTO Aulas_Equipamentos (EquipamentoId, AulaId) VALUES (?,?)';
        const result = await mysql.execute(query, [
            req.body.equipamento,
            req.body.aula
        ]);

        const response = {
            message: 'Equipamento registrado com sucesso!',
            status: true
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(200).send({
            error: error,
            message: 'Não foi possível inserir o Equipamento. Tente Novamente!',
            status: false
        });
    }
};

exports.getAulaEquipamento = async (req, res) => {
    try {
        const query = `SELECT Equipamento.id,
                              Equipamento.NomeEquipamento
                              Equipamento.foto
                        INNER JOIN Equipamento
                            ON Equipamento.id = Aulas_Equipamentos.EquipamentoId
                              FROM Aulas_Equipamentos WHERE AulaId = ?`;
        const result = await mysql.execute(query, [
            req.params.id_aula
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Equipamentos não encontrados.',
                status: false
            })
        }
        const response = {
            message: 'Equipamentos encontrados',
            result: result,
            status: true
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(200).send({
            message: 'Equipamentos não encontrados',
            status: false
        });
    }
};