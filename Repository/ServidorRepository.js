const UsuarioRepository = require("./UsuarioRepository");
const JogoRepository = require("./JogoRepository");

const { getConexao } = require("../config/database");
let idGerador = () => Math.floor(Math.random() * 9000);

let listaServidor = [];

async function listar() {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM SERVIDOR");
  await client.end();
  return result.rows;
}

async function inserir(locacao) {
  if (!locacao || !locacao.idJogo || !locacao.idUsuario) {
    return;
  }
  const usuario = UsuarioRepository.BuscarPorId(locacao.idUsuario);
  if (!usuario) {
    throw { id: 404, msg: "Usuario não cadastrado!" };
  }
  const jogo = JogoRepository.BuscarPorId(locacao.idJogo);
  if (!jogo) {
    throw { id: 404, msg: "Jogo não cadastrado!" };
  }
  jogo.quantidade -= 1;
  JogoRepository.Atualizar(jogo.id, jogo);
  locacao.id = idGerador();
  const client = getConexao();
  await client.connect();
  const result = await client.query(
    "INSERT INTO SERVIDOR (id, idusuario, idjogo) VALUES ($1, $2, $3) RETURNING *",
    [locacao.id, locacao.idUsuario, locacao.idJogo]
  );
  await client.end();
  return result.rows[0];
}

async function listarDescricoes(id) {
  if (!id) {
    return;
  }
  let locacoes = [];
  const user = UsuarioRepository.BuscarPorId(id);
  if (!user) {
    return;
  }

  listaServidor.forEach((servidor) => {
    const jogo = JogoRepository.BuscarPorId(servidor.idJogo);
    user.valor += jogo.preco;
  });
  UsuarioRepository.Atualizar(user.id, user);
  locacoes.push(user);
  listaServidor.forEach((locacao) => {
    const jogo = JogoRepository.BuscarPorId(locacao.idJogo);
    jogo.quantidade = 1;
    locacoes.push(jogo);
  });
  return locacoes;
}

async function buscarPorId(id) {
  const client = getConexao();
  await client.connect();
  const result = await client.query("SELECT * FROM SERVIDOR WHERE id = $1", [
    id,
  ]);
  await client.end();
  return result.rows[0];
}

async function deletar(id) {
  const client = getConexao();
  await client.connect();

  try {
    // Busca a locação pelo ID
    const Locacao = await buscarPorId(id);

    if (!Locacao) {
      throw new Error(`Locação com ID ${id} não encontrada.`);
    }

    // Busca o jogo associado à locação usando o JogoRepository
    const jogo = await JogoRepository.BuscarPorId(Locacao.idJogo);

    if (!jogo || jogo.preco === undefined) {
      throw new Error(
        `Jogo associado com ID ${Locacao.idJogo} não encontrado ou sem preço.`
      );
    }

    // Obtém o preço do jogo
    const jogoPreco = jogo.preco;

    // Deleta o registro na tabela SERVIDOR
    await client.query("DELETE FROM SERVIDOR WHERE id = $1 RETURNING *", [id]);

    // Retorna o valor do preço do jogo
    return "Pagar: R$" + jogoPreco;
  } catch (err) {
    console.error("Erro ao deletar registro:", err.message);
    throw err; // Relança o erro para tratamento externo, se necessário
  } finally {
    // Encerra a conexão com o banco de dados
    await client.end();
  }
}

/*
async function deletar(id) {
  const client = getConexao();
  await client.connect();
  const Locacao = await buscarPorId(id);
  const jogo = await JogoRepository.getPreco(Locacao.idJogo);
  await client.query("DELETE FROM SERVIDOR WHERE id = $1 RETURNING *", [id]);
  await client.end(); /*
  return result.rows[0];
  
  return "Pagar: R$" + jogo.preco;
}*/

module.exports = {
  listar,
  inserir,
  listarDescricoes,
  deletar,
};
