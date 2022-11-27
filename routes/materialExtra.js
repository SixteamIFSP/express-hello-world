const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const ArquivosController = require('../controllers/materialextra-controller');

router.post('/registrarArquivo', ArquivosController.postMaterialExtra);
router.get('/busca_arquivo/:id_aula', ArquivosController.getMaterialExtra);
router.delete('/deletarArquivo/:id_material', ArquivosController.deleteMaterialExtra);

module.exports = router;