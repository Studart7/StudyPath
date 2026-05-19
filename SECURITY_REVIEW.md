# Revisão de Segurança - StudyPath

Baseado nas diretrizes do `cc-skill-security-review`, realizei uma auditoria de segurança no repositório. Abaixo estão as descobertas categorizadas e recomendações de mitigação.

## 1. Gestão de Segredos (Secrets Management)
**Status:** ⚠️ Requer Atenção
*   **Positivo:** As chaves essenciais não estão "hardcoded" diretamente no repositório (com exceção do banco de desenvolvimento padrão SQLite, `dev.db`, o que é aceitável para um ambiente local de dev).
*   **Atenção:** É preciso assegurar que o arquivo `.env` conste no `.gitignore` e não seja "commitado" para o repositório público (especialmente a chave `JWT_SECRET`). 

## 2. Validação de Entrada (Input Validation)
**Status:** ⚠️ Oportunidade de Melhoria
*   **Positivo:** O backend valida a existência dos campos básicos nos Controladores (ex: `if (!email)`).
*   **Melhoria (P0):** O projeto não utiliza um esquema rigoroso de validação de dados (como a biblioteca Zod) para tipar e validar a entrada nas rotas, como `/api/auth/register` e criação de Áreas/Tópicos/Sessões. O uso do Zod garantiria que campos numéricos venham como número (evitando bugs), ou que e-mails tenham formato válido e limites de tamanho.

## 3. Prevenção de Injeção de SQL (SQL Injection)
**Status:** ✅ Excelente
*   **Positivo:** O sistema faz uso extensivo do Prisma ORM em todas as consultas (ex: `prisma.studyArea.findMany()`).
*   O Prisma automaticamente sanitiza e parametriza os dados, blindando o sistema contra ataques de SQL Injection no SQLite e qualquer outro DB suportado.

## 4. Autenticação e Autorização
**Status:** ❌ Vulnerável (XSS/CSRF)
*   **Atenção Crítica:** Atualmente, o frontend armazena o token JWT no `localStorage` após o login. Conforme a regra de ouro do *Security Review*, isso torna a credencial **altamente vulnerável a ataques XSS (Cross-Site Scripting)**. 
*   **Recomendação de Correção:** O backend deve ser alterado para definir o JWT dentro de um cookie seguro via `res.setHeader('Set-Cookie', 'token=...; HttpOnly; Secure; SameSite=Strict')`, impedindo sua leitura por JavaScript no cliente.
*   **Positivo (Autorização):** As rotas estão protegidas corretamente e o backend impõe segurança multitenant adequada, validando o dono da Area de Estudo via `user_id` em operações de GET, UPDATE e DELETE.

## 5. Rate Limiting
**Status:** ❌ Ausente
*   **Vulnerabilidade:** Não há limites implementados no servidor Node/Express para evitar força bruta em endpoints abertos como `/api/auth/login` e `/api/auth/register`.
*   **Recomendação:** Implementar a biblioteca `express-rate-limit` no `server.ts` ao menos para a rota de autenticação.

## 6. Exposição de Dados Sensíveis (Data Exposure)
**Status:** ✅ Aprovado
*   **Positivo:** A senha do usuário (hash) é criada e consumida apenas no back-end. A resposta JSON das requisições jamais devolve a `password_hash` ao cliente.
*   **Positivo:** Tratamento de erros seguro (usando `res.status(500).json({ error: 'Erro...' })`) em vez de devolver as *stack traces* e detalhes internos do servidor.

---

### Plano de Ação Recomendado (Próximos Passos):
1. [ ] Mudar a estratégia de token JWT de `localStorage` para **Cookies HttpOnly**.
2. [ ] Adicionar `express-rate-limit` no arquivo principal `server.ts`.
3. [ ] Integrar Zod (`npm install zod`) nos controllers de `authController.ts`.
