const { Client } = require("pg");

const conexao = {
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "banco",
  database: "Locadora",
};

function getConexao() {
  return new Client(conexao);
}

module.exports = { getConexao };
