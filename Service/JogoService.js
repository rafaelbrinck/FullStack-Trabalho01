const JogoRepository = require("../Repository/JogoRepository");

async function Listar() {
  return await JogoRepository.Listar();
}

async function Inserir(jogo) {
  if (jogo.quantidade < 0) {
    throw { id: 400, msg: "Quantidade menor que zero!" };
  }
  if (jogo.preco < 0) {
    throw { id: 400, msg: "Valor menor que zero!" };
  }
  if (await JogoRepository.ValidaNome(jogo.nome)) {
    throw { id: 404, msg: "Jogo já cadastrado!" };
  }
  if (jogo && jogo.nome && jogo.preco) {
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
  try {
    let jogo = JogoRepository.Deletar(id);
    if (jogo) {
      return await jogo;
    } else {
      throw { id: 404, msg: "Jogo não encontrado!" };
    }
  } catch (err) {
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
