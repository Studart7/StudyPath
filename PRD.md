PRD — StudyPath
Produto: StudyPath
Tipo: Plataforma web de organização de estudos
Versão: 1.1
Contexto: Trabalho Prático — Métodos e Aplicações de IA
Status: Revisado
Sumário
Visão Geral
Público-alvo
Escopo do Produto
Funcionalidades
Requisitos Funcionais
Requisitos Não Funcionais
Arquitetura Proposta
Fluxo do Usuário
Modelo de Dados
Endpoints da API
Regras de Negócio
Critérios de Aceitação
Segurança
Riscos do Projeto
Uso de Agentes de IA no Desenvolvimento
Métricas de Sucesso
Organização da Entrega
1. Visão Geral
1.1 Nome do sistema
StudyPath

1.2 Resumo do produto
O StudyPath é uma plataforma web para organização de estudos voltada a qualquer pessoa que deseje estruturar melhor seu processo de aprendizado. O sistema atende a estudantes universitários, profissionais em desenvolvimento, candidatos a concursos, autodidatas, músicos, programadores e pessoas aprendendo idiomas — ou seja, qualquer usuário com uma rotina de estudos que precise de organização.
A proposta central é reunir em um único ambiente digital a criação de áreas de estudo, tópicos, tarefas, materiais e sessões de estudo. O sistema também oferece uma sugestão de prioridade, ajudando o usuário a decidir o que estudar primeiro com base em critérios objetivos: prazo, importância, dificuldade e progresso.

1.3 Objetivo
Criar uma aplicação web completa que permita ao usuário organizar, acompanhar e priorizar seus estudos de forma clara, personalizada e segura. Para isso, o sistema deve permitir que o usuário:

crie uma conta e faça login com segurança;
cadastre áreas de estudo e organize tópicos dentro de cada área;
registre tarefas com prazos e prioridades;
adicione materiais de apoio (links, vídeos, livros, PDFs etc.);
registre sessões de estudo com métricas de foco e dificuldade;
acompanhe seu progresso de forma visual;
visualize uma sugestão inteligente de prioridade para os próximos estudos.
1.4 Problema resolvido
Muitas pessoas estudam diferentes assuntos simultaneamente, mas acabam se perdendo entre anotações soltas, vídeos, PDFs, listas de tarefas, calendários e lembretes informais. Isso compromete a consistência, o acompanhamento do progresso e a tomada de decisão sobre o que estudar a seguir.
O problema central é a ausência de um ambiente organizado capaz de responder perguntas como:

O que estou estudando atualmente?
Quais tópicos ainda precisam de revisão?
Quais tarefas estão atrasadas?
Quais materiais pertencem a cada assunto?
Quanto tempo estudei nesta semana?
Qual deve ser minha próxima prioridade?
O StudyPath resolve esse problema ao organizar o processo de estudo em uma estrutura hierárquica simples e intuitiva:

Áreas de Estudo → Tópicos → Tarefas / Materiais / Sessões
1.5 Justificativa
O aprendizado contínuo tornou-se uma necessidade transversal: estudantes precisam organizar provas e trabalhos; profissionais precisam dominar novas ferramentas e certificações; autodidatas precisam manter consistência em projetos pessoais.
Apesar da existência de ferramentas genéricas de produtividade (Notion, Todoist, Trello), poucas são concebidas especificamente para o contexto de estudo. O StudyPath se diferencia por organizar todas as informações em torno do aprendizado, não apenas de tarefas isoladas, e por oferecer uma lógica de priorização voltada à realidade do estudante.
2. Público-alvo
2.1 Público principal
O StudyPath é direcionado a pessoas que estudam de forma recorrente e precisam organizar diferentes assuntos, metas e materiais:

estudantes universitários e de ensino médio;
candidatos a concursos públicos ou certificações;
profissionais aprendendo novas tecnologias;
programadores expandindo suas habilidades;
músicos organizando prática e repertório;
pessoas aprendendo idiomas;
autodidatas em geral.
2.2 Perfil do usuário
O usuário típico do StudyPath é alguém com múltiplas responsabilidades de estudo que deseja melhorar sua organização. Ele não precisa de uma ferramenta extremamente complexa, mas precisa de clareza sobre suas tarefas, prazos, materiais e progresso.

2.3 Necessidades do usuário
O usuário precisa:

