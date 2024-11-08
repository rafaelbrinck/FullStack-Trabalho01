const { getConexao } = require("../config/database");
let idGerador = () => Math.floor(Math.random() * 9000);

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
  if (await ValidaNome(jogo.nome)) {
    throw { id: 404, msg: "Jogo já cadastrado!" };
  }

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
  if (!(await validaId(id))) {
    throw { id: 404, msg: "Jogo não cadastrado!" };
  }
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
  if (!(await validaId(id))) {
    throw { id: 404, msg: "Jogo não cadastrado!" };
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
  /*if (await validaJogoServidor(id)) {
    throw { id: 404, msg: "Jogo com pendencias em aberto!" };
  }*/ /*
  if (!(await BuscarPorId(id))) {
    throw { id: 404, msg: "Usuario não cadastrado!" };
  }*/
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "DELETE FROM JOGO WHERE id = $1 RETURNING *",
    [id]
  );
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

//  VALIDAÇÕES
async function ValidaNome(nome) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT nome FROM JOGO WHERE nome = $1", [
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
    "SELECT * FROM SERVIDOR WHERE idjogo = $1",
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
  const result = await client.query("SELECT id FROM JOGO WHERE id = $1", [id]);
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
