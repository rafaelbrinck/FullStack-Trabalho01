const JogoRepository = require("./JogoRepository");
const { getConexao } = require("../config/database");

jest.mock("../config/database");

describe("JogoRepository", () => {
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

  describe("Listar", () => {
    it("deve retornar uma lista de jogos", async () => {
      const jogosMock = [
        { id: 1, nome: "Jogo A" },
        { id: 2, nome: "Jogo B" },
      ];
      mockClient.query.mockResolvedValue({ rows: jogosMock });

      const jogos = await JogoRepository.Listar();

      expect(mockClient.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith("SELECT * FROM JOGOS");
      expect(mockClient.end).toHaveBeenCalled();
      expect(jogos).toEqual(jogosMock);
    });
  });

  describe("Inserir", () => {
    it("deve inserir um novo jogo e retornar o jogo inserido", async () => {
      const jogo = {
        nome: "Jogo TESTE",
        preco: 50,
        quantidade: 10,
      };
      const jogoInserido = { id: 1234, ...jogo };

      // Mock para garantir que ValidaNome retorne false, indicando que o jogo ainda não existe
      JogoRepository.ValidaNome = jest.fn().mockResolvedValue(false);

      mockClient.query.mockResolvedValue({ rows: [jogoInserido] });

      const result = await JogoRepository.Inserir(jogo);

      // expect(JogoRepository.ValidaNome).toHaveBeenCalledWith(jogo.nome);
      // expect(mockClient.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        "INSERT INTO JOGOS (nome, preco, quantidade) VALUES ($1, $2, $3) RETURNING *",
        expect.arrayContaining([jogo.nome, jogo.preco, jogo.quantidade])
      );
      expect(mockClient.end).toHaveBeenCalled();
      expect(result).toEqual(jogoInserido);
    });

    it("deve lançar um erro ao inserir um jogo com dados incompletos", async () => {
      const jogo = { nome: "Jogo C", preco: 50 };

      await expect(JogoRepository.Inserir(jogo)).rejects.toEqual({
        id: 400,
        msg: "Dados do jogo incompletos!",
      });
    });
  });

  describe("BuscarPorId", () => {
    it("deve retornar um jogo pelo ID", async () => {
      const jogoMock = { id: 1, nome: "Jogo A", categoria: "Aventura" };
      mockClient.query.mockResolvedValue({ rows: [jogoMock] });

      const jogo = await JogoRepository.BuscarPorId(1);

      expect(mockClient.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        "SELECT * FROM JOGOS WHERE id = $1",
        [1]
      );
      expect(mockClient.end).toHaveBeenCalled();
      expect(jogo).toEqual(jogoMock);
    });

    it("deve lançar um erro se o jogo não for encontrado", async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      await expect(JogoRepository.BuscarPorId(999)).rejects.toEqual({
        id: 404,
        msg: "Jogo não cadastrado!",
      });
    });
  });

  describe("Atualizar", () => {
    it("deve atualizar um jogo existente e retornar o jogo atualizado", async () => {
      const jogo = {
        nome: "Jogo Atualizado",
        categoria: "Aventura",
        preco: 60,
        quantidade: 5,
      };
      const jogoAtualizado = { id: 1, ...jogo };
      mockClient.query.mockResolvedValue({ rows: [jogoAtualizado] });

      const result = await JogoRepository.Atualizar(1, jogo);

      expect(mockClient.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        "UPDATE JOGOS SET nome = $1, preco = $2, quantidade = $3 WHERE id = $4 RETURNING *",
        [jogo.nome, jogo.preco, jogo.quantidade, 1]
      );
      expect(mockClient.end).toHaveBeenCalled();
      expect(result).toEqual(jogoAtualizado);
    });
  });

  describe("Deletar", () => {
    it("deve deletar um jogo pelo ID e retornar o jogo deletado", async () => {
      const jogoDeletado = { id: 1, nome: "Jogo Deletado" };
      mockClient.query.mockResolvedValue({ rows: [jogoDeletado] });

      const result = await JogoRepository.Deletar(1);

      expect(mockClient.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        "DELETE FROM JOGOS WHERE id = $1 RETURNING *",
        [1]
      );
      expect(mockClient.end).toHaveBeenCalled();
      expect(result).toEqual(jogoDeletado);
    });

    it("deve lançar um erro se o jogo a ser deletado não for encontrado", async () => {
      // Simulando que o jogo não existe ao retornar uma linha vazia
      JogoRepository.validaId = jest.fn().mockResolvedValue(false);
      mockClient.query.mockResolvedValue({ rows: [] });

      await expect(JogoRepository.Deletar(999)).rejects.toEqual({
        id: 404,
        msg: "Jogo não cadastrado!",
      });
    });
  });
});