separar assuntos diferentes em categorias organizadas;
registrar tarefas, prazos e prioridades;
acompanhar o que foi feito e o que ainda está pendente;
manter materiais de estudo agrupados por assunto;
registrar sessões de estudo para visualizar consistência;
identificar automaticamente o que deve estudar a seguir;
acessar seus dados com segurança.
3. Escopo do Produto
3.1 MVP — O que está incluído
A primeira versão do StudyPath entrega as funcionalidades essenciais para que o usuário consiga organizar seus estudos de ponta a ponta:

Cadastro e login de usuários
Dashboard com resumo geral
CRUD de áreas de estudo
CRUD de tópicos
CRUD de tarefas (com filtros)
CRUD de materiais de estudo
Registro de sessões de estudo
Visualização de progresso
Sugestão automática de prioridade
Controle de acesso e isolamento de dados por usuário
3.2 Fora do escopo — Versões futuras
As funcionalidades abaixo não fazem parte do MVP, mas podem ser implementadas em versões futuras:

Aplicativo mobile nativo
Notificações push e lembretes automáticos por e-mail
Integração com Google Calendar
Upload real de arquivos (PDFs, imagens)
Chat com IA generativa e geração automática de planos de estudo
Modo Pomodoro e flashcards com revisão espaçada
Estudo em grupo, ranking social e gamificação
Integração com plataformas externas de ensino (Udemy, Coursera etc.)
Metas semanais e relatórios avançados de desempenho
4. Funcionalidades
4.1 Autenticação de usuário
O sistema deve permitir que o usuário crie uma conta, faça login e acesse apenas os seus próprios dados.
Funcionalidades:

Cadastro com nome, e-mail e senha
Login com e-mail e senha
Logout
Proteção de rotas autenticadas
Armazenamento seguro de senha (hash)
Associação de todos os dados ao usuário autenticado
4.2 Dashboard
O dashboard apresenta uma visão geral da rotina de estudos do usuário. Informações exibidas:
InformaçãoDescriçãoTotal de áreas de estudoQuantidade de áreas cadastradasTarefas pendentesTotal de tarefas com status "pendente" ou "em andamento"Tarefas atrasadasTarefas com prazo vencido e não concluídasTarefas concluídasTotal de tarefas com status "concluída"Horas estudadas na semanaSoma das sessões registradas nos últimos 7 diasPróximas tarefasTarefas com prazo mais próximoSugestão de prioridadeTarefa recomendada com justificativa4.3 Áreas de estudo
O usuário cria áreas de estudo para separar seus diferentes objetivos de aprendizado. Exemplos: Inglês, Programação, Violão, Matemática, Certificação AWS.
Campos de uma área de estudo:
CampoTipoObrigatórioNomeTexto curtoSimDescriçãoTexto longoNãoCategoriaTexto curtoNãoObjetivo principalTexto longoNãoStatusEnum (ativa / pausada / concluída)SimData de criaçãoTimestampAutomático4.4 Tópicos
Dentro de cada área de estudo, o usuário cadastra tópicos específicos. Exemplo: dentro de "Programação", os tópicos poderiam ser JavaScript, React, APIs REST, Banco de Dados e Testes.
Campos de um tópico:
CampoTipoObrigatórioNomeTexto curtoSimDescriçãoTexto longoNãoÁrea de estudoReferênciaSimNível de dificuldadeEnum (baixo / médio / alto)NãoProgresso estimadoInteiro (0–100)NãoStatusEnum (não iniciado / em andamento / concluído)SimData de criaçãoTimestampAutomático4.5 Tarefas
O usuário cadastra tarefas relacionadas a uma área de estudo e, opcionalmente, a um tópico. Exemplos: "Assistir aula sobre funções em JS", "Resolver lista de exercícios", "Praticar escalas no violão".
Campos de uma tarefa:
CampoTipoObrigatórioTítuloTexto curtoSimDescriçãoTexto longoNãoÁrea de estudoReferênciaSimTópico relacionadoReferênciaNãoPrazoDataNãoPrioridadeEnum (baixa / média / alta)NãoDificuldade percebidaEnum (baixa / média / alta)NãoStatusEnum (ver abaixo)SimData de conclusãoTimestampAutomáticoData de criaçãoTimestampAutomáticoStatus possíveis:

