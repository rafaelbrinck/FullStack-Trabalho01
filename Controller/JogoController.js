const JogoService = require("../Service/JogoService");

async function listar(req, res) {
  const jogos = await JogoService.Listar();
  res.json(jogos);
}

async function buscarPorId(req, res) {
  const id = req.params.id;
  try {
    const buscadorId = await JogoService.BuscarPorId(id);
    res.json(buscadorId);
  } catch (err) {
    res.status(err.id).json(err);
  }
}

async function inserir(req, res) {
  const jogo = req.body;
  try {
    const jogoInserido = await JogoService.Inserir(jogo);
    res.status(201).json(jogoInserido);
  } catch (err) {
    res.status(err.id).json(err);
  }
}

async function atualizar(req, res) {
  const id = req.params.id;
  const jogo = req.body;
  try {
    const jogoAtualizado = await JogoService.Atualizar(id, jogo);
    res.status(201).json(jogoAtualizado);
  } catch (err) {
    res.status(err.id).json(err);
  }
}

async function deletar(req, res) {
  const id = req.params.id;
  try {
    const jogoExcluido = await JogoService.Deletar(id);
    res.status(200).json(jogoExcluido);
  } catch (err) {
    res.status(err).json(err);
  }
}

async function buscarPorCategoria(req, res) {
  const categoria = req.params.categoria;
  try {
    const produtosCategorias = await JogoService.BuscarPorCategoria(categoria);
    res.json(produtosCategorias);
  } catch (err) {
    res.status(err.id).json(err);
  }
}

module.exports = {
  listar,
  inserir,
  atualizar,
  deletar,
  buscarPorCategoria,
  buscarPorId,
};
