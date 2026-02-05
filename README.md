# Sistema de Certificados Monte Sinai

Sistema web completo para emissão e gerenciamento de certificados de presença da **Augusta Respeitável Benfeitora e Excelsa Loja Simbólica Monte Sinai**.

## Sobre o Sistema

Este sistema foi desenvolvido para facilitar a emissão de certificados de presença para irmãos que participam das sessões da Loja Monte Sinai. O sistema oferece uma interface moderna e intuitiva, com controle de acesso baseado em roles (administrador e usuário), cadastro de dados reutilizáveis e geração automática de certificados em PDF com layout personalizado.

### Características Principais

O sistema oferece **gestão completa de certificados** com autenticação segura, permitindo que apenas usuários autorizados acessem as funcionalidades. Administradores podem criar e gerenciar outros usuários do sistema, definindo permissões específicas para cada um.

A funcionalidade de **cadastro reutilizável** permite armazenar informações de sessões, graus, irmãos, obreiros e potências no banco de dados. Todos os cadastros incluem busca por inicial do nome, facilitando a localização rápida de registros durante a emissão de certificados.

A **geração de certificados em PDF** utiliza layout personalizado com fundo bege, bordas decorativas e cabeçalho institucional da Loja Monte Sinai. Os certificados são armazenados automaticamente no S3 e podem ser baixados a qualquer momento através do histórico.

O **histórico completo** mantém registro de todos os certificados emitidos, com funcionalidade de busca por nome do irmão, sessão ou grau. A interface também está preparada para envio de certificados por e-mail (funcionalidade que pode ser integrada futuramente).

## Tecnologias Utilizadas

| Categoria | Tecnologia | Versão |
|-----------|-----------|---------|
| **Frontend** | React | 19.2.1 |
| **Estilização** | Tailwind CSS | 4.1.14 |
| **Componentes UI** | shadcn/ui + Radix UI | - |
| **Backend** | Express + tRPC | 4.21.2 / 11.6.0 |
| **Banco de Dados** | MySQL (TiDB) | - |
| **ORM** | Drizzle ORM | 0.44.5 |
| **Autenticação** | bcryptjs + JWT | 3.0.3 / 6.1.0 |
| **Geração de PDF** | pdf-lib | 1.17.1 |
| **Armazenamento** | AWS S3 | 3.693.0 |
| **Testes** | Vitest | 2.1.4 |

## Estrutura do Projeto

```
monte-sinai-certificados/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── ui/          # Componentes shadcn/ui
│   │   │   └── DashboardLayout.tsx
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   ├── DataManagement.tsx
│   │   │   ├── CertificateGenerator.tsx
│   │   │   └── CertificateHistory.tsx
│   │   ├── hooks/           # Custom hooks
│   │   ├── contexts/        # React contexts
│   │   └── lib/             # Utilitários e configurações
│   └── public/              # Arquivos estáticos
├── server/                   # Backend Express + tRPC
│   ├── _core/               # Configurações do framework
│   ├── routers.ts           # Definição de rotas tRPC
│   ├── db.ts                # Helpers de banco de dados
│   ├── storage.ts           # Integração com S3
│   └── utils/               # Utilitários do servidor
│       ├── certificatePdfGenerator.ts
│       └── password.ts
├── drizzle/                 # Schema e migrações do banco
│   ├── schema.ts
│   └── migrations/
├── shared/                  # Código compartilhado
│   ├── const.ts
│   └── types.ts
└── tests/                   # Testes automatizados
    ├── auth.test.ts
    ├── data.test.ts
    └── users.test.ts
```

## Instalação e Configuração

### Pré-requisitos

- **Node.js** 22.x ou superior
- **pnpm** 10.x ou superior
- **MySQL** ou **TiDB** (banco de dados compatível)
- **Conta AWS S3** para armazenamento de certificados

### Passo a Passo

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/monte-sinai-certificados.git
cd monte-sinai-certificados
```

**2. Instale as dependências**

```bash
pnpm install
```

**3. Configure as variáveis de ambiente**

As seguintes variáveis são injetadas automaticamente pela plataforma Manus:

- `DATABASE_URL` - String de conexão MySQL/TiDB
- `JWT_SECRET` - Segredo para assinatura de tokens
- `AWS_ACCESS_KEY_ID` - Credenciais S3 (via storage.ts)
- `AWS_SECRET_ACCESS_KEY` - Credenciais S3 (via storage.ts)
- `AWS_REGION` - Região do bucket S3
- `AWS_BUCKET_NAME` - Nome do bucket S3

**4. Execute as migrações do banco de dados**

```bash
pnpm db:push
```

**5. Inicie o servidor de desenvolvimento**

```bash
pnpm dev
```

O sistema estará disponível em `http://localhost:3000`

### Build para Produção

```bash
pnpm build
pnpm start
```

## Uso do Sistema

### Primeiro Acesso

