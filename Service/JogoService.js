const JogoRepository = require("../Repository/JogoRepository");

async function Listar() {
  return await JogoRepository.Listar();
}

async function Inserir(jogo) {
  if (jogo && jogo.nome && jogo.categoria && jogo.preco) {
    return await JogoRepository.Inserir(jogo);
  } else {
    throw { id: 400, msg: "Jogo sem dados corretos" };
  }
}

async function BuscarPorId(id) {
  let jogo = JogoRepository.BuscarPorId(id);
  if (jogo) {
    return await jogo;
  } else {
    throw { id: 401, msg: "Jogo não encontrado!" };
  }
}

async function Atualizar(id, jogo) {
  if (jogo && jogo.nome && jogo.categoria && jogo.preco && jogo.quantidade) {
    const JogoAtualizado = JogoRepository.Atualizar(id, jogo);
    if (JogoAtualizado) {
      return await JogoAtualizado;
    } else {
      throw { id: 404, msg: "Jogo não encontrado" };
    }
  } else {
    throw { id: 400, msg: "Jogo sem dados corretos" };
  }
}

async function Deletar(id) {
  let jogo = JogoRepository.Deletar(id);
  if (jogo) {
    return await jogo;
  } else {
    throw { id: 404, msg: "Jogo não encontrado!" };
  }
}

async function BuscarPorCategoria(categoria) {
  let jogo = JogoRepository.BuscarPorCategoria(categoria);
  if (jogo) {
    return await jogo;
  } else {
    throw { id: 404, msg: "Jogo não encontrado!" };
  }
}

module.exports = {
  Listar,
  Inserir,
  BuscarPorId,
  Atualizar,
  Deletar,
  BuscarPorCategoria,
};
