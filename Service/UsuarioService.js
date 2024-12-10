const UserRepository = require("../Repository/UsuarioRepository");

async function Listar() {
  return await UserRepository.Listar();
}

async function Inserir(user) {
  if (await UserRepository.ValidaNome(user.nome)) {
    throw { id: 404, msg: "Nome já cadastrado!" };
  }
  if (await UserRepository.ValidaCPF(user.cpf)) {
    throw { id: 404, msg: "CPF já cadastrado!" };
  }

  if (user && user.nome && user.cpf) {
    return await UserRepository.Inserir(user);
  } else {
    throw { id: 400, msg: "Usuário sem dados corretos" };
  }
}

async function BuscarPorId(id) {
  let user = await UserRepository.BuscarPorId(id);
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

async function atualizaValor(id, valor) {
  if (valor <= 0) {
    throw { id: 400, msg: "Valor menor ou igual a ZERO não permitido" };
  }
  let user = await UserRepository.atualizaValor(valor, id);
  if (user) {
    return await user;
  } else {
    throw { id: 404, msg: "Usuário não encontrado!" };
  }
}

async function Deletar(id) {
  /*const teste = UserRepository.validaId(id);
  if (teste) {
    throw { id: 404, msg: "Usuário não encontrado!" };
  }*/
  if (!(await UserRepository.BuscarPorId(id))) {
    throw { id: 404, msg: "Usuário não cadastrado!" };
  }
  const validaUserServidor = await UserRepository.validaUserServidor(id);
  if (validaUserServidor) {
    throw { id: 400, msg: "Usuario cadastrado no sistema!" };
  }
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

async function teste(id) {
  let user = UserRepository.validaId(id);
  if (user) {
    return await user;
  } else {
    throw { id: 404, msg: "Usuário não encontrado!" };
  }
}

module.exports = {
  Listar,
  Inserir,
  BuscarPorId,
  Atualizar,
  Deletar,
  BuscarPorCPF,
  teste,
  atualizaValor,
};
