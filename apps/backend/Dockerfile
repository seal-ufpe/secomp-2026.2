# syntax=docker/dockerfile:1
# ============================================================
# Dockerfile multi-stage para apps
# Stack utilizada: Bun + Fastify + Drizzle + Vitest
#
# Uso:
#   docker build --target dev        -t app:dev        .
#   docker build --target typecheck  -t app:typecheck  .
#   docker build --target test       -t app:test       .
#   docker build --target prod       -t app:prod       .
# ============================================================

# ---------- Base ----------
FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lock ./

# ---------- Dependencies (todas, incluindo dev) ----------
FROM base AS deps
RUN bun install --frozen-lockfile

# ---------- Development ----------
FROM deps AS dev
COPY . .
EXPOSE 4000
CMD ["bun", "run", "dev"]

# ----------- Typecheck -----------
FROM deps AS typecheck
COPY . .
CMD ["bun", "run", "typecheck"]

# ---------- Test ----------
FROM deps AS test
COPY . .
CMD ["bun", "run", "test"]

# ---------- Build ----------
FROM deps AS build
COPY . .
RUN bun run build

# ---------- Production ----------
FROM oven/bun:1-slim AS prod
WORKDIR /app
ENV NODE_ENV=production PORT=4000

RUN groupadd --system app && useradd --system --gid app --no-create-home app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/dist ./dist
COPY --chown=app:app package.json ./

USER app
EXPOSE 4000
CMD ["bun", "run", "start"]
