const JogoRepository = require("./JogoRepository");
const { getConexao } = require("../config/database");

jest.mock("../config/database", () => ({
  getConexao: jest.fn(),
}));

describe("Testes do JogoRepository", () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    };
    getConexao.mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Listar: deve retornar todos os jogos", async () => {
    const mockData = [
      { id: 1, nome: "Jogo 1" },
      { id: 2, nome: "Jogo 2" },
    ];
    mockClient.query.mockResolvedValue({ rows: mockData });

    const result = await JogoRepository.Listar();

    expect(mockClient.query).toHaveBeenCalledWith("SELECT * FROM JOGO");
    expect(result).toEqual(mockData);
  });

  test("Inserir: deve inserir um jogo no banco de dados", async () => {
    const jogo = {
      nome: "Novo Jogo",
      categoria: "Ação",
      preco: 50,
      quantidade: 10,
    };
    mockClient.query.mockResolvedValueOnce({ rows: [] }); // Para ValidaNome, simulando que o jogo não existe
    mockClient.query.mockResolvedValueOnce({ rows: [{ id: 123, ...jogo }] }); // Para a inserção

    jest.spyOn(JogoRepository, "ValidaNome").mockResolvedValue(false);

    const result = await JogoRepository.Inserir(jogo);

    expect(mockClient.query).toHaveBeenNthCalledWith(
      1,
      "SELECT nome FROM JOGO WHERE nome = $1",
      [jogo.nome]
    );
    expect(mockClient.query).toHaveBeenNthCalledWith(
      2,
      "INSERT INTO JOGO (id, nome, categoria, preco, quantidade) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        expect.any(Number),
        jogo.nome,
        jogo.categoria,
        jogo.preco,
        jogo.quantidade,
      ]
    );
    expect(result).toEqual({ id: 12345, ...jogo });
  });

  test("Inserir: deve lançar erro se os dados do jogo estiverem incompletos", async () => {
    const jogo = { nome: "Jogo Incompleto", preco: 50 };

    await expect(JogoRepository.Inserir(jogo)).rejects.toEqual({
      id: 400,
      msg: "Dados do jogo incompletos!",
    });
  });

  test("BuscarPorId: deve retornar um jogo pelo ID", async () => {
    const mockData = { id: 1, nome: "Jogo 1", categoria: "Ação" };
    mockClient.query.mockResolvedValue({ rows: [mockData] });

    const result = await JogoRepository.BuscarPorId(1);

    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT * FROM JOGO WHERE id = $1",
      [1]
    );
    expect(result).toEqual(mockData);
  });

  test("Atualizar: deve atualizar um jogo existente", async () => {
    const jogo = {
      nome: "Jogo Atualizado",
      categoria: "Ação",
      preco: 60,
      quantidade: 5,
    };
    mockClient.query.mockResolvedValue({ rows: [{ id: 1, ...jogo }] });

    const result = await JogoRepository.Atualizar(1, jogo);

    expect(mockClient.query).toHaveBeenCalledWith(
      "UPDATE JOGO SET nome = $1, categoria = $2, preco = $3, quantidade = $4 WHERE id = $5 RETURNING *",
      [jogo.nome, jogo.categoria, jogo.preco, jogo.quantidade, 1]
    );
    expect(result).toEqual({ id: 1, ...jogo });
  });

  test("Deletar: deve deletar um jogo pelo ID", async () => {
    const mockData = { id: 1, nome: "Jogo Deletado" };
    mockClient.query.mockResolvedValue({ rows: [mockData] });

    const result = await JogoRepository.Deletar(1);

    expect(mockClient.query).toHaveBeenCalledWith(
      "DELETE FROM JOGO WHERE id = $1 RETURNING *",
      [1]
    );
    expect(result).toEqual(mockData);
  });

  test("PesquisarPorCategoria: deve retornar jogos por categoria", async () => {
    const mockData = [{ id: 1, nome: "Jogo Ação" }];
    mockClient.query.mockResolvedValue({ rows: mockData });

    const result = await JogoRepository.PesquisarPorCategoria("Ação");

    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT * FROM JOGO WHERE categoria = $1",
      ["Ação"]
    );
    expect(result).toEqual(mockData);
  });

  test("ValidaNome: deve retornar true se o nome do jogo já existir", async () => {
    mockClient.query.mockResolvedValue({ rows: [{ nome: "Jogo Existente" }] });

    const result = await JogoRepository.ValidaNome("Jogo Existente");

    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT nome FROM JOGO WHERE nome = $1",
      ["Jogo Existente"]
    );
    expect(result).toBe(true);
  });

  test("ValidaNome: deve retornar false se o nome do jogo não existir", async () => {
    mockClient.query.mockResolvedValue({ rows: [] });

    const result = await JogoRepository.ValidaNome("Jogo Inexistente");

    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT nome FROM JOGO WHERE nome = $1",
      ["Jogo Inexistente"]
    );
    expect(result).toBe(false);
  });
});
