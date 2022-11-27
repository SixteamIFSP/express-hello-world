const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const EquipamentosController = require('../controllers/equipamentos-controller');

router.post('/adicionarEquipamento', EquipamentosController.postEquipamento);
router.get('/acessarEquipamento/:nome_equipamento', EquipamentosController.getEquipamento);
router.patch('/adicionarAulaEquipamento', EquipamentosController.postAulaEquipamento);
router.get('/acessarAulaEquipamento/:id_aula', EquipamentosController.getAulaEquipamento);

module.exports = router;