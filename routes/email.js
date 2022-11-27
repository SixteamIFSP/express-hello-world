const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/email-controller');

router.get('/recuperarProfessor/:email', EmailController.getRecuperarSenhaProfessor);
router.get('/recuperarAluno/:email', EmailController.getRecuperarSenhaAluno);

module.exports = router;