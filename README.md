# Secomp - 2026.2 - Minicurso 
## Do “Preciso disso” ao Deploy: Como uma necessidade vira software?

## Galeria do Minicurso de Deploy

O frontend em [`apps/frontend`](./apps/frontend) apresenta os projetos publicados pelos
participantes. A API e a persistência MongoDB ficam em [`apps/backend`](./apps/backend), mantendo
o banco fora do bundle do navegador.

## Tutoriais de publicação

Consulte os guias antes de criar e publicar seu projeto:

- [Criar uma conta no Lovable](./tutorial/README-LOVABLE.md)
- [Criar uma conta na Vercel](./tutorial/README-VERCEL.md)
- [Integrar Lovable e Vercel](./tutorial/README-INTEGRACAO.md)

Depois de concluir o deploy, publique o link do seu projeto na [galeria da
SECOMP](https://secomp-2026-2.vercel.app/). Use uma URL pública e não inclua senhas, tokens ou
variáveis de ambiente no cadastro.

## Frontend

O frontend usa Next.js, React, Tailwind CSS e componentes reutilizáveis. O ambiente de testes
combina Vitest para testes de unidade e Playwright para testes end-to-end.

```bash
cd apps/frontend
bun install
bun run dev
```

Comandos úteis: `bun run lint`, `bun run typecheck`, `bun run test`, `bun run test:e2e`,
`bun run format:check` e `bun run build`.

## Backend

O serviço em [`apps/backend`](./apps/backend) é uma API NestJS com Fastify e MongoDB. Configure as
variáveis de [`apps/backend/.env.example`](./apps/backend/.env.example) e execute:

```bash
cd apps/backend
bun install
bun run dev
```

O endpoint inicial é `GET /health`. Pelo Nginx, ele fica disponível com o prefixo `/api`.

## Configuração

Copie `.env.example` para `.env` e preencha `MONGODB_URI`, `MONGODB_DB`, `ADMIN_PASSWORD`,
`SESSION_SECRET` (com pelo menos 32 caracteres), `AUDIT_SALT`, `COURSE_CODE` e
`ALLOWED_HOST_SUFFIXES`. Para desenvolvimento sem Atlas, use `USE_FAKE_DB=1`; nesse modo as
variáveis de conexão do banco são dispensadas.

No MongoDB Atlas, crie um cluster com replica set (Change Streams exigem replica set), crie um
usuário de banco com acesso ao banco configurado e permita a origem de desenvolvimento na lista de
rede. Os índices de projetos, auditoria e TTL de rate limit são criados de forma idempotente na
inicialização.

## Testes

Execute os comandos dentro de cada serviço:

```bash
cd apps/frontend
bun install
bun run lint
bun run typecheck
bun run test
bun run build
bun run test:e2e
```

Para o backend, use os mesmos comandos de lint, typecheck e test em `apps/backend`. Não use
`bun test`: o projeto usa o runner Vitest configurado nos scripts.

Em produção na Vercel, o SSE respeita o limite de duração da plataforma; o cliente reabre a
conexão e usa polling a cada 5 segundos quando necessário.

---
**Desenvolvido por**: Liga Acadêmica de Engenharia de Software (SEAL) - **SECOMP UFPE 2026**