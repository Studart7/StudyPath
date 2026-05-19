# PLAN-studypath-mvp (UI-First Approach)

## Objetivo
Implementar a interface, fluxo de navegação e arquitetura do frontend do StudyPath primeiro (usando estado local / mockado no React para persistência temporária), permitindo que o usuário visualize e teste o aplicativo rodando localmente. Posteriormente, conectaremos os endpoints funcionais do backend.

## Perguntas em Aberto (Socratic Gate)
> [!IMPORTANT]
> **Ajuste de Estratégia (UI-First):**
> 1. **Navegação:** Para a navegação entre Dashboard, Áreas de Estudo e Workspaces, você prefere uma barra lateral (Sidebar) fixa estilo Notion/SaaS moderno, ou um menu superior (Top Nav)?
> 2. **Fluxo do Workspace:** No workspace de uma área, devemos agrupar Tarefas, Materiais e Sessões em abas (Tabs) ou exibir tudo na mesma tela dividida em colunas?

## Fases de Implementação (Foco em UI & Flow Primeiro)

### Fase 1: Arquitetura de Rotas e Navegação (Mock State)
- **Frontend:**
  - Adicionar uma Sidebar ou Top-Nav global para transição rápida entre telas.
  - Criar rotas:
    - `/` -> Dashboard (Métricas compiladas, Tarefa Recomendada, Atalhos)
    - `/areas` -> Gerenciamento de Áreas de Estudo (Listagem, Criar, Editar, Deletar)
    - `/areas/:id` -> Workspace da Área (Substituindo a rota estática `/workspace`)
- **Estado Global/Mock:**
  - Criar um `MockDataContext` ou usar localStorage no frontend para persistir Áreas, Tópicos, Tarefas, Materiais e Sessões localmente no navegador do usuário enquanto desenvolvemos a interface. Isso permite que tudo funcione (CRUD) visualmente de imediato.

### Fase 2: CRUD de Áreas e Tópicos na UI
- **Frontend:**
  - Implementar página `/areas` com cards minimalistas e elegantes para cada Área.
  - Implementar modal de criação/edição de Área (Nome, Descrição, Categoria, Objetivo).
  - Implementar a página de detalhes (`/areas/:id`) exibindo a área selecionada.
  - Adicionar na tela os Tópicos correspondentes àquela área com barra de progresso individual e CRUD de Tópicos.

### Fase 3: Gerenciamento de Tarefas e Materiais na UI
- **Frontend:**
  - Na página do Workspace (`/areas/:id`), adicionar a seção de Tarefas.
  - Criar modal para adicionar/editar tarefas (associando-a ao Tópico da área se desejado, definindo prioridade, dificuldade e data de entrega).
  - Implementar checkbox para concluir tarefas (registrando a data/hora de conclusão).
  - Adicionar seção de Materiais com ícones para os diferentes tipos (link, vídeo, livro, etc.) e modal de cadastro.

### Fase 4: Registro de Sessões de Estudo e Cronômetro
- **Frontend:**
  - Adicionar funcionalidade de iniciar uma Sessão de Estudo com cronômetro na tela (ou registro manual rápido).
  - Criar modal para salvar a sessão (definindo duração estudada, nível de foco de 1 a 5, dificuldade percebida de 1 a 5 e notas).
  - Listar as últimas sessões realizadas na área.

### Fase 5: Dashboard Dinâmico (Mock Algorithm)
- **Frontend:**
  - Atualizar o Dashboard para consumir o estado local/localStorage.
  - Implementar o algoritmo de sugestão de prioridade (Priority Suggester) rodando diretamente no frontend (calculando prazo, prioridade e dificuldade das tarefas ativas no estado).
  - Atualizar os cards de métricas (horas na semana, tarefas concluídas, áreas de estudo) conforme o usuário interage.

### Fase 6: Integração com o Backend Real
- **Backend:**
  - Implementar os controllers e rotas para as entidades: Areas, Topics, Tasks, Materials, Study Sessions.
- **Frontend:**
  - Substituir o estado mockado/localStorage por chamadas HTTP usando Axios para o backend.

## Verificação e Testes
- Testar a responsividade em telas mobile e desktop.
- Verificar o fluxo completo: Criar Área -> Criar Tópicos -> Cadastrar Tarefas e Materiais -> Iniciar Sessão de Estudo -> Ver Dashboard atualizar em tempo real com a sugestão de prioridade correta.
