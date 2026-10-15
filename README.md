# Secomp - 2026.2 - Minicurso 
## Do “Preciso disso” ao Deploy: Como uma necessidade vira software?

## Galeria do Minicurso de Deploy

O frontend em [`apps/frontend`](./apps/frontend) apresenta os projetos publicados pelos
participantes. A API e a persistência MongoDB ficam em [`apps/backend`](./apps/backend), mantendo
o banco fora do bundle do navegador.

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
