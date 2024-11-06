const UsuarioRepository = require("./UsuarioRepository");
const JogoRepository = require("./JogoRepository");

const { getConexao } = require("../config/database");
let idGerador = () => Math.floor(Math.random() * 9000);

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
  const usuario = await UsuarioRepository.BuscarPorId(locacao.idUsuario);
  if (!usuario) {
    throw { id: 404, msg: "Usuario não cadastrado!" };
  }
  const jogo = await JogoRepository.BuscarPorId(locacao.idJogo);
  if (!jogo) {
    throw { id: 404, msg: "Jogo não cadastrado!" };
  }
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
    const Locacao = await buscarPorId(id);
    if (!Locacao) {
      throw { id: 404, msg: "Registro do servidor não cadastrado!" };
    }
    if (!Locacao.idjogo) {
      throw {
        id: 404,
        msg: `A locação com ID ${id} não possui um ID de jogo associado.`,
      };
    }
    const jogo = await JogoRepository.BuscarPorId(Locacao.idjogo);
    if (!jogo || jogo.preco === undefined) {
      throw {
        id: 404,
        msg: `Jogo associado com ID ${Locacao.idjogo} não encontrado ou sem preço.`,
      };
    }
    const jogoPreco = parseFloat(jogo.preco);
    if (isNaN(jogoPreco)) {
      throw {
        id: 404,
        msg: `O preço do jogo associado não é um número válido: ${jogo.preco}`,
      };
    }
    await client.query("DELETE FROM SERVIDOR WHERE id = $1 RETURNING *", [id]);
    return "Pagar: R$" + jogoPreco;
  } catch (err) {
    console.error("Erro ao deletar registro:", err.message);
    throw err;
  } finally {
    await client.end();
  }
}

async function listarDescricoes(id) {
  if (!(await UsuarioRepository.validaId(id))) {
    throw { id: 404, msg: "Usuario não cadastrado!" };
  }
  const client = getConexao();
  await client.connect();
  const resultJogos = await client.query(
    "SELECT j.* FROM jogo j join servidor s on j.id = s.idjogo join cliente c on c.id = s.idusuario WHERE s.idusuario = $1 group by s.id, j.id, c.id",
    [id]
  );
  await client.end();
  return resultJogos.rows;
}

module.exports = {
  listar,
  inserir,
  listarDescricoes,
  deletar,
  buscarPorId,
};