No primeiro acesso ao sistema, você precisará criar um usuário administrador. O sistema utiliza autenticação local com e-mail e senha.

**Criar primeiro usuário administrador:**

Você pode criar o primeiro usuário diretamente no banco de dados ou através da rota de registro (que deve ser protegida em produção):

```sql
INSERT INTO users (name, email, password, role, loginMethod) 
VALUES ('Administrador', 'admin@montesinai.com', '$2a$10$...', 'admin', 'local');
```

A senha deve ser um hash bcrypt. Você pode gerar usando:

```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('suasenha', 10);
console.log(hash);
```

### Fluxo de Trabalho

**1. Login no Sistema**

Acesse a página de login e entre com suas credenciais. Após autenticação bem-sucedida, você será redirecionado para o dashboard principal.

**2. Cadastro de Dados Reutilizáveis**

Antes de emitir certificados, cadastre as informações básicas:

- **Sessões** - Tipos de sessões realizadas (ex: Ordinária, Extraordinária)
- **Graus** - Graus maçônicos (ex: Aprendiz, Companheiro, Mestre)
- **Irmãos** - Cadastro dos irmãos com nome e e-mail opcional
- **Obreiros** - Obreiros da loja
- **Potências** - Potências maçônicas (ex: Grande Oriente do Brasil)

Acesse **Gerenciar Dados** no menu lateral e utilize as abas para cadastrar cada tipo de informação. Todos os cadastros suportam edição e exclusão.

**3. Emissão de Certificados**

Acesse **Emitir Certificado** no menu lateral e preencha o formulário:

- Selecione a **Sessão**
- Selecione o **Grau**
- Use o campo de busca por inicial para encontrar o **Irmão**
- Use o campo de busca por inicial para encontrar o **Obreiro**
- Use o campo de busca por inicial para encontrar a **Potência**
- Defina a **Data do Certificado**

Você pode visualizar uma prévia do certificado antes de gerar o PDF final. Ao clicar em "Gerar e Baixar Certificado", o sistema:

1. Gera o PDF com layout personalizado
2. Faz upload para o S3
3. Salva o registro no banco de dados
4. Inicia o download automático do PDF

**4. Consulta de Histórico**

Acesse **Histórico** no menu lateral para visualizar todos os certificados emitidos. A página oferece:

- Busca por nome do irmão, sessão ou grau
- Visualização de todos os dados do certificado
- Download do PDF a qualquer momento
- Interface preparada para envio por e-mail (funcionalidade futura)

**5. Gestão de Usuários (Apenas Administradores)**

Administradores têm acesso ao menu **Usuários**, onde podem:

- Criar novos usuários do sistema
- Definir se o usuário é administrador ou usuário comum
- Promover usuários a administrador ou remover privilégios
- Deletar usuários (exceto o próprio usuário logado)

## Estrutura do Banco de Dados

### Tabela: users

Armazena informações dos usuários do sistema com controle de acesso baseado em roles.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária |
| openId | VARCHAR(64) | Identificador OAuth (opcional) |
| name | TEXT | Nome do usuário |
| email | VARCHAR(320) | E-mail único |
| password | TEXT | Hash bcrypt da senha |
| loginMethod | VARCHAR(64) | Método de login (local/oauth) |
| role | ENUM | admin ou user |
| createdAt | TIMESTAMP | Data de criação |
| updatedAt | TIMESTAMP | Data de atualização |
| lastSignedIn | TIMESTAMP | Último login |

### Tabela: sessions

Armazena tipos de sessões maçônicas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária |
| name | VARCHAR(255) | Nome da sessão |
| description | TEXT | Descrição opcional |
| createdAt | TIMESTAMP | Data de criação |
| updatedAt | TIMESTAMP | Data de atualização |

### Tabela: degrees

Armazena graus maçônicos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária |
| name | VARCHAR(255) | Nome do grau |
| description | TEXT | Descrição opcional |
| createdAt | TIMESTAMP | Data de criação |
| updatedAt | TIMESTAMP | Data de atualização |

### Tabela: brothers

Armazena informações dos irmãos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária |
| name | VARCHAR(255) | Nome completo |
| email | VARCHAR(320) | E-mail opcional |
| initials | VARCHAR(10) | Inicial do nome |
| createdAt | TIMESTAMP | Data de criação |
| updatedAt | TIMESTAMP | Data de atualização |

### Tabela: workers

Armazena obreiros da loja.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária |
| name | VARCHAR(255) | Nome completo |
| initials | VARCHAR(10) | Inicial do nome |
| createdAt | TIMESTAMP | Data de criação |
| updatedAt | TIMESTAMP | Data de atualização |

### Tabela: powers

Armazena potências maçônicas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária |
| name | VARCHAR(255) | Nome da potência |
| initials | VARCHAR(10) | Inicial do nome |
| createdAt | TIMESTAMP | Data de criação |
| updatedAt | TIMESTAMP | Data de atualização |

