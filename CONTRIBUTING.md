# Guia de Contribuição: Fluxo de Trabalho com Git

Para garantirmos que nosso trabalho em equipe seja organizado e sem conflitos, vamos seguir o seguinte fluxo de trabalho utilizando o Git e o GitHub:

## 1. Preparação Inicial (Apenas uma vez)

Primeiro, garanta que você tem a versão mais recente do projeto na sua máquina.

```bash
git checkout main
git pull origin main
```

*(Nota: Alguém da equipe precisará criar a branch `dev` e enviar para o repositório remoto primeiro com `git checkout -b dev` e `git push -u origin dev`)*.

## 2. Sincronizando antes de começar

**Sempre** comece o seu trabalho a partir da branch `dev` atualizada. Nunca crie uma branch a partir de uma branch desatualizada.

```bash
# Vá para a branch dev
git checkout dev

# Baixe as últimas atualizações que os colegas já aprovaram
git pull origin dev
```

## 3. Criando sua Branch de Tarefa (Feature Branch)

Agora, crie uma branch específica para a tarefa que você vai fazer. Use um nome descritivo.
**Padrão de nome:** `feature/nome-da-sua-tarefa` ou `fix/o-que-voce-esta-corrigindo`

```bash
# O -b cria a branch e já muda para ela
git checkout -b feature/nome-da-sua-tarefa
```

## 4. Trabalhando e Salvando (Commits)

Faça suas alterações no código. Quando terminar uma parte lógica, salve seu progresso.

```bash
# Veja os arquivos modificados
git status

# Adicione os arquivos que você quer salvar
git add .

# Crie um commit com uma mensagem clara sobre o que foi feito
git commit -m "feat: descrição do que foi feito"
```

*Dica: Faça commits pequenos e frequentes. É melhor ter vários commits explicando passo a passo do que um commit gigante chamado "terminou tudo".*

## 5. Enviando seu trabalho para Nuvem

Quando sua tarefa estiver pronta (ou se você quiser salvar na nuvem como backup), envie sua branch para o repositório remoto.

```bash
# O comando abaixo envia a branch e liga a sua branch local com a remota
git push -u origin feature/nome-da-sua-tarefa
```

*(Nos próximos envios para esta mesma branch, você pode usar apenas `git push`)*.

## 6. Criando o Pull Request (PR)

1. Vá até a página do repositório no navegador (GitHub).
2. Você verá um botão verde sugerindo **"Compare & pull request"**. Clique nele.
3. Configure o PR:
   - **Base branch:** `dev` *(Cuidado para não apontar para a main!)*
   - **Compare branch:** `feature/nome-da-sua-tarefa` (a sua branch)
4. Preencha o título e a descrição explicando o que você fez e como testar.
5. Adicione seus colegas como **Reviewers** (Revisores).
6. Clique em **Create pull request**.

## 7. Revisão e Merge

- Seus colegas vão olhar seu código, fazer comentários e sugerir melhorias.
- Se pedirem mudanças, basta você alterar no seu computador, fazer `git add`, `git commit` e `git push` novamente. O PR atualiza sozinho!
- Após a aprovação, você (ou o líder do projeto) pode clicar no botão **Merge pull request** para unir seu código à branch `dev`.

## 🚨 E se a branch `dev` for atualizada enquanto eu trabalho?

Se um colega terminar uma tarefa antes de você e o código dele for para a `dev`, a sua branch ficará desatualizada. Para evitar conflitos no PR, puxe as novidades da `dev` para dentro da sua branch:

```bash
# Garanta que você está na sua branch
git checkout feature/nome-da-sua-tarefa

# Atualize a sua cópia local da dev
git fetch origin

# Junte as novidades da dev remota na sua branch
git merge origin/dev
```

Se houver **conflitos**, sua IDE vai mostrar. Você precisará aceitar quais códigos devem ficar, salvar, fazer um `git add .` e `git commit` para resolver.