pendente — tarefa criada, ainda não iniciada
em andamento — tarefa iniciada
concluída — tarefa finalizada (registra data de conclusão)
cancelada — tarefa descartada
4.6 Materiais de estudo
O sistema permite cadastrar materiais de referência associados a uma área ou tópico.
Tipos de materiais aceitos: link, vídeo, livro, artigo, PDF, anotação, curso, outro.
Campos de um material:
CampoTipoObrigatórioTítuloTexto curtoSimTipoEnumSimURL ou referênciaTextoNãoDescriçãoTexto longoNãoÁrea de estudoReferênciaSimTópico associadoReferênciaNãoData de criaçãoTimestampAutomático4.7 Sessões de estudo
O usuário registra sessões de estudo para acompanhar sua consistência e gerar métricas no dashboard.
Campos de uma sessão:
CampoTipoObrigatórioÁrea de estudoReferênciaSimTópico estudadoReferênciaNãoDataDataSimDuração (minutos)Inteiro > 0SimNível de focoInteiro (1–5)NãoDificuldade percebidaInteiro (1–5)NãoObservaçõesTexto longoNão4.8 Sugestão de prioridade
O sistema calcula automaticamente uma recomendação de próximo estudo com base em uma pontuação por tarefa.
Critérios e pesos:
CritérioCondiçãoPontosAtrasoPrazo vencido e tarefa não concluída+5Prazo urgentePrazo em até 2 dias+4Prioridade altaPrioridade definida como "alta" pelo usuário+3Dificuldade altaDificuldade percebida como "alta"+2Em andamentoTarefa com status "em andamento"+1A tarefa com maior pontuação é exibida como recomendação principal no dashboard, acompanhada de uma justificativa textual gerada automaticamente.
Exemplo de justificativa:

"Priorize a tarefa 'Revisar APIs REST', pois ela possui prazo próximo, dificuldade alta e ainda está pendente."
Nota: Apenas tarefas com status pendente ou em andamento são consideradas no cálculo. Tarefas concluídas ou canceladas são ignoradas.
5. Requisitos Funcionais
IDRequisitoRF01O sistema deve permitir que novos usuários criem uma conta informando nome, e-mail e senha.RF02O sistema deve permitir que usuários cadastrados façam login com e-mail e senha.RF03O sistema deve permitir que usuários autenticados encerrem sua sessão (logout).RF04O sistema deve impedir acesso às páginas internas para usuários não autenticados.RF05O sistema deve permitir criar, visualizar, editar e excluir áreas de estudo.RF06O sistema deve permitir criar, visualizar, editar e excluir tópicos associados a uma área.RF07O sistema deve permitir criar, visualizar, editar e excluir tarefas associadas a uma área e, opcionalmente, a um tópico.RF08O sistema deve permitir alterar o status de uma tarefa entre: pendente, em andamento, concluída e cancelada.RF09O sistema deve permitir criar, visualizar, editar e excluir materiais de estudo.RF10O sistema deve permitir registrar sessões de estudo com data, duração, área, tópico e observações.RF11O sistema deve exibir um dashboard com resumo de áreas, tarefas e horas estudadas na semana.RF12O sistema deve calcular e exibir uma sugestão de próximo estudo com base na lógica de pontuação definida.RF13O sistema deve permitir filtrar tarefas por área de estudo, status, prioridade e prazo.RF14O sistema deve garantir que cada usuário visualize e manipule apenas seus próprios dados.RF15O sistema deve registrar automaticamente a data de conclusão ao marcar uma tarefa como concluída.6. Requisitos Não Funcionais
IDRequisitoRNF01A interface deve ser responsiva e funcionar em desktop, tablet e dispositivos móveis.RNF02As senhas não devem ser armazenadas em texto puro — deve-se utilizar hash (ex: bcrypt).RNF03O sistema deve validar a identidade do usuário antes de permitir acesso a qualquer recurso interno.RNF04Os dados de um usuário não devem ser acessíveis por outros usuários.RNF05As operações comuns devem responder em menos de 2 segundos em condições normais de uso.RNF06A interface deve ser simples, clara e organizada, evitando sobrecarga visual por tela.RNF07O código deve ser organizado em camadas separadas: interface, lógica de negócio, rotas da API e acesso a dados.RNF08A arquitetura deve permitir evolução futura sem necessidade de reescrita (ex: adição de notificações, IA, calendário).RNF09O sistema deve validar entradas do usuário tanto no frontend quanto no backend.RNF10Chaves, tokens e credenciais devem ser armazenados em variáveis de ambiente, nunca hardcoded no código-fonte.RNF11O sistema deve funcionar nos principais navegadores modernos: Chrome, Edge, Firefox e Safari.RNF12O projeto deve possuir documentação técnica com instruções de execução, arquitetura, endpoints, modelo de banco e relatório de segurança.7. Arquitetura Proposta
7.1 Visão geral
O StudyPath é composto por três camadas independentes que se comunicam via HTTP:

