const express = require('express')
const router = express.Router();
const servidorController = require("../Controller/ServidorController")


router.get('/', servidorController.listar)
router.get('/:id', servidorController.listarDescricoes)
router.post('/', servidorController.inserir)
router.delete('/:id', servidorController.deletar)

module.exports = router;