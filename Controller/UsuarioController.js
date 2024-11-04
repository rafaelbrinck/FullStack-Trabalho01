const UserService = require("../Service/UsuarioService");

async function listar(req, res) {
  const users = await UserService.Listar();
  res.json(users);
}

async function buscarPorId(req, res) {
  const id = req.params.id;
  try {
    const buscadorId = await UserService.BuscarPorId(id);
    res.json(buscadorId);
  } catch (err) {
    res.status(err.id).json(err);
  }
}

async function inserir(req, res) {
  const user = req.body;
  try {
    const userInserido = await UserService.Inserir(user);
    res.status(201).json(userInserido);
  } catch (err) {
    res.status(err.id).json(err);
  }
}

async function atualizar(req, res) {
  const id = req.params.id;
  const user = req.body;
  try {
    const userAtualizado = await UserService.Atualizar(id, user);
    res.status(201).json(userAtualizado);
  } catch (err) {
    res.status(err.id).json(err);
  }
}

async function deletar(req, res) {
  const id = req.params.id;
  try {
    const userExcluido = await UserService.Deletar(id);
    res.status(200).json(userExcluido);
  } catch (err) {
    res.status(err).json(err);
  }
}

async function buscarPorCpf(req, res) {
  const cpf = req.params.cpf;
  try {
    const userCPF = await UserService.BuscarPorCPF(cpf);
    res.json(userCPF);
  } catch (err) {
    res.status(err.id).json(err);
  }
}

module.exports = {
  listar,
  inserir,
  buscarPorCpf,
  buscarPorId,
  atualizar,
  deletar,
};