┌─────────────┐        HTTP / JSON        ┌─────────────┐        Prisma ORM        ┌──────────────┐
│   Frontend  │ ◄────────────────────────► │  Backend    │ ◄──────────────────────► │   Database   │
│ React + Vite│                            │ Node/Express│                          │  PostgreSQL  │
└─────────────┘                            └─────────────┘                          └──────────────┘
7.2 Frontend
Responsável por apresentar a interface e consumir a API.
Stack recomendada:

React + Vite
TypeScript
Tailwind CSS
React Router (para navegação entre páginas)
Telas principais:

Login e cadastro
Dashboard
Listagem e detalhe de áreas de estudo
Listagem e gerenciamento de tarefas
Gerenciamento de materiais
Registro de sessões de estudo
Perfil / configurações do usuário
7.3 Backend
Responsável por fornecer a API REST, validar dados, aplicar regras de negócio e controlar acesso.
Stack recomendada:

Node.js + Express
TypeScript
Prisma ORM
JWT para autenticação
bcrypt para hash de senha
Alternativa possível (Python):

FastAPI + SQLAlchemy + JWT + PostgreSQL
Organização de camadas:

routes/ → controllers/ → services/ → repositories/ (via Prisma)
7.4 Banco de dados
Stack recomendada:

PostgreSQL (produção)
SQLite (desenvolvimento local, opcional)
Supabase (alternativa que simplifica autenticação e hospedagem)
7.5 Fluxo de comunicação entre camadas
1. Usuário interage com o frontend
2. Frontend envia requisição HTTP para a API (com token JWT no header)
3. API valida o token e extrai o user_id
4. API executa as regras de negócio
5. API consulta ou altera dados no banco (filtrando sempre por user_id)
6. Banco retorna os dados ao backend
7. Backend envia resposta JSON ao frontend
8. Frontend atualiza a interface
8. Fluxo do Usuário
8.1 Jornada principal
Acessa o sistema
     │
     ├── Novo usuário → Cadastro → Login → Dashboard
     └── Usuário existente → Login → Dashboard
                                          │
                              ┌──────────┴────────────┐
                              │                       │
                       Cria área de estudo    Visualiza sugestão
                              │                de prioridade
                       Adiciona tópicos
                              │
                    Cadastra tarefas e materiais
                              │
                    Registra sessões de estudo
                              │
                    Marca tarefas como concluídas
                              │
                    Dashboard reflete o progresso
8.2 Fluxo de cadastro
Usuário acessa a tela de cadastro.
Informa nome, e-mail e senha.
Sistema valida os campos (formato, campos obrigatórios).
Sistema verifica se o e-mail já está cadastrado.
Sistema armazena a senha com hash (bcrypt).
Sistema cria o usuário e redireciona para o dashboard.
8.3 Fluxo de login
Usuário informa e-mail e senha.
Sistema valida os dados.
Sistema verifica as credenciais no banco.
Se válidas: gera token JWT e redireciona para o dashboard.
Se inválidas: exibe mensagem de erro genérica (sem revelar qual campo está errado).
8.4 Fluxo de criação de área de estudo
Usuário acessa a página de áreas.
Clica em "Nova área de estudo".
Preenche nome, descrição, categoria e objetivo.
Sistema valida e salva a área associada ao user_id autenticado.
A nova área aparece imediatamente na listagem.
8.5 Fluxo de criação de tarefa
Usuário acessa uma área de estudo.
Clica em "Nova tarefa".
Informa título, descrição, prazo, prioridade e dificuldade.
Opcionalmente associa a tarefa a um tópico.
Sistema valida e salva a tarefa.
A tarefa aparece na listagem e, se relevante, no dashboard.
8.6 Fluxo de sugestão de prioridade
Sistema consulta todas as tarefas com status pendente ou em andamento.
Para cada tarefa, calcula a pontuação conforme os critérios definidos na seção 4.8.
Seleciona a tarefa com maior pontuação.
Exibe a recomendação no dashboard com justificativa automática.
9. Modelo de Dados
9.1 Diagrama de entidades
users
  └──< study_areas
          └──< topics
          └──< tasks (topic_id opcional)
          └──< materials (topic_id opcional)
          └──< study_sessions (topic_id opcional)
