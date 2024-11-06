let idGerador = () => Math.floor(Math.random() * 9000);
const { getConexao } = require("../config/database");

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
  if (await ValidaNome(user.nome)) {
    throw { id: 404, msg: "Nome já cadastrado!" };
  }
  if (await ValidaCPF(user.cpf)) {
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
  if (!(await validaId(id))) {
    throw { id: 404, msg: "Usuário não cadastrado!" };
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
  /*if (await validaUserServidor(id)) {
    throw { id: 404, msg: "Jogo não cadastrado!" };
  }*/ /*
  if (!(await BuscarPorId(id))) {
    throw { id: 404, msg: "Usuário não cadastrado!" };
  }*/
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "DELETE FROM CLIENTE WHERE id = $1 RETURNING *",
    [id]
  );
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
  if (result.rows.length <= 0) {
    throw { id: 404, msg: "Usuário não cadastrado!" };
  }
  return result.rows[0];
}

// --------------------  VALIDAÇÕES  ---------------------------

async function ValidaCPF(cpf) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT cpf FROM CLIENTE WHERE cpf = $1", [
    cpf,
  ]);
  await client.end();
  // Verifica se algum resultado foi retornado
  if (result.rows.length > 0) {
    return true; // CPF já existe
  }
  return false; // CPF não existe
}

async function ValidaNome(nome) {
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "SELECT nome FROM CLIENTE WHERE nome = $1",
    [nome]
  );
  await client.end();
  // Verifica se algum resultado foi retornado
  if (result.rows.length > 0) {
    return true; // Nome já existe
  }
  return false; // Nome não existe
}

async function validaUserServidor(id) {
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "SELECT * FROM SERVIDOR WHERE idusuario = $1",
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
  const result = await client.query("SELECT id FROM CLIENTE WHERE id = $1", [
    id,
  ]);
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
  Deletar,
  PesquisarPorCpf,
  validaUserServidor,
  ValidaCPF,
  validaId,
  ValidaNome,
};
