let listaUsuarios = [];
let idGerador = () => Math.floor(Math.random() * 9000);
const { getConexao } = require("../config/database");

function resetState() {
  listaUsuarios = 0;
  idGerador = 1;
}

async function Listar() {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM CLIENTE");
  await client.end();
  return result.rows;
}

async function Inserir(user) {
  if (!user || !user.nome || !user.cpf) {
    return;
  }
  // verificando a duplicidade apenas se lista já tiver usuários
  if (ValidaNome(user.nome) == true) {
    throw { id: 404, msg: "Nome já cadastrado!" };
  }
  if (ValidaCPF(user.cpf) == true) {
    throw { id: 404, msg: "CPF já cadastrado!" };
  }

  user.id = idGerador();
  user.valor = 0;

  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "INSERT INTO CLIENTE (id, nome, cpf, valor) VALUES ($1, $2, $3, $4) RETURNING *",
    [user.id, user.nome, user.cpf, user.valor]
  );
  await client.end();
  return result.rows[0];
}

async function BuscarPorId(id) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM CLIENTE WHERE id = $1", [
    id,
  ]);
  await client.end();
  return result.rows[0];
}

async function Atualizar(id, user) {
  if (!user || !user.nome || !user.cpf) {
    return;
  }
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "UPDATE CLIENTE SET nome = $1, cpf = $2 WHERE id = $3 RETURNING *",
    [user.nome, user.cpf, id]
  );
  await client.end();
  return result.rows[0];
}

async function Deletar(id) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("DELETE FROM CLIENTE WHERE id = $1", [id]);
  await client.end();
  return result.rows[0];
}

async function PesquisarPorCpf(cpf) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM CLIENTE WHERE cpf = $1", [
    cpf,
  ]);
  await client.end();
  return result.rows;
}

//  VALIDAÇÕES
async function ValidaCPF(cpf) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM CLIENTE WHERE cpf = $1", [
    cpf,
  ]);
  await client.end();

  if (result) {
    return true;
  } else {
    return false;
  }
}
async function ValidaNome(nome) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM CLIENTE WHERE cpf = $1", [
    nome,
  ]);
  await client.end();
  if (result) {
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
  PesquisarPorCpf,
  resetState,
};
