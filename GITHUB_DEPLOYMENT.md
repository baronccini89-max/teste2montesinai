# Guia de Publicação no GitHub

Este documento descreve o processo completo para publicar o Sistema de Certificados Monte Sinai no GitHub.

## Pré-requisitos

Antes de iniciar, certifique-se de ter:

- **Conta no GitHub** ativa
- **Git** instalado localmente
- **Acesso ao repositório** (criado ou com permissões adequadas)
- **GitHub CLI** (opcional, mas recomendado)

## Método 1: Usando a Interface Manus (Recomendado)

A plataforma Manus oferece integração direta com o GitHub, facilitando o processo de exportação do código.

### Passo 1: Acessar Configurações do Projeto

1. Abra o painel de gerenciamento do projeto no Manus
2. Navegue até **Settings** (Configurações)
3. Selecione **GitHub** no menu lateral

### Passo 2: Conectar com GitHub

1. Clique em **Connect GitHub Account** se ainda não estiver conectado
2. Autorize o acesso da plataforma Manus à sua conta GitHub
3. Selecione a organização ou conta pessoal onde deseja criar o repositório

### Passo 3: Criar Repositório

1. Defina o nome do repositório: `monte-sinai-certificados`
2. Escolha a visibilidade:
   - **Private** (Recomendado) - Apenas usuários autorizados terão acesso
   - **Public** - Qualquer pessoa poderá visualizar o código
3. Adicione uma descrição opcional
4. Clique em **Export to GitHub**

O sistema irá:
- Criar o repositório no GitHub
- Fazer push de todo o código do projeto
- Configurar o branch principal como `main`
- Adicionar o README.md automaticamente

## Método 2: Usando Git Manual

Se preferir controle total sobre o processo, siga os passos abaixo.

### Passo 1: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em **New repository**
3. Preencha os dados:
   - **Repository name:** monte-sinai-certificados
   - **Description:** Sistema de emissão de certificados - Loja Monte Sinai
   - **Visibility:** Private (recomendado)
   - **Initialize:** Não marque nenhuma opção (o código já existe)
4. Clique em **Create repository**

### Passo 2: Preparar o Projeto Localmente

Se você ainda não tem o código localmente, faça o download do projeto através da interface Manus:

1. Acesse o painel de gerenciamento
2. Navegue até **Code** (Código)
3. Clique em **Download All Files**
4. Extraia o arquivo ZIP em uma pasta local

### Passo 3: Inicializar Git

Abra o terminal na pasta do projeto e execute:

```bash
cd /caminho/para/monte-sinai-certificados
git init
git add .
git commit -m "Initial commit: Sistema de Certificados Monte Sinai"
```

### Passo 4: Conectar ao Repositório Remoto

Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub:

```bash
git remote add origin https://github.com/SEU-USUARIO/monte-sinai-certificados.git
git branch -M main
git push -u origin main
```

Se solicitado, forneça suas credenciais do GitHub ou use um Personal Access Token.

## Método 3: Usando GitHub CLI

O GitHub CLI oferece uma experiência mais integrada via linha de comando.

### Passo 1: Instalar GitHub CLI

**Linux/macOS:**
```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
sudo apt install gh
```

