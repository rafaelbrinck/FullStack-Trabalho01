# API de Jogo em Nuvem

Esta API foi construída para representar um modelo de negócio onde os usuários podem cadastrar-se, cadastrar jogos e criar servidores para que os jogadores possam "alugar" um slot e acessar os jogos selecionados. O conceito é semelhante a um serviço de game cloud, mas em uma versão mais básica.

## Funcionalidades

A API possui as seguintes funcionalidades:

- **Cadastro de Usuários**: Permite que novos usuários se registrem na plataforma.
- **Cadastro de Jogos**: Possibilita o registro de jogos disponíveis para aluguel.
- **Aluguel de Slots no Servidor**: Os jogadores podem alugar um slot em um servidor para jogar o jogo de sua escolha.

## Estrutura da API

A API é composta por várias rotas, organizadas da seguinte forma:

### Rotas de Cadastro

- `POST /usuarios`: Cadastra um novo usuário.
- `POST /jogos`: Cadastra um novo jogo.

### Rotas de Aluguel

- `POST /servidores/:id/alugar`: Aluga um slot no servidor especificado para um jogo.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express**: Framework para construção da API.
- **Jest**: Biblioteca para testes automatizados.

## Como Executar

1. Clone o repositório:
   ```bash
   git clone <https://github.com/rafaelbrinck/Trabalho01Api.git>



Rafael Brinckmann e Pedro Sbardelotto