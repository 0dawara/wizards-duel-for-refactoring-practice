# Relatório de Refatoração

## Lista de Problemas Encontrados

Durante a análise do projeto Wizard Duel, foram identificados os seguintes problemas que feriam boas práticas de código e os princípios SOLID e DRY:

1. **Números Mágicos:** Valores sem contexto semântico espalhados pelo backend (em `index.js`) e frontend (em `index.html`), como os atributos de status (`90`, `85`, etc.), timeouts de turnos (`800`, `600`), e número de cartas buscadas na API (`100`, `4`, `20`).
2. **Nomes Sem Significado:** Variáveis curtas que dificultavam a legibilidade, como `d`, `pw`, `mg`, `x`, `y`, `z`, entre outras, dificultando o entendimento do fluxo de embaralhamento e manipulação de cartas.
3. **Funções com Múltiplas Responsabilidades:** O backend concentrava na mesma função (como `/api/pack` e `/api/cpu-deck`) a comunicação com a API (fetch), a transformação dos atributos, e a lógica utilitária de embaralhar.
4. **Código Duplicado:** Trechos como o mapeamento de classes para a atribuição de status da API, além do algoritmo iterativo para embaralhar o deck, apareciam de forma repetida em diferentes contextos.
5. **Code Smells Gerais e Arquitetura Monolítica:** O uso de `var` onde `let` ou `const` seriam adequados; a junção de lógica de rotas, API e inicialização num só `index.js`; e, sobretudo, a ausência de uma estrutura de arquivos limpa no frontend (onde JS e CSS misturavam-se no HTML) e no backend (onde não havia divisão de *services* ou *routes*). Além disso, não seguiam inteiramente as diretrizes do ESLint (padrão Airbnb).

## Decisões Tomadas Durante a Refatoração

A refatoração foi dividida em um fluxo organizado, atribuindo cada bloco de alteração para melhorar o projeto sem quebrar seu funcionamento.

### Etapa 1: Renomeação de Variáveis e Funções

- Analisamos as lógicas do front e back, renomeando variáveis como `x`, `y`, `z` para iteradores verbosos em funções de array (ex: `currentIndex`, `randomIndex`), e transformando `pw`, `mg`, `df` em `power`, `magic` e `defense`.
- **Vantagem:** O fluxo de jogo no front-end e os cálculos de poder se tornaram mais legíveis.

### Etapa 2: Extração de Constantes

- Extraímos todos os "números mágicos" identificados para constantes declarativas. No backend, criou-se o arquivo genérico `constants.js`. No frontend, introduzimos a estrutura semântica global `GAME_CONSTANTS`.
- **Vantagem:** Qualquer alteração/refatoração futura poderá ser feita modificando um único arquivo/objeto, eliminando riscos de inconsistência.

### Etapa 3 e 4: Eliminação de Código Duplicado e Responsabilidade Única (SOLID)

- A extração do algoritmo iterativo de embaralhar para `shuffleArray` e das atribuições de status para um serviço isolado de "calculadora de estatísticas" erradicou repetições. As rotas agora confiam na interface de um arquivo para receber o "dado limpo".
- **Vantagem:** Facilidade na criação de testes unitários; caso uma API de terceiros mude seus parâmetros de entrada, o fix será pontual numa única função ao invés de três instâncias separadas.

### Etapa 5: Limpeza de Code Smells Gerais

- Realizamos a adequação rigorosa às regras de verificação do **ESLint (Airbnb Style Guide)**. Erradicamos o uso da palavra chave `var`, transformamos concatenações custosas de strings em *Template Literals*, substituímos o uso indevido de `console.log` para `console.error` em capturas de exceção (`catch`), e garantimos igualdade estrita (`===`).
- **Vantagem:** Segurança, prevenção contra bugs de *Hoisting* indesejado (substituindo `var`), legibilidade no fluxo de erro.

### Etapa 6: Separação de Pastas e Modularização

- Adotamos um formato padrão de API REST. Dividimos o backend separando a injeção do App Express em `index.js`, as rotas em `routes/`, e as lógicas de conexão/cálculos em `services/` e `utils/`.
- No Frontend, separamos os arquivos `api.js`, `game.js`, `render.js` e também levamos o bloco `<style>` para `css/style.css`.
- **Vantagem:** Maior manutenibilidade do ciclo de vida da aplicação. Um engenheiro focado no design pode mexer na pasta CSS sem o risco de causar merge-conflicts numa lógica Express ou em um template do EJS. O código front-end carrega os scripts sequencialmente de forma limpa.

---
**Conclusão:** A refatoração ocorreu cobrindo 100% dos requisitos mantendo zero erros (`--max-warnings`) remanescentes no ESLint e garantindo uma robusta modularidade.
