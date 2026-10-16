# syntax=docker/dockerfile:1
# ============================================================
# Dockerfile multi-stage para Frontend e React/NextJS
# Stack utilizada: Bun + React + Vitest
#
# Uso:
#   docker build --target dev   -t app:dev   .
#   docker build --target test  -t app:test  .
#   docker build --target e2e   -t app:e2e   .
#   docker build --target prod  -t app:prod  .
# ============================================================

# ---------- Base ----------
FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lockb* ./

# ---------- Dependencies (todas, incluindo dev) ----------
FROM base AS deps
RUN bun install --frozen-lockfile

# ---------- Development ----------
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["bun", "run", "dev", "--hostname", "0.0.0.0"]

# ---------- Test ----------
FROM deps AS test
COPY . .
CMD ["bun", "run", "test"]

# ---------- E2E (Playwright) ----------
FROM deps AS e2e
COPY . .
RUN bunx playwright install --with-deps chromium
EXPOSE 3000
CMD ["bun", "run", "test:e2e"]

# ---------- Build ----------
FROM deps AS build
COPY . .
RUN bun run build

# ---------- Production ----------
FROM oven/bun:1-slim AS prod
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
RUN groupadd --system app && useradd --system --gid app --no-create-home app
COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
USER app
EXPOSE 3000
CMD ["bun", "run", "server.js"]