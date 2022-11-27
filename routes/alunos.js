const express = require('express');
const router = express.Router();
const AlunoController = require("../controllers/aluno-controller");

router.get('/busca/:query', AlunoController.getAluno)

module.exports = router;