const {
  Listar,
  Inserir,
  BuscarPorId,
  Atualizar,
  Deletar,
  ValidaCPF,
  ValidaNome,
} = require("./UsuarioRepository");
const { getConexao } = require("../config/database");

// Mock da função de conexão com o banco
jest.mock("../config/database", () => ({
  getConexao: jest.fn(),
}));

// Mock do objeto client para simular as interações com o banco de dados
const mockClient = {
  connect: jest.fn(),
  end: jest.fn(),
  query: jest.fn(),
};

describe("Testes do UsuarioRepository", () => {
  beforeEach(() => {
    getConexao.mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Listar: deve listar todos os usuários", async () => {
    const mockData = [{ id: 1, nome: "Usuario Teste", cpf: "12345678900" }];
    mockClient.query.mockResolvedValue({ rows: mockData });

    const result = await Listar();
    expect(result).toEqual(mockData);
    expect(mockClient.query).toHaveBeenCalledWith("SELECT * FROM USUARIOS");
  });

  test("Inserir: deve inserir um usuário no banco de dados", async () => {
    const user = {
      nome: "Teste Nome",
      cpf: "12345678900",
      email: "email@email.com",
      valor: 0,
    };

    // Simulando que ValidaNome e ValidaCPF retornam false
    mockClient.query
      // .mockResolvedValueOnce({ rows: [] }) // ValidaNome
      // .mockResolvedValueOnce({ rows: [] }) // ValidaCPF
      .mockResolvedValue({ rows: [user] }); // Inserção

    const result = await Inserir(user);
    expect(result).toEqual(user);
    expect(mockClient.query).toHaveBeenCalledWith(
      "INSERT INTO USUARIOS (nome, cpf, email, valor) VALUES ($1, $2, $3, $4) RETURNING *",
      [user.nome, user.cpf, user.email, 0]
    );
  });

  test("BuscarPorId: deve buscar um usuário pelo ID", async () => {
    const user = { id: 1, nome: "Teste Nome", cpf: "12345678900" };
    mockClient.query.mockResolvedValue({ rows: [user] });

    const result = await BuscarPorId(1);
    expect(result).toEqual(user);
    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT * FROM USUARIOS WHERE id = $1",
      [1]
    );
  });

  test("Atualizar: deve atualizar um usuário existente", async () => {
    const user = { nome: "Nome Atualizado", cpf: "98765432100" };
    const updatedUser = { id: 1, ...user };
    mockClient.query.mockResolvedValue({ rows: [updatedUser] });

    const result = await Atualizar(1, user);
    expect(result).toEqual(updatedUser);
    expect(mockClient.query).toHaveBeenCalledWith(
      "UPDATE USUARIOS SET nome = $1, cpf = $2 WHERE id = $3 RETURNING *",
      [user.nome, user.cpf, 1]
    );
  });

  test("Deletar: deve deletar um usuário pelo ID", async () => {
    const user = { id: 1, nome: "Teste Nome", cpf: "12345678900" };
    mockClient.query.mockResolvedValue({ rows: [user] });

    const result = await Deletar(1);
    expect(result).toEqual(user);
    expect(mockClient.query).toHaveBeenCalledWith(
      "DELETE FROM USUARIOS WHERE id = $1 RETURNING *",
      [1]
    );
  });

  test("ValidaCPF: deve retornar true se o CPF já existir", async () => {
    const cpf = "12345678900";
    mockClient.query.mockResolvedValue({ rows: [{ cpf }] });

    const result = await ValidaCPF(cpf);
    expect(result).toBe(true);
    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT cpf FROM USUARIOS WHERE cpf = $1",
      [cpf]
    );
  });

  test("ValidaNome: deve retornar true se o nome já existir", async () => {
    const nome = "Nome Existente";
    mockClient.query.mockResolvedValue({ rows: [{ nome }] });

    const result = await ValidaNome(nome);
    expect(result).toBe(true);
    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT nome FROM USUARIOS WHERE nome = $1",
      [nome]
    );
  });
});