9.2 Tabela: users
CampoTipoDescriçãoidUUID (PK)Identificador úniconameVARCHAR(100)Nome do usuárioemailVARCHAR(255)E-mail únicopassword_hashVARCHAR(255)Senha com hash bcryptcreated_atTIMESTAMPData de criaçãoupdated_atTIMESTAMPData de atualização9.3 Tabela: study_areas
CampoTipoDescriçãoidUUID (PK)Identificador únicouser_idUUID (FK → users)Dono da áreanameVARCHAR(100)Nome da áreadescriptionTEXTDescriçãocategoryVARCHAR(100)CategoriagoalTEXTObjetivo principalstatusVARCHAR(20)ativa / pausada / concluídacreated_atTIMESTAMPData de criaçãoupdated_atTIMESTAMPData de atualização9.4 Tabela: topics
CampoTipoDescriçãoidUUID (PK)Identificador únicouser_idUUID (FK → users)Dono do tópicostudy_area_idUUID (FK → study_areas)Área relacionadanameVARCHAR(100)Nome do tópicodescriptionTEXTDescriçãodifficultyVARCHAR(20)baixo / médio / altoprogressINTEGERProgresso de 0 a 100statusVARCHAR(30)não iniciado / em andamento / concluídocreated_atTIMESTAMPData de criaçãoupdated_atTIMESTAMPData de atualização9.5 Tabela: tasks
CampoTipoDescriçãoidUUID (PK)Identificador únicouser_idUUID (FK → users)Dono da tarefastudy_area_idUUID (FK → study_areas)Área relacionadatopic_idUUID (FK → topics)Tópico relacionado (opcional)titleVARCHAR(200)Título da tarefadescriptionTEXTDescriçãodue_dateDATEPrazopriorityVARCHAR(20)baixa / média / altadifficultyVARCHAR(20)baixa / média / altastatusVARCHAR(20)pendente / em andamento / concluída / canceladacompleted_atTIMESTAMPData de conclusão (preenchida automaticamente)created_atTIMESTAMPData de criaçãoupdated_atTIMESTAMPData de atualização9.6 Tabela: materials
CampoTipoDescriçãoidUUID (PK)Identificador únicouser_idUUID (FK → users)Dono do materialstudy_area_idUUID (FK → study_areas)Área relacionadatopic_idUUID (FK → topics)Tópico relacionado (opcional)titleVARCHAR(200)Título do materialtypeVARCHAR(20)link / vídeo / livro / artigo / PDF / anotação / curso / outrourlTEXTLink ou referênciadescriptionTEXTDescriçãocreated_atTIMESTAMPData de criaçãoupdated_atTIMESTAMPData de atualização9.7 Tabela: study_sessions
CampoTipoDescriçãoidUUID (PK)Identificador únicouser_idUUID (FK → users)Dono da sessãostudy_area_idUUID (FK → study_areas)Área estudadatopic_idUUID (FK → topics)Tópico estudado (opcional)studied_atDATEData da sessãoduration_minutesINTEGERDuração em minutos (> 0)focus_levelINTEGERNível de foco: 1 a 5perceived_difficultyINTEGERDificuldade percebida: 1 a 5notesTEXTObservações livrescreated_atTIMESTAMPData de criaçãoupdated_atTIMESTAMPData de atualização9.8 Relacionamentos
Um usuário possui várias áreas de estudo, tópicos, tarefas, materiais e sessões.
Uma área de estudo pertence a um usuário e pode conter vários tópicos, tarefas, materiais e sessões.
Um tópico pertence a uma área de estudo. Tarefas, materiais e sessões podem, opcionalmente, estar associados a um tópico.
A exclusão de uma área de estudo só é permitida após a remoção de todos os registros vinculados (veja RN06).
10. Endpoints da API
Todas as rotas abaixo (exceto autenticação) exigem o header Authorization: Bearer <token>.
10.1 Autenticação
POST /auth/register
Cria um novo usuário.
Payload:

{
  "name": "Daniel",
  "email": "daniel@email.com",
  "password": "senha123"
}
Resposta (201):

{
  "message": "User created successfully"
}
POST /auth/login
Autentica um usuário e retorna o token JWT.
Payload:

{
  "email": "daniel@email.com",
  "password": "senha123"
}
Resposta (200):

