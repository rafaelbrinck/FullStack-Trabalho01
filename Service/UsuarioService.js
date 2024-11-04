const UserRepository = require("../Repository/UsuarioRepository");

async function Listar() {
  return await UserRepository.Listar();
}

async function Inserir(user) {
  if (user && user.nome && user.cpf) {
    return await UserRepository.Inserir(user);
  } else {
    throw { id: 400, msg: "Usuário sem dados corretos" };
  }
}

async function BuscarPorId(id) {
  let user = UserRepository.BuscarPorId(id);
  if (user) {
    return await user;
  } else {
    throw { id: 404, msg: "Usuário não encontrado!" };
  }
}

async function Atualizar(id, user) {
  if (user && user.nome && user.cpf) {
    const UsuarioAtualizado = UserRepository.Atualizar(id, user);
    if (UsuarioAtualizado) {
      return await UsuarioAtualizado;
    } else {
      throw { id: 404, msg: "Usuário não encontrado" };
    }
  } else {
    throw { id: 400, msg: "Usuário sem dados corretos" };
  }
}

async function Deletar(id) {
  let user = UserRepository.Deletar(id);
  if (user) {
    return await user;
  } else {
    throw { id: 404, msg: "Usuário não encontrado!" };
  }
}

async function BuscarPorCPF(cpf) {
  const usuario = UserRepository.PesquisarPorCpf(cpf);
  if (usuario) {
    return await usuario;
  } else {
    throw { id: 404, msg: "Usuario não encontrado!" };
  }
}

module.exports = {
  Listar,
  Inserir,
  BuscarPorId,
  Atualizar,
  Deletar,
  BuscarPorCPF,
};
