# Sistema de Certificados Monte Sinai - Versão Estática

Sistema web para emissão e gerenciamento de certificados de presença da **Augusta Respeitável Benfeitora e Excelsa Loja Simbólica Monte Sinai**, hospedado gratuitamente no **GitHub Pages**.

## 🌐 Acesso Online

O sistema está disponível em: **https://baronccini89-max.github.io/teste.montesinai/**

## ✨ Características

- **Emissão de Certificados em PDF** - Geração automática com layout personalizado da Loja Monte Sinai
- **Cadastro de Dados Reutilizáveis** - Sessões, graus, irmãos, obreiros e potências
- **Histórico Completo** - Visualização e download de todos os certificados emitidos
- **Dados Locais** - Todos os dados são salvos no navegador (localStorage)
- **Sem Login** - Acesso direto sem autenticação
- **Sem Servidor** - Aplicação 100% estática, hospedada no GitHub Pages

## 🚀 Como Usar

### 1. Acessar o Sistema

Abra o link: **https://baronccini89-max.github.io/teste.montesinai/**

### 2. Cadastrar Dados (Primeira Vez)

Acesse **Gerenciar Dados** e cadastre:

- **Sessões** - Tipos de sessões (ex: Ordinária, Extraordinária)
- **Graus** - Graus maçônicos (ex: Aprendiz, Companheiro, Mestre)
- **Irmãos** - Nome e e-mail dos irmãos
- **Obreiros** - Nomes dos obreiros
- **Potências** - Potências maçônicas

### 3. Emitir Certificado

1. Clique em **Emitir Certificado**
2. Selecione os dados cadastrados
3. Escolha a data do certificado
4. Clique em **Visualizar** para ver a prévia
5. Clique em **Gerar e Baixar** para obter o PDF

### 4. Consultar Histórico

Acesse **Histórico** para:

- Visualizar todos os certificados emitidos
- Buscar por nome do irmão, sessão ou grau
- Baixar certificados novamente
- Deletar certificados (se necessário)

## 💾 Armazenamento de Dados

Todos os dados são salvos **localmente no navegador** usando `localStorage`:

- ✅ Os dados persistem entre sessões
- ✅ Cada navegador/dispositivo tem seus próprios dados
- ✅ Sem sincronização entre dispositivos
- ✅ Sem servidor externo

**Para fazer backup:** Use a função de exportação do navegador ou copie os dados manualmente.

## 🏗️ Tecnologias

| Tecnologia | Versão |
|-----------|---------|
| React | 19.2.1 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.1.14 |
| jsPDF | 2.5.1 |
| Vite | 7.1.7 |

## 📋 Estrutura do Projeto

```
monte-sinai-certificados/
├── src/
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.tsx
│   │   ├── CertificateGenerator.tsx
│   │   ├── CertificateHistory.tsx
│   │   └── DataManagement.tsx
│   ├── hooks/              # Custom hooks
│   │   └── useLocalStorage.ts
│   ├── utils/              # Utilitários
│   │   └── certificatePdf.ts
│   ├── types/              # Tipos TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── dist/                   # Build para produção
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔧 Instalação Local

Se quiser executar localmente:

```bash
# Clone o repositório
git clone https://github.com/baronccini89-max/teste.montesinai.git
cd teste.montesinai

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse em http://localhost:5173
```

## 🏗️ Build para Produção

```bash
# Gera arquivos otimizados em dist/
npm run build

# Visualiza a build localmente
npm preview
```

## 📝 Formato do Certificado

O certificado gerado em PDF contém:

- **Cabeçalho** - Nome da Loja e informações institucionais
- **Corpo** - Dados da sessão, grau, irmão, obreiro e potência
- **Data** - Data do certificado
- **Assinaturas** - Espaço para Venerável Mestre, Orador e Chanceler
- **Design** - Fundo bege com bordas decorativas

## 🔐 Segurança e Privacidade

- ✅ Nenhum dado é enviado para servidor
- ✅ Nenhuma coleta de dados pessoais
- ✅ Todos os dados ficam no seu navegador
- ✅ Sem cookies de rastreamento
- ✅ Sem análise de uso

## 🐛 Troubleshooting

### Os dados desapareceram

Se os dados sumirem, verifique:

1. Se você está no mesmo navegador/dispositivo
2. Se o localStorage não foi limpo (Configurações > Privacidade > Limpar dados)
3. Se o navegador está em modo anônimo (os dados não persistem)

### O PDF não está gerando

- Verifique se todos os campos estão preenchidos
- Tente usar um navegador diferente (Chrome, Firefox, Safari)
- Limpe o cache do navegador

### Como fazer backup dos dados

Infelizmente, não há função de export automática. Para fazer backup:

1. Abra o console do navegador (F12)
2. Digite: `localStorage`
3. Copie manualmente os dados

## 📧 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de tecnologia da Loja Monte Sinai.

## 📄 Licença

Este projeto é de propriedade da **Augusta Respeitável Benfeitora e Excelsa Loja Simbólica Monte Sinai**.

---

**Desenvolvido com** ❤️ **para a Loja Monte Sinai**

**Versão:** 1.0.0 (Estática)  
**Data de Lançamento:** Fevereiro de 2026  
**Hospedagem:** GitHub Pages
