# Guia de Contribuição: Fluxo de Trabalho com Git

Para garantirmos que nosso trabalho em equipe seja organizado e sem conflitos, vamos seguir o seguinte fluxo de trabalho utilizando o Git e o GitHub:

## 1. Instalação e Configuração do Git (Apenas uma vez)

Se você é iniciante ou está configurando seu ambiente agora, siga os passos abaixo para instalar e configurar o Git corretamente na sua máquina.

### Passo 1.1: Instalar o Git

Escolha o método adequado para o seu sistema operacional:

* **Windows**:
  * **Pelo site oficial (Recomendado)**: Baixe e instale a versão mais recente em [git-scm.com/download/win](https://git-scm.com/download/win). Pode avançar com todas as opções padrão no instalador.
  * **Pelo Terminal (PowerShell)**: Abra o terminal como Administrador e execute:

        ```powershell
        winget install --id Git.Git -e --source winget
        ```

* **macOS**:
  * Abra o Terminal e digite `git --version`. Se não estiver instalado, o sistema oferecerá para instalar as ferramentas de linha de comando do Xcode.
  * Se usar Homebrew, execute: `brew install git`.
* **Linux (Ubuntu/Debian)**:
  * Abra o terminal e execute:

        ```bash
        sudo apt update && sudo apt install git -y
        ```

Para testar se a instalação funcionou, abra um novo terminal e rode:

```bash
git --version
```

---

### Passo 1.2: Configurar sua Identidade no Git

Você precisa dizer ao Git quem você é. Isso é obrigatório para que os seus commits fiquem devidamente associados ao seu perfil do GitHub. Substitua pelos seus dados reais (utilize o **mesmo e-mail** cadastrado na sua conta do GitHub):

```bash
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu.email@exemplo.com"
```

Para confirmar se os dados foram salvos corretamente, execute:

```bash
git config --global --list
```

---

### Passo 1.3: Autenticação com o GitHub e Clonagem

Para baixar o projeto e enviar suas alterações, você precisa de autenticação válida com o GitHub. Existem duas formas comuns de configurar isso:

#### Opção A: HTTPS com Git Credential Manager (Mais recomendada para iniciantes)

1. Vá até a página deste repositório no GitHub.
2. Clique no botão verde **Code** e copie o link da aba **HTTPS**:
   `https://github.com/0dawara/wizards-duel-for-refactoring-practice.git`
3. Abra o terminal (como o Git Bash ou PowerShell) na pasta onde deseja salvar seus projetos e clone o repositório:

   ```bash
   git clone https://github.com/0dawara/wizards-duel-for-refactoring-practice.git
   ```

4. Entre na pasta criada:

   ```bash
   cd wizards-duel-for-refactoring-practice
   ```

5. Na primeira vez que você fizer uma operação com o servidor remoto (como enviar alterações com `git push`), o Git abrirá uma janela gráfica no seu navegador solicitando que você faça login e autorize o acesso à sua conta do GitHub. Basta autenticar por lá e tudo estará configurado.

#### Opção B: Chave SSH (Recomendado se você já utiliza Git ou prefere autenticação sem senhas/telas adicionais)

1. Gere um novo par de chaves SSH no seu terminal:

   ```bash
   ssh-keygen -t ed25519 -C "seu.email@exemplo.com"
   ```

   *(Pressione `Enter` para todas as perguntas seguintes para aceitar o local e senhas padrão).*
2. Copie o conteúdo da sua chave pública:
   * **Windows (PowerShell)**: `Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard` (isso copia diretamente para a sua área de transferência)
   * **macOS / Linux**: `cat ~/.ssh/id_ed25519.pub` (copie manualmente o texto retornado no terminal)
3. Vá ao GitHub, acesse as suas **Configurações (Settings) -> SSH and GPG keys -> New SSH Key**. Cole a chave pública no campo de texto e salve.
4. Clone o repositório utilizando a URL da aba **SSH**:

   ```bash
   git clone git@github.com:0dawara/wizards-duel-for-refactoring-practice.git
   cd wizards-duel-for-refactoring-practice
   ```

---

## 2. Preparação Inicial (Após clonar o repositório)

Sempre garanta que você tem a versão mais recente da branch `main` do projeto na sua máquina:

```bash
# Vá para a branch principal
git checkout main

# Baixe as últimas atualizações do servidor
git pull origin main
```

*(Nota: Alguém da equipe precisará criar a branch `dev` e enviar para o repositório remoto primeiro com `git checkout -b dev` e `git push -u origin dev`)*.

## 3. Sincronizando antes de começar

**Sempre** comece o seu trabalho a partir da branch `dev` atualizada. Nunca crie uma branch a partir de uma branch desatualizada.

```bash
# Vá para a branch dev
git checkout dev

# Baixe as últimas atualizações que os colegas já aprovaram
git pull origin dev
```

## 4. Criando sua Branch de Tarefa (Feature Branch)

Agora, crie uma branch específica para a tarefa que você vai fazer. Use um nome descritivo.
**Padrão de nome:** `feature/nome-da-sua-tarefa` ou `fix/o-que-voce-esta-corrigindo`

```bash
# O -b cria a branch e já muda para ela
git checkout -b feature/nome-da-sua-tarefa
```

## 5. Trabalhando e Salvando (Commits)

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

## 6. Enviando seu trabalho para Nuvem

Quando sua tarefa estiver pronta (ou se você quiser salvar na nuvem como backup), envie sua branch para o repositório remoto.

```bash
# O comando abaixo envia a branch e liga a sua branch local com a remota
git push -u origin feature/nome-da-sua-tarefa
```

*(Nos próximos envios para esta mesma branch, você pode usar apenas `git push`)*.

## 7. Criando o Pull Request (PR)

1. Vá até a página do repositório no navegador (GitHub).
2. Você verá um botão verde sugerindo **"Compare & pull request"**. Clique nele.
3. Configure o PR:
   * **Base branch:** `dev` *(Cuidado para não apontar para a main!)*
   * **Compare branch:** `feature/nome-da-sua-tarefa` (a sua branch)
4. Preencha o título e a descrição explicando o que você fez e como testar.
5. Adicione seus colegas como **Reviewers** (Revisores).
6. Clique em **Create pull request**.

## 8. Revisão e Merge

* Seus colegas vão olhar seu código, fazer comentários e sugerir melhorias.
* Se pedirem mudanças, basta você alterar no seu computador, fazer `git add`, `git commit` e `git push` novamente. O PR atualiza sozinho!
* Após a aprovação, você (ou o líder do projeto) pode clicar no botão **Merge pull request** para unir seu código à branch `dev`.

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
