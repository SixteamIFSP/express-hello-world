const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard-controller');

router.get('/count_homepageProf/:id_professor', DashboardController.getDashboardProf);
router.get('/count_homepageAluno/:id_aluno', DashboardController.getDashboardAluno);

module.exports = router;