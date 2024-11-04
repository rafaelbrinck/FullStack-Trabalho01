const { Listar, Inserir, BuscarPorId, Atualizar, Deletar, PesquisarPorCategoria, resetState } = require('./JogoRepository');

// Reinicia o estado da lista antes de cada teste 
beforeEach(() => {
    resetState();
});

describe("CRUD jogos", () => {
    // Teste para listar
    test("Listar - sucesso", () => {
        expect(Listar()).toEqual([]);
        Inserir({ nome: "Call Of Duty", categoria: "FPS", preco: 150, quantidade: 10 });
        expect(Listar().length).toBe(1);
    });
    // Teste para Inserir
    test("Inserir - sucesso", () => {
        const jogo = { nome: "Call Of Duty", categoria: "FPS", preco: 150, quantidade: 10 };
        const result = Inserir(jogo);
        expect(result).toHaveProperty("id", 1);
        expect(result.nome).toBe("Call Of Duty");
    });

    test("Inserir - Exceção para quantidade negativa", () => {
        const jogo = { nome: "New World", categoria: "MMORPG", preco: 240, quantidade: -5 };
        expect(() => Inserir(jogo)).toThrow(expect.objectContaining({ msg: "Quantidade menor que zero!" }));
    });

    test("Inserir - Exceção para preço negativo", () => {
        const jogo = { nome: "New World", categoria: "MMORPG", preco: -240, quantidade: 5 };

        try {
            Inserir(jogo);
        } catch (error) {
            expect(error).toEqual({
                id: 400,
                msg: "Valor menor que zero!"
            });
        }
    });

    test("Inserir - Exceção para nome duplicado", () => {
        const jogo1 = { nome: "New World", categoria: "MMORPG", preco: 240, quantidade: 5 };
        const jogo2 = { nome: "New World", categoria: "MMORPG", preco: 240, quantidade: 5 };

        Inserir(jogo1); // Insere o primeiro jogo

        try {
            Inserir(jogo2);
        } catch (error) {
            expect(error).toEqual({
                id: 404,
                msg: "Jogo já cadastrado!"
            });
        }
    });
    // Teste para Buscar 
    test("BuscarPorId - sucesso", () => {
        const jogo = Inserir({ nome: "New World", categoria: "MMORPG", preco: 240, quantidade: 5 });
        const result = BuscarPorId(jogo.id);
        expect(result).toEqual(jogo);
    });
    // Teste para BuscarPorId
    test("BuscarPorId - exceção para ID inexistente", () => {
        expect(BuscarPorId(999)).toBeUndefined();
    });
    // Teste para Atualizar 
    test("Atualizar - sucesso", () => {
        const jogo = { nome: "New World", categoria: "MMORPG", preco: 200, quantidade: 10 };
        Inserir(jogo); // Insira o jogo antes de tentar atualizá-lo
    
        const atualizado = { nome: "New World - Versão Final", categoria: "MMORPG", preco: 240, quantidade: 5 };
        const result = Atualizar(jogo.id, atualizado); // Atualiza o jogo
    
        expect(result).toBeDefined(); // Verifica se o resultado está definido
        expect(result.id).toBe(jogo.id); // Verifica se o ID permanece o mesmo
        expect(result.nome).toBe("New World - Versão Final"); // Verifica se o nome foi atualizado
    });

    test("Atualizar - exceção para ID inexistente", () => {
        const atualizado = { nome: "New World - Versão Final", categoria: "MMORPG", preco: 240, quantidade: 5 };
        expect(() => Atualizar(999, atualizado)).toThrowError(new Error("Jogo não encontrado!")); 
    });
    // Teste para Deletar
    test("Deletar - Sucesso", () => {
        const jogo = Inserir({ nome: "New World - Versão Final", categoria: "MMORPG", preco: 240, quantidade: 5 });
        const result = Deletar(jogo.id);
        expect(result).toBe(jogo);
        expect(Listar().length).toBe(0);
    });

    test("Deletar - exceção para ID inexistente", () => {
        expect(Deletar(999)).toBeUndefined();
    });

    test("PesquisarPorCategoria - sucesso", () => {
        Inserir({ nome: "New World - Versão Final", categoria: "MMORPG", preco: 240, quantidade: 5 });
        Inserir({ nome: "Word Of Warcraft", categoria: "MMORPG", preco: 30, quantidade: 5 });
        const result = PesquisarPorCategoria("MMORPG");
        expect(result.length).toBe(2);
    });

    test("PesquisarPorCategoria - exceção para categoria inexistente", () => {
        expect(PesquisarPorCategoria("Inexistente")).toEqual([]);
    });
});

// npm run test:jogos