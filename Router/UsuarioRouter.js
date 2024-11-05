const express = require("express");
const router = express.Router();
const userController = require("../Controller/UsuarioController");

router.get("/", userController.listar);
router.get("/:id", userController.buscarPorId);
router.get("/cpf/:cpf", userController.buscarPorCpf);
router.post("/", userController.inserir);
router.put("/:id", userController.atualizar);
router.delete("/:id", userController.deletar);

router.get("/nome/:id", userController.teste);

module.exports = router;
