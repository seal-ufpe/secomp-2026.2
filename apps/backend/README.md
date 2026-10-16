# Deploy Gallery backend

## Development

Run commands from `apps/backend` with Bun:

```sh
bun install --frozen-lockfile
bun run dev
```

Quality and test scripts:

| Script                 | Purpose                              |
| ---------------------- | ------------------------------------ |
| `bun run format`       | Format backend files                 |
| `bun run format:check` | Verify formatting                    |
| `bun run lint`         | Run strict ESLint with zero warnings |
| `bun run typecheck`    | Run strict TypeScript checking       |
| `bun run test`         | Run shuffled unit tests              |
| `bun run test:cov`     | Run unit tests and coverage          |
| `bun run test:e2e`     | Run MongoDB-backed e2e tests         |
| `bun run check`        | Run all local quality gates          |

Do not use `bun test`; it runs Bun's native runner instead of Vitest.

## Contribution flow

Keep changes scoped to the backend, add a behavior-focused test for every
change, run `bun run check`, and use Conventional Commits. E2E tests provision
their own MongoDB Memory Server and must not call external services.
