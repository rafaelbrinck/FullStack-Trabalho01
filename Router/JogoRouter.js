const express = require('express')
const router = express.Router();
const jogoController = require("../Controller/JogoController")


router.get('/', jogoController.listar)
router.get('/:id', jogoController.buscarPorId)
router.get('/:categoria', jogoController.buscarPorCategoria)
router.post('/', jogoController.inserir)
router.put('/:id', jogoController.atualizar)
router.delete('/:id', jogoController.deletar)

module.exports = router;