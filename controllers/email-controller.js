const mysql = require('../database/mysql.js');
const nodemailer = require('nodemailer');
const generatepassword = require('generate-password');
const bcrypt = require('bcrypt');
const path = require('path');
const envPathFileUrl = path.join(__dirname, '../.env');
require('dotenv')
    .config({ path: envPathFileUrl });

let transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    secure:false,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASS,
    }
})

exports.getRecuperarSenhaProfessor = async (req, res) => {
    try {
        const query = `SELECT * FROM Professores WHERE Email = ?`;
        const result = await mysql.execute(query, [
            req.params.email
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Se este e-mail estiver associado a uma conta, você reberá um e-mail',
                status: false
            })
        }
        var password = generatepassword.generate({
            length: 8,
            numbers:true
        })
        bcrypt.hash(password, 10, (errBcrypt, hash) => {
            if (errBcrypt) { return res.status(200).send({ error: errBcrypt }) }
            const query = 'UPDATE Professores SET Senha = ? WHERE Email = ?';
            const result = mysql.execute(query, [
            hash,
            req.params.email
            ]);
            let info = transporter.sendMail({
                from: process.env.EMAIL,
                to: req.params.email,
                subject: "Recuperação de Senha",
                text: "Caro Usuário,\n\nVocê solicitou a recuperação de sua senha de acesso à aplicação Fight It.\n\nEsta é sua senha temporária: " + password + "\n\nAo acessar a aplicação, realizar a alteração de senha nas configurações do aplicativo.\n\n\nEste é um e-mail automático, favor não responder.\nEquipe Fight It"
            })
            const response = {
                message: 'Se este e-mail estiver associado a uma conta, você reberá um e-mail de recuperação',
                status: true
            }
            return res.status(200).send(response);
    })}catch (error) {
        return res.status(200).send({
            message: 'Se este e-mail estiver associado a uma conta, você reberá um e-mail',
            status: false
        });
    }
};

exports.getRecuperarSenhaAluno = async (req, res) => {
    try {
        const query = `SELECT * FROM Alunos WHERE Email = ?`;
        const result = await mysql.execute(query, [
            req.params.email
        ]);

        if (result.length == 0) {
            return res.status(200).send({
                message: 'Se este e-mail estiver associado a uma conta, você reberá um e-mail',
                status: false
            })
        }
        var password = generatepassword.generate({
            length: 8,
            numbers:true
        })
        bcrypt.hash(password, 10, (errBcrypt, hash) => {
            if (errBcrypt) { return res.status(200).send({ error: errBcrypt }) }
            const query = 'UPDATE Alunos SET Senha = ? WHERE Email = ?';
            const result = mysql.execute(query, [
            hash,
            req.params.email
            ]);
            let info = transporter.sendMail({
                from: process.env.EMAIL,
                to: req.params.email,
                subject: "Recuperação de Senha",
                text: "Caro Usuário,\n\nVocê solicitou a recuperação de sua senha de acesso à aplicação Fight It.\n\nEsta é sua senha temporária: " + password + "\n\nAo acessar a aplicação, realizar a alteração de senha nas configurações do aplicativo.\n\n\nEste é um e-mail automático, favor não responder.\nEquipe Fight It"
            })
            const response = {
                message: 'Se este e-mail estiver associado a uma conta, você reberá um e-mail',
                status: true
            }
            return res.status(200).send(response);
    })}catch (error) {
        return res.status(200).send({
            message: 'Se este e-mail estiver associado a uma conta, você reberá um e-mail',
            status: false
        });
    }
};


 