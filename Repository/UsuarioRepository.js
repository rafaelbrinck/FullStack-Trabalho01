let idGerador = () => Math.floor(Math.random() * 9000);
const { getConexao } = require("../config/database");

async function Listar() {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM USUARIOS");
  await client.end();
  return result.rows;
}

async function Inserir(user) {
  // if (!user || !user.nome || !user.cpf) {
  //   return;
  // }
  // if (await ValidaNome(user.nome)) {
  //   throw { id: 404, msg: "Nome já cadastrado!" };
  // }
  // if (await ValidaCPF(user.cpf)) {
  //   throw { id: 404, msg: "CPF já cadastrado!" };
  // }
  user.valor = 0;

  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "INSERT INTO USUARIOS (nome, cpf, email, valor) VALUES ($1, $2, $3, $4) RETURNING *",
    [user.nome, user.cpf, user.email, user.valor]
  );
  await client.end();
  return result.rows[0];
}

async function BuscarPorId(id) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM USUARIOS WHERE id = $1", [
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
    "UPDATE USUARIOS SET nome = $1, cpf = $2 WHERE id = $3 RETURNING *",
    [user.nome, user.cpf, id]
  );
  await client.end();
  return result.rows[0];
}

async function atualizaValor(id, valor) {
  const client = getConexao();
  await client.connect();
  const clienteObtido = await BuscarPorId(id);
  let valorNovo = parseFloat(clienteObtido.valor) + parseFloat(valor);
  const result = await client.query(
    "UPDATE USUARIOS SET valor = $1 WHERE id = $2 RETURNING *",
    [valorNovo, id]
  );
  await client.end();
  return result.rows[0];
}

async function diminuiValor(id, valor) {
  const client = getConexao();
  await client.connect();
  const clienteObtido = await BuscarPorId(id);
  let valorNovo = parseFloat(clienteObtido.valor) - parseFloat(valor);
  const result = await client.query(
    "UPDATE USUARIOS SET valor = $1 WHERE id = $2 RETURNING *",
    [valorNovo, id]
  );
  await client.end();
  return result.rows[0];
}

async function Deletar(id) {
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "DELETE FROM USUARIOS WHERE id = $1 RETURNING *",
    [id]
  );
  await client.end();
  return result.rows[0];
}

async function PesquisarPorCpf(cpf) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM USUARIOS WHERE cpf = $1", [
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
  const result = await client.query("SELECT cpf FROM USUARIOS WHERE cpf = $1", [
    cpf,
  ]);
  await client.end();
  // Verifica se algum resultado foi retornado
  if (result.rows.length > 0) {
    return true; // CPF já existe
  }
  return false; // CPF não existe
}

async function ValidaEmail(email) {
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "SELECT email FROM USUARIOS WHERE email = $1",
    [email]
  );
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
    "SELECT nome FROM USUARIOS WHERE nome = $1",
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
    "SELECT * FROM LOCACOES WHERE idusuario = $1",
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
  const result = await client.query("SELECT id FROM USUARIOS WHERE id = $1", [
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
  atualizaValor,
  diminuiValor,
<<<<<<< HEAD
  ValidaEmail,
=======
>>>>>>> f24ca2330ea24c19941f8b73f616193b2e390a69
};
