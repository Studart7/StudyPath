# StudyPath

StudyPath é uma plataforma web completa para organização e gestão de estudos. Ela permite que estudantes criem áreas de estudo, definam metas, acompanhem o progresso de tópicos e tarefas, centralizem seus materiais de apoio e utilizem um cronômetro para registrar o histórico de sessões e manter o foco.

## Tecnologias Utilizadas

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS (com Design System customizado para temas Light/Dark)
- React Router DOM
- Axios
- Lucide React (Ícones)

**Backend:**
- Node.js com Express
- TypeScript
- SQLite (Banco de dados de desenvolvimento)
- Prisma ORM
- JSON Web Token (JWT) e Bcrypt (Autenticação e Segurança)

## Recursos

* **Autenticação:** Login e Cadastro completos com senhas criptografadas.
* **Modo Escuro / Claro:** Suporte nativo ao tema do sistema ou controle manual com persistência via `localStorage`.
* **Áreas de Estudo:** Crie macro-objetivos de estudo, como "Programação" ou "Música", e acompanhe as métricas de tempo e tarefas concluídas.
* **Gerenciamento de Tópicos e Tarefas:** Subdivida as áreas em tópicos, com indicadores visuais de dificuldade e barras de progresso; crie tarefas com prazos e prioridades.
* **Cronômetro de Sessões de Estudo:** Registre facilmente o tempo de foco usando o cronômetro embutido. Ao concluir, classifique seu nível de foco, esforço percebido e escreva notas detalhadas da sessão.
* **Repositório de Materiais:** Salve e classifique links, vídeos e PDFs relevantes para seus estudos.

## Estrutura do Projeto

O projeto adota uma arquitetura *Monorepo* simples (SPA servido juntamente com o backend durante o desenvolvimento):

* `/src`: Todo o código da interface de usuário React.
* `/backend`: O código da API Express, controladores e rotas.
* `/prisma`: O Schema do banco de dados e as migrações.

## Como Executar Localmente

### 1. Pré-requisitos
- Node.js v18+
- npm (ou pnpm, yarn)

### 2. Instalação e Configuração

Clone o repositório e instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo (mude o secret em produção):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-muito-segura-aqui"
```

### 3. Banco de Dados

Gere o cliente Prisma e rode as migrações para criar o arquivo SQLite local:
```bash
npx prisma generate
npx prisma db push
```
*Observação: em produção, você usará `npx prisma migrate deploy` com um banco de dados hospedado (como PostgreSQL).*

### 4. Executando em Desenvolvimento

Inicie o servidor de desenvolvimento. O Vite servirá o React e a API Express simultaneamente:

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Hospedagem e Deploy

Este projeto está configurado com um fluxo de CI/CD para **GitHub Pages** (veja `.github/workflows/deploy.yml`), porém, o GitHub Pages só hospeda a camada estática (Frontend React). O backend Express e o banco de dados SQLite precisam ser hospedados separadamente em serviços como Heroku, Render ou Railway. O deploy no Pages serve primordialmente como *demo* estática sem o servidor em funcionamento.