**Windows:**
Baixe o instalador em [cli.github.com](https://cli.github.com)

### Passo 2: Autenticar

```bash
gh auth login
```

Siga as instruções interativas para autenticar com sua conta GitHub.

### Passo 3: Criar e Publicar Repositório

```bash
cd /caminho/para/monte-sinai-certificados
git init
git add .
git commit -m "Initial commit: Sistema de Certificados Monte Sinai"

# Criar repositório privado e fazer push
gh repo create monte-sinai-certificados --private --source=. --push
```

## Configurações Recomendadas do Repositório

Após publicar o código, configure o repositório adequadamente:

### 1. Adicionar Descrição e Tópicos

No GitHub, acesse o repositório e adicione:

**Descrição:**
```
Sistema web para emissão e gerenciamento de certificados de presença - Loja Monte Sinai
```

**Tópicos (Topics):**
- `certificate-management`
- `react`
- `typescript`
- `trpc`
- `tailwindcss`
- `pdf-generation`

### 2. Configurar Branch Protection

Para proteger o branch principal:

1. Acesse **Settings** > **Branches**
2. Clique em **Add rule**
3. Em **Branch name pattern**, digite: `main`
4. Marque as opções:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require conversation resolution before merging
5. Clique em **Create**

### 3. Adicionar .gitignore

Certifique-se de que o arquivo `.gitignore` está configurado corretamente:

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/

# Environment variables
.env
.env.local
.env.production

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Database
*.db
*.sqlite

# Testing
coverage/

# Temporary files
.tmp/
temp/
```

### 4. Configurar Secrets (GitHub Actions)

Se você planeja usar CI/CD com GitHub Actions:

1. Acesse **Settings** > **Secrets and variables** > **Actions**
2. Clique em **New repository secret**
3. Adicione os seguintes secrets:
   - `DATABASE_URL` - String de conexão do banco
   - `JWT_SECRET` - Segredo para JWT
   - `AWS_ACCESS_KEY_ID` - Credenciais S3
   - `AWS_SECRET_ACCESS_KEY` - Credenciais S3
   - `AWS_REGION` - Região do bucket
   - `AWS_BUCKET_NAME` - Nome do bucket

## Gerenciamento de Colaboradores

### Adicionar Colaboradores

Para permitir que outros membros da Loja Monte Sinai contribuam:

1. Acesse **Settings** > **Collaborators and teams**
2. Clique em **Add people**
3. Digite o nome de usuário ou e-mail do GitHub
4. Selecione o nível de permissão:
   - **Read** - Apenas visualização
   - **Write** - Pode fazer commits e criar branches
   - **Admin** - Controle total do repositório
5. Clique em **Add [username] to this repository**

### Criar Equipe (Para Organizações)

Se o repositório está em uma organização:

1. Acesse a página da organização
2. Clique em **Teams**
3. Clique em **New team**
4. Defina:
   - **Team name:** Desenvolvedores Monte Sinai
   - **Description:** Equipe de desenvolvimento do sistema
   - **Visibility:** Visible ou Secret
5. Adicione membros à equipe
6. No repositório, vá em **Settings** > **Collaborators and teams**
7. Adicione a equipe com as permissões adequadas

## Workflow de Desenvolvimento

Recomendamos o seguinte fluxo de trabalho para desenvolvimento colaborativo:

### 1. Criar Branch para Novas Features

```bash
git checkout -b feature/nome-da-funcionalidade
```

### 2. Fazer Commits Descritivos

```bash
git add .
git commit -m "feat: adiciona funcionalidade de envio por e-mail"
```

Convenção de commits:
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alterações na documentação
- `style:` - Formatação de código
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Tarefas de manutenção

### 3. Fazer Push do Branch

```bash
git push origin feature/nome-da-funcionalidade
```

### 4. Criar Pull Request

1. Acesse o repositório no GitHub
2. Clique em **Pull requests** > **New pull request**
3. Selecione o branch de origem e destino
4. Preencha o título e descrição
5. Solicite revisão de outros desenvolvedores
6. Clique em **Create pull request**

### 5. Revisar e Fazer Merge

Após aprovação:
1. Clique em **Merge pull request**
2. Escolha o tipo de merge:
   - **Create a merge commit** - Mantém histórico completo
   - **Squash and merge** - Combina commits em um só
   - **Rebase and merge** - Reaplica commits linearmente
3. Confirme o merge
4. Delete o branch após merge (opcional)

## Sincronização com Manus

Se você fizer alterações diretamente no GitHub e quiser sincronizar com a plataforma Manus:

### Opção 1: Importar do GitHub

1. Crie um novo projeto no Manus
2. Selecione **Import from GitHub**
3. Escolha o repositório `monte-sinai-certificados`
4. O Manus irá clonar o código e configurar o ambiente

### Opção 2: Pull Manual

Se o projeto já existe no Manus:

1. Acesse o terminal do projeto
2. Execute:
```bash
git pull origin main
```
3. Reinicie o servidor de desenvolvimento se necessário

## Manutenção do Repositório

### Atualizar README

Sempre que adicionar novas funcionalidades, atualize o README.md:

```bash
git checkout main
git pull origin main
# Edite o README.md
git add README.md
git commit -m "docs: atualiza README com novas funcionalidades"
git push origin main
```

### Criar Releases

Para marcar versões estáveis:

1. Acesse **Releases** no repositório
2. Clique em **Draft a new release**
3. Preencha:
   - **Tag version:** v1.0.0 (seguindo Semantic Versioning)
   - **Release title:** Sistema de Certificados v1.0.0
   - **Description:** Lista de mudanças e melhorias
4. Marque **Set as the latest release**
5. Clique em **Publish release**

### Gerenciar Issues

Use Issues para rastrear bugs e solicitações de funcionalidades:

1. Acesse **Issues** > **New issue**
2. Escolha um template (se configurado) ou crie manualmente
3. Preencha título e descrição detalhada
4. Adicione labels:
   - `bug` - Problema a ser corrigido
   - `enhancement` - Nova funcionalidade
   - `documentation` - Melhoria na documentação
   - `question` - Dúvida ou discussão
5. Atribua a um responsável (opcional)
6. Clique em **Submit new issue**

## Backup e Recuperação

### Criar Backup Local

```bash
git clone https://github.com/SEU-USUARIO/monte-sinai-certificados.git backup-monte-sinai
cd backup-monte-sinai
git log --oneline  # Verificar histórico
```

### Restaurar Versão Anterior

Se precisar reverter para uma versão anterior:

```bash
# Ver histórico de commits
git log --oneline

# Reverter para um commit específico
git checkout HASH-DO-COMMIT

# Ou criar um novo branch a partir desse commit
git checkout -b recuperacao-versao-antiga HASH-DO-COMMIT
```

## Recursos Adicionais

- **Documentação Git:** [git-scm.com/doc](https://git-scm.com/doc)
- **GitHub Docs:** [docs.github.com](https://docs.github.com)
- **GitHub CLI:** [cli.github.com](https://cli.github.com)
- **Semantic Versioning:** [semver.org](https://semver.org)
- **Conventional Commits:** [conventionalcommits.org](https://www.conventionalcommits.org)

## Suporte

Para dúvidas sobre o processo de publicação no GitHub, entre em contato com a equipe de tecnologia da Loja Monte Sinai ou consulte a documentação oficial do GitHub.

---

**Última atualização:** Fevereiro de 2026
