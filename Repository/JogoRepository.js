const { getConexao } = require("../config/database");
let listaJogos = [];
//let idGerador = 1;
let idGerador = () => Math.floor(Math.random() * 9000);

// função para redefinir o estado da lista e do idGerador
function resetState() {
  listaJogos.length = 0;
  idGerador = 1;
}

async function Listar() {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM JOGO");
  await client.end();
  return result.rows;
}

async function Inserir(jogo) {
  if (
    !jogo ||
    !jogo.nome ||
    !jogo.categoria ||
    !jogo.preco ||
    !jogo.quantidade
  ) {
    throw { id: 400, msg: "Dados do jogo incompletos!" };
  }
  if (jogo.quantidade < 0) {
    throw { id: 400, msg: "Quantidade menor que zero!" };
  }
  if (jogo.preco < 0) {
    throw { id: 400, msg: "Valor menor que zero!" };
  }
  /*
  if (ValidaNome(jogo.nome) == true) {
    throw { id: 404, msg: "Jogo já cadastrado!" };
  }*/

  jogo.id = idGerador();

  // Conexão banco
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "INSERT INTO JOGO (id, nome, categoria, preco, quantidade) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [jogo.id, jogo.nome, jogo.categoria, jogo.preco, jogo.quantidade]
  );
  await client.end();
  return result.rows[0];
}

async function BuscarPorId(id) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM JOGO WHERE id = $1", [id]);
  await client.end();
  return result.rows[0];
}

async function Atualizar(id, jogo) {
  if (
    !jogo ||
    !jogo.nome ||
    !jogo.categoria ||
    !jogo.preco ||
    !jogo.quantidade
  ) {
    return;
  }
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "UPDATE JOGO SET nome = $1, categoria = $2, preco = $3, quantidade = $4 WHERE id = $5 RETURNING *",
    [jogo.nome, jogo.categoria, jogo.preco, jogo.quantidade, id]
  );
  await client.end();
  return result.rows[0];
}

async function Deletar(id) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("DELETE FROM JOGO WHERE id = $1", [id]);
  await client.end();
  return result.rows[0];
}

async function PesquisarPorCategoria(categoria) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM JOGO WHERE categoria = $1", [
    categoria,
  ]);
  await client.end();
  return result.rows;
}

async function getPreco(id) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM JOGO WHERE id = $1", [id]);
  await client.end();
  return result.rows[0].preco;
}
//  VALIDAÇÕES
async function ValidaNome(nome) {
  const resultado = listaJogos.find((jogo) => jogo.nome == nome);
  if (resultado) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  Listar,
  Inserir,
  Atualizar,
  BuscarPorId,
  Atualizar,
  Deletar,
  PesquisarPorCategoria,
  resetState,
  getPreco,
};
