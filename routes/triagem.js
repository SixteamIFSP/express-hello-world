const express = require('express');
const router = express.Router();
const TriagemController = require('../controllers/triagem-controller');

router.post('/criarTriagem', TriagemController.postTriagem);
router.get('/acessarTriagem/:id_aluno', TriagemController.getTriagem);
router.patch('/atualizarTriagem', TriagemController.updateTriagem);

module.exports = router;