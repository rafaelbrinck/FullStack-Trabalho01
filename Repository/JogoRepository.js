const { getConexao } = require("../config/database");
let idGerador = () => Math.floor(Math.random() * 9000);

async function Listar() {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM JOGOS");
  await client.end();
  return result.rows;
}

async function Inserir(jogo) {
  if (!jogo || !jogo.nome || !jogo.preco || !jogo.quantidade) {
    throw { id: 400, msg: "Dados do jogo incompletos!" };
  }

  // Conexão banco
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "INSERT INTO JOGOS (nome, preco, quantidade) VALUES ($1, $2, $3) RETURNING *",
    [jogo.nome, jogo.preco, jogo.quantidade]
  );
  await client.end();
  return result.rows[0];
}

async function BuscarPorId(id) {
  if (!(await validaId(id))) {
    throw { id: 404, msg: "Jogo não cadastrado!" };
  }
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM JOGOS WHERE id = $1", [id]);
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
  if (!(await validaId(id))) {
    throw { id: 404, msg: "Jogo não cadastrado!" };
  }
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "UPDATE JOGOS SET nome = $1, preco = $2, quantidade = $3 WHERE id = $4 RETURNING *",
    [jogo.nome, jogo.preco, jogo.quantidade, id]
  );
  await client.end();
  return result.rows[0];
}

async function Deletar(id) {
  /*if (await validaJogoServidor(id)) {
    throw { id: 404, msg: "Jogo com pendencias em aberto!" };
  }*/

  if (!(await BuscarPorId(id))) {
    throw { id: 404, msg: "Jogo não cadastrado!" };
  }
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "DELETE FROM JOGOS WHERE id = $1 RETURNING *",
    [id]
  );
  await client.end();
  return result.rows[0];
}

async function PesquisarPorCategoria(categoria) {
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "SELECT * FROM JOGOS WHERE categoria = $1",
    [categoria]
  );
  await client.end();
  return result.rows;
}

//  VALIDAÇÕES
async function ValidaNome(nome) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT nome FROM JOGOS WHERE nome = $1", [
    nome,
  ]);
  await client.end();
  if (result.rows.length > 0) {
    return true;
  }
  return false;
}

async function validaJogoServidor(id) {
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "SELECT * FROM LOCACOES WHERE idjogo = $1",
    [id]
  );
  await client.end();
  if (result.rows.length > 0) {
    return true;
  }
  return false;
}

async function validaId(id) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT id FROM JOGOS WHERE id = $1", [id]);
  await client.end();
  if (result.rows.length > 0) {
    return true;
  }
  return false;
}

module.exports = {
  Listar,
  Inserir,
  Atualizar,
  BuscarPorId,
  Atualizar,
  Deletar,
  PesquisarPorCategoria,
  ValidaNome,
  validaJogoServidor,
};