{
  "token": "jwt_token_aqui",
  "user": {
    "id": "uuid",
    "name": "Daniel",
    "email": "daniel@email.com"
  }
}
Resposta em caso de erro (401):

{
  "error": "Credenciais inválidas"
}
Nota de segurança: A mensagem de erro deve ser genérica — nunca indicar se o e-mail não existe ou se a senha está errada.
10.2 Dashboard
GET /dashboard/summary
Retorna o resumo geral do usuário autenticado.
Resposta (200):

{
  "totalStudyAreas": 4,
  "pendingTasks": 8,
  "overdueTasks": 2,
  "completedTasks": 15,
  "weeklyStudyMinutes": 420,
  "nextTasks": [
    { "id": "uuid", "title": "Estudar React Hooks", "due_date": "2025-08-10" }
  ],
  "recommendedTask": {
    "id": "uuid",
    "title": "Revisar APIs REST",
    "reason": "Prazo próximo, dificuldade alta e tarefa pendente"
  }
}
10.3 Áreas de estudo
MétodoRotaDescriçãoGET/study-areasLista todas as áreas do usuárioPOST/study-areasCria uma nova áreaGET/study-areas/:idRetorna os detalhes de uma áreaPUT/study-areas/:idAtualiza uma áreaDELETE/study-areas/:idRemove uma área (somente se sem registros vinculados)10.4 Tópicos
MétodoRotaDescriçãoGET/topics?study_area_id=Lista tópicos (com filtro por área)POST/topicsCria um novo tópicoGET/topics/:idRetorna os detalhes de um tópicoPUT/topics/:idAtualiza um tópicoDELETE/topics/:idRemove um tópico10.5 Tarefas
MétodoRotaDescriçãoGET/tasksLista tarefas com filtros opcionaisPOST/tasksCria uma nova tarefaGET/tasks/:idRetorna os detalhes de uma tarefaPUT/tasks/:idAtualiza uma tarefaPATCH/tasks/:id/statusAtualiza somente o status da tarefaDELETE/tasks/:idRemove uma tarefaFiltros disponíveis para GET /tasks:

