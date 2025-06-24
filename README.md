# PokeExplorer:

Este é um aplicativo móvel desenvolvido com **Ionic 7** e **Angular 17 (Standalone Components API)**, projetado para explorar o universo Pokémon utilizando a **PokeAPI**. O objetivo principal é demonstrar habilidades em desenvolvimento front-end, consumo de APIs RESTful e aplicação de boas práticas de código.

## Abordagem e Design

A arquitetura do projeto foi pensada para ser modular e escalável. Utilizamos o padrão de **Injeção de Dependência** com serviços (como `PokemonService` e `FavoriteService`) para desacoplar a lógica de negócio da camada de UI, facilitando a testabilidade e manutenção. Os componentes standalone do Angular foram adotados para uma estrutura mais moderna e leve.

O **estilo de codificação** segue as convenções padrão do Angular e TypeScript, com nomes de variáveis e funções claros e padronizados (inglês para maior clareza em projetos públicos). A manipulação de dados assíncronos é gerenciada com **RxJS**, utilizando operadores como `forkJoin` para otimizar múltiplas chamadas de API.

O design da interface busca ser **funcional e intuitivo**, adaptando-se a diferentes tamanhos e orientações de tela (**responsividade**) com o sistema de grid do Ionic e media queries CSS. A experiência do usuário é aprimorada com a implementação de **paginação por infinite scroll** na lista de Pokémons, permitindo um carregamento eficiente de dados.

## Funcionalidades Implementadas

* **Tela Principal:** Exibe uma lista paginada de Pokémons com seus nomes e imagens.
* **Tela de Detalhes:** Apresenta informações detalhadas de um Pokémon selecionado (tipos, habilidades, estatísticas, altura, peso) e múltiplos sprites.
* **Favoritos:** Permite marcar e desmarcar Pokémons como favoritos, persistindo os dados no `localStorage` do navegador. Uma tela dedicada lista todos os Pokémons favoritos.
* **Navegação:** Fácil transição entre as telas principal, de detalhes e de favoritos.

## Como Rodar o Projeto

Para configurar e executar o projeto localmente, siga os passos abaixo:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/AmorimYago/PokeExplorer.git

2.  **Instale as Dependências:**
    Certifique-se de ter o Node.js e o npm (ou Yarn) instalados.
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Instale o Ionic CLI (se ainda não tiver):**
    ```bash
    npm install -g @ionic/cli
    ```

4.  **Execute o Aplicativo:**
    ```bash
    ionic serve
    ```
    O aplicativo será aberto automaticamente no seu navegador padrão (geralmente em `http://localhost:8100`).