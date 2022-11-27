const express = require('express');
const router = express.Router();
const AulasController = require('../controllers/aulas-controller');

router.post('/criarAula', AulasController.postAula);
router.get('/busca_aluno/:id_aluno', AulasController.getAula);
router.get('/busca_professor/:id_professor', AulasController.getAulaProfessor);
router.get('/busca_turma/:id_turma', AulasController.getAulaTurma);
router.delete('/deletarAula/:id_aula', AulasController.deleteAula);
router.get('/diaAulaProfessor/:id_professor', AulasController.getDiaAulaProfessor);
router.get('/diaAulaAluno/:id_aluno', AulasController.getDiaAulaAluno);
router.get('/busca_professor/:id_professor/:dataAula', AulasController.getAulaProfessorPorData);
router.get('/busca_aluno/:id_aluno/:dataAula', AulasController.getAulaAlunoPorData);
router.get('/busca_aula/:id_aula', AulasController.getAulaDetalhe);
router.patch('/atualizar_aula', AulasController.patchAula);

module.exports = router;