status — ex: ?status=pendente
priority — ex: ?priority=alta
study_area_id — ex: ?study_area_id=uuid
due_date — ex: ?due_date=2025-08-15
10.6 Materiais
MétodoRotaDescriçãoGET/materialsLista materiais (filtrável por área ou tópico)POST/materialsCria um novo materialGET/materials/:idRetorna os detalhes de um materialPUT/materials/:idAtualiza um materialDELETE/materials/:idRemove um material10.7 Sessões de estudo
MétodoRotaDescriçãoGET/study-sessionsLista sessões do usuárioPOST/study-sessionsRegistra uma nova sessãoGET/study-sessions/:idRetorna os detalhes de uma sessãoPUT/study-sessions/:idAtualiza uma sessãoDELETE/study-sessions/:idRemove uma sessão11. Regras de Negócio
IDRegraRN01Todo registro criado deve estar associado a um user_id. Um usuário não pode visualizar, editar ou excluir dados de outro usuário.RN02Não é permitido cadastrar mais de uma conta com o mesmo e-mail.RN03Ao marcar uma tarefa como concluída, o sistema deve preencher automaticamente o campo completed_at com a data/hora atual.RN04Uma tarefa é considerada atrasada quando due_date < data_atual e status != 'concluída'.RN05Apenas tarefas com status pendente ou em andamento são consideradas no cálculo da sugestão de prioridade.RN06A exclusão de uma área de estudo só é permitida se não houver tópicos, tarefas, materiais ou sessões vinculados a ela. O sistema deve retornar mensagem orientando o usuário a remover os registros vinculados antes.RN07Uma sessão de estudo deve ter duration_minutes > 0.RN08O progresso de um tópico deve ser um valor inteiro entre 0 e 100.RN09O campo password_hash nunca deve ser retornado em nenhuma resposta da API.RN10Em caso de empate na pontuação da sugestão de prioridade, deve-se preferir a tarefa com due_date mais próximo. Se ainda houver empate, preferir a de criação mais recente.12. Critérios de Aceitação
CA01 — Cadastro de usuário
Dado que um visitante acessa a tela de cadastro,
quando ele preenche nome, e-mail válido e senha e confirma o cadastro,
então o sistema deve criar a conta, armazenar a senha com hash e redirecionar o usuário para o dashboard.
Dado que um visitante tenta se cadastrar com um e-mail já existente,
então o sistema deve exibir mensagem de erro sem criar a conta.
CA02 — Login e autenticação
Dado que um usuário cadastrado acessa a tela de login,
quando informa e-mail e senha corretos,
então o sistema deve gerar um token JWT e redirecionar para o dashboard.
Dado que um usuário informa credenciais incorretas,
então o sistema deve exibir mensagem de erro genérica sem revelar qual campo está errado.
CA03 — Proteção de rotas
Dado que um usuário não autenticado tenta acessar qualquer página interna,
então o sistema deve redirecioná-lo para a tela de login.
CA04 — Isolamento de dados
Dado que dois usuários distintos estão autenticados,
quando cada um acessa suas áreas, tarefas ou materiais,
então cada usuário deve visualizar apenas seus próprios registros, sem acesso aos dados do outro.
CA05 — Criação de área de estudo
Dado que o usuário está autenticado,
quando cria uma área com nome válido,
então a área deve aparecer na listagem e estar associada ao seu user_id.
CA06 — Criação e conclusão de tarefa
Dado que o usuário possui uma área cadastrada,
quando cria uma tarefa associada a essa área,
então a tarefa deve aparecer na listagem e no dashboard.
Dado que o usuário possui uma tarefa com status pendente,
quando altera o status para concluída,
então o campo completed_at deve ser preenchido automaticamente com a data/hora atual.
CA07 — Registro de sessão de estudo
Dado que o usuário está autenticado,
quando registra uma sessão com duração maior que zero,
então a sessão é armazenada e considerada no cálculo de horas estudadas na semana no dashboard.
CA08 — Sugestão de prioridade
Dado que o usuário possui tarefas com status pendente ou em andamento,
quando acessa o dashboard,
então o sistema deve exibir a tarefa com maior pontuação como recomendação, acompanhada de uma justificativa textual.
CA09 — Filtros de tarefas
Dado que o usuário possui tarefas com diferentes status e prioridades,
quando aplica um filtro (ex: status=pendente ou priority=alta),
então apenas as tarefas correspondentes ao filtro devem ser retornadas.
13. Segurança
13.1 Riscos identificados e mitigações
SQL Injection
Risco: usuários mal-intencionados enviam comandos SQL por campos de entrada.
Mitigação: uso de ORM (Prisma) com queries parametrizadas; validação de entradas no backend; proibição de concatenação manual de SQL.
Armazenamento inseguro de senha
Risco: vazamento de senhas em texto puro em caso de comprometimento do banco.
Mitigação: armazenar apenas o hash da senha usando bcrypt; nunca retornar password_hash nas respostas da API.
Falha de autenticação
Risco: acesso não autorizado a páginas internas.
Mitigação: proteção de rotas no frontend; validação do token JWT no middleware do backend; tokens com tempo de expiração definido.
Falha de autorização (IDOR)
Risco: um usuário acessa dados de outro alterando IDs na URL ou no payload.
Mitigação: todas as consultas ao banco devem incluir o user_id extraído do token JWT, nunca o ID enviado pelo cliente; verificar propriedade do recurso antes de editar ou excluir.
Exposição de endpoints
Risco: rotas privadas ficam acessíveis sem autenticação.
Mitigação: aplicar middleware de autenticação a todas as rotas privadas; separar explicitamente rotas públicas (/auth/*) de rotas privadas.
Vazamento de dados na API
Risco: respostas da API expõem campos sensíveis.
Mitigação: nunca incluir password_hash em respostas; retornar apenas os campos necessários para cada operação; evitar logs com informações sensíveis.
Exposição de variáveis sensíveis
Risco: credenciais e chaves expostas no repositório.
Mitigação: armazenar segredos em arquivo .env; adicionar .env ao .gitignore; documentar variáveis necessárias em .env.example com valores fictícios.
13.2 Checklist de segurança
[ ] Senhas armazenadas com hash (bcrypt)
[ ] password_hash nunca retornado pela API
[ ] Rotas privadas protegidas por middleware de autenticação
[ ] Tokens JWT validados no backend e com expiração configurada
[ ] Todas as queries filtradas por user_id do token (não do cliente)
[ ] Entradas validadas no backend (independente do frontend)
[ ] ORM utilizado para todas as queries ao banco
[ ] Variáveis sensíveis armazenadas em .env e fora do controle de versão
[ ] Mensagens de erro genéricas (sem expor detalhes internos)
[ ] Testes manuais de acesso indevido por ID (IDOR)
14. Riscos do Projeto
14.1 Riscos técnicos
RiscoProbabilidadeImpactoMitigaçãoEscopo crescendo além do necessárioAltaAltoManter foco no MVP; adiar funcionalidades avançadasProblemas de integração frontend/backendMédiaAltoDefinir e documentar endpoints antes da implementação; testar a API separadamenteModelagem de dados inconsistenteMédiaAltoCriar o modelo de dados antes do desenvolvimento; usar chaves estrangeirasVulnerabilidade de autorização (IDOR)MédiaAltoSempre filtrar queries por user_id; realizar testes de acesso indevido14.2 Riscos operacionais
RiscoProbabilidadeImpactoMitigaçãoFalta de tempo para implementar tudoAltaMédioPriorizar autenticação, áreas, tarefas e dashboard; simplificar materiais e sessões se necessárioInterface visualmente inconsistenteMédiaBaixoCriar componentes reutilizáveis; definir padrão visual desde o inícioCredenciais expostas no repositórioBaixaAltoUsar .env e .gitignore desde o início do projeto15. Uso de Agentes de IA no Desenvolvimento
O desenvolvimento do StudyPath será auxiliado por agentes de IA em diferentes etapas:
AgenteResponsabilidadesBrainstormDefinição do problema, público-alvo, funcionalidades, diferencial e escopo do MVPFrontendEstrutura inicial das telas, componentes reutilizáveis, layout responsivo, UXBackendEstrutura da API, endpoints, controllers, services, validações e integração com bancoSecurityRevisão de autenticação, análise de riscos, verificação de controle de acesso, relatório de segurançaDocumentationGeração do README, documentação de endpoints, arquitetura, modelo de banco e evidências de entrega16. Métricas de Sucesso
O MVP será considerado bem-sucedido quando:

[ ] Usuário consegue criar conta e fazer login
[ ] Usuário consegue criar e gerenciar áreas de estudo
[ ] Usuário consegue cadastrar tópicos dentro de cada área
[ ] Usuário consegue criar tarefas, alterar status e concluí-las
[ ] Usuário consegue registrar sessões de estudo
[ ] Dashboard exibe corretamente as métricas de progresso
[ ] Sugestão de prioridade é calculada e exibida corretamente
[ ] Dados persistem no banco após recarregamento da página
[ ] Usuário não consegue acessar dados de outros usuários
[ ] Documentação técnica está completa e clara
17. Organização da Entrega
17.1 Estrutura de arquivos esperada
Projeto/
│
├── PRD.pdf
├── README.md
├── arquitetura.pdf
├── api_documentation.pdf
├── database_model.pdf
├── security_report.pdf
└── evidencias/
    ├── brainstorm/
    ├── frontend/
    ├── backend/
    ├── security/
    └── documentation/
17.2 Documentos derivados deste PRD
DocumentoConteúdoREADME.mdVisão geral, instruções de instalação e execução, variáveis de ambiente necessáriasapi_documentation.pdfTodos os endpoints com exemplos de payload e respostaarquitetura.pdfDiagrama de arquitetura, tecnologias e fluxo de comunicaçãodatabase_model.pdfDiagrama ER, tabelas, campos, tipos e relacionamentossecurity_report.pdfRiscos identificados, mitigações implementadas e checklist de segurançaevidencias/Prints ou logs de interação com os agentes de IA em cada etapaApêndice — Glossário
TermoDefiniçãoÁrea de estudoCategoria principal que agrupa tópicos, tarefas, materiais e sessões relacionados a um objetivo de aprendizadoTópicoSubdivisão de uma área de estudo, representando um assunto específico dentro do objetivo maiorTarefaAção concreta e rastreável que o usuário deve executar para avançar em seus estudosMaterialRecurso externo ou interno (link, livro, PDF etc.) associado a uma área ou tópicoSessão de estudoRegistro de um período de tempo dedicado ao estudo, com métricas de duração e focoSugestão de prioridadeRecomendação automática do sistema sobre qual tarefa o usuário deve estudar a seguirMVPMinimum Viable Product — versão mínima viável do produto com funcionalidades essenciaisIDORInsecure Direct Object Reference — vulnerabilidade em que um usuário acessa recursos de outros por manipulação de IDsJWTJSON Web Token — padrão para transmissão segura de informações de autenticação