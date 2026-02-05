# Sistema de Certificados Monte Sinai - TODO

## Banco de Dados e Schema
- [x] Criar tabelas para sessões, graus, irmãos, obreiros e potências
- [x] Criar tabela de certificados emitidos
- [x] Adicionar campo de role (admin/user) na tabela users
- [x] Adicionar campos de busca por inicial nas tabelas

## Autenticação e Gestão de Usuários
- [x] Implementar sistema de login com autenticação local
- [x] Criar página de administração de usuários (apenas admin)
- [x] Implementar criação de novos usuários pelo administrador
- [x] Implementar edição e exclusão de usuários
- [x] Proteger rotas administrativas com verificação de role

## Cadastro e Gerenciamento de Dados
- [x] Criar interface para cadastrar sessões
- [x] Criar interface para cadastrar graus
- [x] Criar interface para cadastrar irmãos
- [x] Criar interface para cadastrar obreiros
- [x] Criar interface para cadastrar potências
- [x] Implementar busca por inicial em todos os cadastros
- [x] Implementar edição e exclusão de dados cadastrados

## Emissão de Certificados
- [x] Criar formulário de emissão com todos os campos necessários
- [x] Implementar seleção de dados cadastrados com busca por inicial
- [x] Criar visualização prévia do certificado
- [x] Implementar geração de PDF com layout personalizado Monte Sinai
- [x] Adicionar fundo bege e bordas decorativas ao PDF
- [x] Salvar certificados emitidos no banco de dados

## Histórico e Envio por E-mail
- [x] Criar página de histórico de certificados emitidos
- [x] Implementar filtros de busca no histórico
- [ ] Implementar funcionalidade de envio por e-mail (preparado, aguarda integração)
- [x] Adicionar campo de e-mail do destinatário
- [x] Permitir personalização da mensagem do e-mail
- [ ] Anexar PDF automaticamente ao e-mail (preparado, aguarda integração)

## Interface e Layout
- [x] Criar DashboardLayout com navegação lateral
- [x] Definir paleta de cores e tema visual
- [x] Criar página inicial (Home)
- [x] Implementar navegação entre páginas
- [x] Adicionar indicadores de loading e feedback visual

## Testes e Estabilização
- [x] Criar testes para autenticação
- [x] Criar testes para CRUD de dados
- [x] Criar testes para gestão de usuários
- [x] Executar todos os testes (21 testes passando)
- [x] Verificar funcionalidades manualmente

## Documentação e GitHub
- [x] Criar README com instruções de instalação
- [x] Documentar funcionalidades do sistema
- [x] Criar guia de publicação no GitHub
- [ ] Preparar instruções para publicação no GitHub
- [ ] Criar checkpoint final

## Publicação no GitHub
- [ ] Criar script de seed com usuário admin padrão
- [ ] Publicar repositório no GitHub (teste.montesinai)
- [ ] Atualizar README com instruções de setup inicial
