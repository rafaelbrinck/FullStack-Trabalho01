// // Os testes foram implementados porém alguns ainda não estão sendo validados de forma correta. 

// const { Listar, Inserir, Atualizar, BuscarPorId, Deletar, PesquisarPorCpf, resetState } = require('./UsuarioRepository');
// describe('CRUD Usuários', () => {
//     beforeEach(() => {
//         // Reseta a lista de usuários e o idGerador antes de cada teste
//         resetState();
//     });

//     test('Listar - sucesso', () => {
//         const user1 = { nome: "Alice", cpf: "12345678901" };
//         const user2 = { nome: "Bob", cpf: "10987654321" };
//         UsuarioRepository.Inserir(user1);
//         UsuarioRepository.Inserir(user2);

//         const usuarios = UsuarioRepository.Listar();
//         expect(usuarios.length).toBe(2);
//         expect(usuarios).toContainEqual(expect.objectContaining(user1));
//         expect(usuarios).toContainEqual(expect.objectContaining(user2));
//     });

//     test('Inserir - sucesso', () => {
//         const user = { nome: "Alice", cpf: "12345678901" };
//         const resultado = UsuarioRepository.Inserir(user);

//         expect(resultado).toBeDefined();
//         expect(resultado.nome).toBe(user.nome);
//         expect(resultado.cpf).toBe(user.cpf);
//         expect(resultado.id).toBeDefined();
//     });

//     test('Inserir - exceção para nome duplicado', () => {
//         const user1 = { nome: "Alice", cpf: "12345678901" };
//         const user2 = { nome: "Alice", cpf: "98765432100" };

//         UsuarioRepository.Inserir(user1);
//         expect(() => UsuarioRepository.Inserir(user2)).toThrow({ id: 404, msg: "Nome já cadastrado!" });
//     });

//     test('Inserir - exceção para CPF duplicado', () => {
//         const user1 = { nome: "Alice", cpf: "12345678901" };
//         const user2 = { nome: "Bob", cpf: "12345678901" };

//         UsuarioRepository.Inserir(user1);
//         expect(() => UsuarioRepository.Inserir(user2)).toThrow({ id: 404, msg: "CPF já cadastrado!" });
//     });

//     test('BuscarPorId - sucesso', () => {
//         const user = { nome: "Alice", cpf: "12345678901" };
//         const usuarioInserido = UsuarioRepository.Inserir(user);
//         const usuarioBuscado = UsuarioRepository.BuscarPorId(usuarioInserido.id);

//         expect(usuarioBuscado).toBeDefined();
//         expect(usuarioBuscado.nome).toBe(user.nome);
//     });

//     test('BuscarPorId - exceção para ID inexistente', () => {
//         const usuarioBuscado = UsuarioRepository.BuscarPorId(999);
//         expect(usuarioBuscado).toBeUndefined();
//     });

//     test('Atualizar - sucesso', () => {
//         const user = { nome: "Alice", cpf: "12345678901" };
//         const usuarioInserido = UsuarioRepository.Inserir(user);
//         const usuarioAtualizado = { nome: "Alice Atualizada", cpf: "12345678901" };

//         const resultado = UsuarioRepository.Atualizar(usuarioInserido.id, usuarioAtualizado);
//         expect(resultado).toBeDefined();
//         expect(resultado.nome).toBe(usuarioAtualizado.nome);
//     });

//     test('Atualizar - exceção para ID inexistente', () => {
//         const usuarioAtualizado = { nome: "Nome", cpf: "12345678901" };
//         expect(() => UsuarioRepository.Atualizar(999, usuarioAtualizado)).toThrow();
//     });

//     test('Deletar - sucesso', () => {
//         const user = { nome: "Alice", cpf: "12345678901" };
//         const usuarioInserido = UsuarioRepository.Inserir(user);
//         const usuarioDeletado = UsuarioRepository.Deletar(usuarioInserido.id);

//         expect(usuarioDeletado).toBeDefined();
//         expect(usuarioDeletado.nome).toBe(user.nome);
//         expect(UsuarioRepository.BuscarPorId(usuarioInserido.id)).toBeUndefined();
//     });

//     test('Deletar - exceção para ID inexistente', () => {
//         expect(() => UsuarioRepository.Deletar(999)).toThrow();
//     });

//     test('PesquisarPorCpf - sucesso', () => {
//         const user1 = { nome: "Alice", cpf: "12345678901" };
//         const user2 = { nome: "Bob", cpf: "12345678901" };
//         UsuarioRepository.Inserir(user1);
//         UsuarioRepository.Inserir(user2);

//         const usuarios = UsuarioRepository.PesquisarPorCpf("12345678901");
//         expect(usuarios.length).toBe(2);
//     });
// });

// // npm run test:usuario
