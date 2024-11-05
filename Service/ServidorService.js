const ServidorRepository = require("../Repository/ServidorRepository");

async function listar() {
  return await ServidorRepository.listar();
}

async function inserir(locacao) {
  if (locacao && locacao.idJogo && locacao.idUsuario) {
    return await ServidorRepository.inserir(locacao);
  } else {
    throw { id: 400, msg: "Locação sem dados corretos" };
  }
}

async function listarDescricoes(id) {
  let locacoes = await ServidorRepository.listarDescricoes(id);
  if (locacoes) {
    return await locacoes;
  } else {
    throw { id: 404, msg: "Usuário não encontrado!" };
  }
}

async function deletar(id) {
  let locacao = ServidorRepository.deletar(id);
  if (locacao) {
    return await locacao;
  } else {
    throw { id: 404, msg: "Locação não encontrado!" };
  }
}

module.exports = {
  listar,
  inserir,
  listarDescricoes,
  deletar,
};
