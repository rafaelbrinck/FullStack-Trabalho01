const ServidorRepository = require("./ServidorRepository");
const UsuarioRepository = require("./UsuarioRepository");
const JogoRepository = require("./JogoRepository");
const { getConexao } = require("../config/database");

jest.mock("../config/database", () => ({
  getConexao: jest.fn(),
}));

describe("Testes do ServidorRepository", () => {
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

  test("listar: deve retornar todas as locações", async () => {
    const mockData = [{ id: 1, idUsuario: 101, idJogo: 202 }];
    mockClient.query.mockResolvedValue({ rows: mockData });

    const result = await ServidorRepository.listar();

    expect(mockClient.query).toHaveBeenCalledWith("SELECT * FROM SERVIDOR");
    expect(result).toEqual(mockData);
  });

  test("inserir: deve inserir uma locação no banco de dados", async () => {
    const locacao = { idUsuario: 101, idJogo: 202 };

    jest.spyOn(UsuarioRepository, "BuscarPorId").mockResolvedValue({ id: 101 });
    jest.spyOn(JogoRepository, "BuscarPorId").mockResolvedValue({ id: 202 });
    mockClient.query.mockResolvedValue({
      rows: [{ id: 1, idUsuario: 101, idJogo: 202 }],
    });

    const result = await ServidorRepository.inserir(locacao);

    expect(mockClient.query).toHaveBeenCalledWith(
      "INSERT INTO SERVIDOR (id, idusuario, idjogo) VALUES ($1, $2, $3) RETURNING *",
      [expect.any(Number), locacao.idUsuario, locacao.idJogo]
    );
    expect(result).toEqual({ id: 1, idUsuario: 101, idJogo: 202 });
  });

  test("buscarPorId: deve retornar uma locação pelo ID", async () => {
    const mockData = { id: 1, idUsuario: 101, idJogo: 202 };
    mockClient.query.mockResolvedValue({ rows: [mockData] });

    const result = await ServidorRepository.buscarPorId(1);

    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT * FROM SERVIDOR WHERE id = $1",
      [1]
    );
    expect(result).toEqual(mockData);
  });

  test("deletar: deve deletar uma locação e retornar o preço do jogo", async () => {
    const locacao = { id: 1, idUsuario: 101, idJogo: 202 };
    const jogo = { id: 202, preco: "50.00" };

    // Simula a busca pela locação com um idJogo associado
    mockClient.query
      .mockResolvedValueOnce({ rows: [locacao] }) // Retorno da busca pela locação
      .mockResolvedValueOnce({ rows: [locacao] }); // Retorno da deleção da locação

    // Mock para JogoRepository.BuscarPorId para retornar o jogo correto
    jest.spyOn(JogoRepository, "BuscarPorId").mockResolvedValue(jogo);

    const result = await ServidorRepository.deletar(1);

    expect(mockClient.query).toHaveBeenCalledWith(
      "DELETE FROM SERVIDOR WHERE id = $1 RETURNING *",
      [1]
    );
    expect(result).toBe("Pagar: R$50.00");
  });

  test("listarDescricoes: deve retornar as descrições dos jogos para um usuário", async () => {
    const jogos = [{ id: 202, titulo: "Jogo Teste", preco: "50.00" }];
    const idUsuario = 101;

    mockClient.query.mockResolvedValue({ rows: jogos });

    const result = await ServidorRepository.listarDescricoes(idUsuario);

    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT j.* FROM jogo j join servidor s on j.id = s.idjogo join cliente c on c.id = s.idusuario WHERE s.idusuario = $1 group by s.id, j.id, c.id",
      [idUsuario]
    );
    expect(result).toEqual(jogos);
  });
});
