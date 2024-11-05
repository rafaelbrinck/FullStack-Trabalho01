const ServidorService = require("../Service/ServidorService");

async function listar(req, res) {
  const servidor = await ServidorService.listar();
  res.json(servidor);
}

async function listarDescricoes(req, res) {
  const id = req.params.id;
  try {
    const lista = await ServidorService.listarDescricoes(id);
    res.status(201).json(lista);
  } catch (err) {
    res.status(err.id).json(err);
  }
}

async function inserir(req, res) {
  const locacao = req.body;
  try {
    const locacaoInserido = await ServidorService.inserir(locacao);
    res.status(201).json(locacaoInserido);
  } catch (err) {
    res.status(err.id).json(err);
  }
}

async function deletar(req, res) {
  const id = req.params.id;
  try {
    const Valor = await ServidorService.deletar(id);
    res.status(200).json(Valor);
  } catch (err) {
    res.status(err).json(err);
  }
}

module.exports = {
  listar,
  listarDescricoes,
  inserir,
  deletar,
};