### Tabela: certificates

Armazena certificados emitidos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária |
| sessionName | VARCHAR(255) | Nome da sessão |
| degreeName | VARCHAR(255) | Nome do grau |
| brotherName | VARCHAR(255) | Nome do irmão |
| brotherEmail | VARCHAR(320) | E-mail do irmão |
| workerName | VARCHAR(255) | Nome do obreiro |
| powerName | VARCHAR(255) | Nome da potência |
| certificateDate | TIMESTAMP | Data do certificado |
| pdfUrl | TEXT | URL do PDF no S3 |
| emailSent | INT | Flag de e-mail enviado |
| emailSentAt | TIMESTAMP | Data de envio |
| createdBy | INT | ID do usuário criador |
| createdAt | TIMESTAMP | Data de criação |
| updatedAt | TIMESTAMP | Data de atualização |

## API (tRPC Routers)

### auth

- `auth.me` - Retorna usuário autenticado
- `auth.login` - Autenticação com e-mail e senha
- `auth.logout` - Encerra sessão
- `auth.register` - Registro de novo usuário

### users (Admin apenas)

- `users.list` - Lista todos os usuários
- `users.create` - Cria novo usuário
- `users.updateRole` - Atualiza role do usuário
- `users.delete` - Deleta usuário

### sessions

- `sessions.list` - Lista sessões
- `sessions.create` - Cria sessão
- `sessions.update` - Atualiza sessão
- `sessions.delete` - Deleta sessão

### degrees

- `degrees.list` - Lista graus
- `degrees.create` - Cria grau
- `degrees.update` - Atualiza grau
- `degrees.delete` - Deleta grau

### brothers

- `brothers.list` - Lista irmãos (com filtro por inicial)
- `brothers.create` - Cria irmão
- `brothers.update` - Atualiza irmão
- `brothers.delete` - Deleta irmão

### workers

- `workers.list` - Lista obreiros (com filtro por inicial)
- `workers.create` - Cria obreiro
- `workers.update` - Atualiza obreiro
- `workers.delete` - Deleta obreiro

### powers

- `powers.list` - Lista potências (com filtro por inicial)
- `powers.create` - Cria potência
- `powers.update` - Atualiza potência
- `powers.delete` - Deleta potência

### certificates

- `certificates.list` - Lista certificados emitidos
- `certificates.generate` - Gera novo certificado em PDF
- `certificates.sendEmail` - Envia certificado por e-mail (preparado)

## Testes

O sistema inclui **21 testes automatizados** cobrindo as principais funcionalidades:

- **Autenticação** - Login, logout, verificação de usuário
- **CRUD de Dados** - Sessões, graus, irmãos, obreiros, potências
- **Gestão de Usuários** - Controle de acesso baseado em roles

### Executar Testes

```bash
pnpm test
```

### Estrutura dos Testes

```
server/
├── auth.test.ts          # Testes de autenticação
├── data.test.ts          # Testes de CRUD de dados
└── users.test.ts         # Testes de gestão de usuários
```

## Segurança

O sistema implementa diversas camadas de segurança:

**Autenticação Local** - Senhas armazenadas com hash bcrypt (salt rounds: 10). Sessões gerenciadas via JWT com cookies HttpOnly.

**Controle de Acesso** - Sistema de roles (admin/user) com verificação em todas as rotas protegidas. Procedures tRPC específicas para operações administrativas.

**Validação de Dados** - Validação de entrada com Zod em todas as rotas. Sanitização automática de dados pelo Drizzle ORM.

**Proteção CSRF** - Cookies com flags `SameSite=none` e `Secure=true` em produção.

**Armazenamento Seguro** - Certificados armazenados em bucket S3 privado. URLs pré-assinadas para acesso temporário.

## Funcionalidades Futuras

As seguintes funcionalidades estão preparadas para implementação futura:

- **Envio de E-mail** - Sistema de envio de certificados por e-mail com personalização de mensagem
- **Notificações** - Sistema de notificações para irmãos quando certificados são emitidos
- **Relatórios** - Geração de relatórios estatísticos sobre certificados emitidos
- **Assinatura Digital** - Integração com certificados digitais para assinatura eletrônica
- **Exportação em Lote** - Geração de múltiplos certificados simultaneamente

## Suporte e Contribuição

Para reportar bugs, solicitar funcionalidades ou contribuir com o projeto, entre em contato com a equipe de desenvolvimento da Loja Monte Sinai.

## Licença

Este projeto é de propriedade da **Augusta Respeitável Benfeitora e Excelsa Loja Simbólica Monte Sinai** e destina-se exclusivamente ao uso interno da instituição.

---

**Desenvolvido com** ❤️ **pela equipe de tecnologia da Loja Monte Sinai**

**Versão:** 1.0.0  
**Data de Lançamento:** Fevereiro de 2026
