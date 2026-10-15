# Backend quality baseline

Date: 2026-10-15

## Scope and initial state

The backend is a NestJS 11 application using the Fastify adapter and the MongoDB
driver directly. The application has no ORM, Mongoose models, DTO classes, guards,
pipes, exception filters, interceptors, or e2e suite at baseline.

Initial commands were run from `apps/backend`:

| Command | Result |
| --- | --- |
| `bun install --frozen-lockfile` | Passed; lockfile was already current |
| `bun run build` | Passed |
| `bun run lint` | Passed; no warnings |
| `bun run typecheck` | Passed |
| `bun run test` | Passed; 7 files, 13 tests |
| Coverage | Not configured |
| E2E | Not configured |

The editor marker reported for `tsconfig.json` could not be reproduced by the
TypeScript CLI. The current configuration already has `strict: true`, and the
pre-existing removal of `baseUrl` is preserved. The strict compiler options
requested by the quality work will be added in Phase 1.

## Application wiring

`AppModule` imports the global `ConfigModule` and `DatabaseModule`, then wires
controllers for health, users, projects, the project stream, and admin login.
Project repositories are selected by `getRepositories`: `USE_FAKE_DB=1` uses the
in-memory repositories; otherwise a MongoDB client is created from
`MONGODB_URI` and `MONGODB_DB`. The MongoDB provider in `DatabaseModule` also
creates a direct `Db` provider for users.

### Modules and dependencies

| Module | Controllers | Services/providers | Dependencies |
| --- | --- | --- | --- |
| `health` | `HealthController` | none | none |
| `database` | none | `DATABASE` async MongoDB `Db` provider | `ConfigService`, `mongodb` |
| `users` | `UsersController` | `UsersService` | `DATABASE` |
| `projects` | `ProjectsController`, `ProjectsStreamController` | `ProjectService`; fake and Mongo repositories; metadata and validation functions | repository token, `mongodb`, `fetch`, RxJS |
| `admin` | `AdminController` | session creation and verification functions | Node crypto, environment variables |

The project repository interface also contains audit, settings, and rate-limit
repositories. At baseline they are implemented by fake and Mongo repositories,
but no controller currently exposes the latter operations.

## Route inventory

| Method | Path | Access | Input DTO/body/query | Possible status |
| --- | --- | --- | --- | --- |
| GET | `/health` | public | none | 200 |
| GET | `/users` | public | none | 200, 500 |
| POST | `/users` | public | `{ name, email }` structural type only | 201, 400/500 |
| GET | `/projects` | public | query `cursor`, `origin`, `q` | 200, 500 |
| POST | `/projects` | public | `Submission` structural type; validation is in service | 201, 200 with domain error, 500 |
| GET | `/projects/stream` | public | none | 200 SSE, 500 |
| POST | `/admin/login` | public | `{ password? }` | 201/200, 500 |

At baseline there is no global route prefix or API versioning, no global
`ValidationPipe`, no standard exception filter, and CORS is enabled directly in
`main.ts`. Admin login returns an HttpOnly, Strict cookie on success, but no
guarded admin routes exist yet.

## Database strategy

The application uses the native `mongodb` package. Mongo repositories use a
`MongoClient` and collections for projects, audit logs, settings, and rate
limits; user operations use the global `Db` provider. Index creation is performed
when Mongo repositories are created. The fake repository implementation is
selected explicitly with `USE_FAKE_DB=1`.

E2E tests will use `mongodb-memory-server` with a one-node replica set when the
real Mongo path is exercised. The setup will fail explicitly if the Mongo binary
cannot be downloaded, rather than silently switching to fakes.

## Quality gaps to address

1. Formatting and strict compiler options are incomplete.
2. ESLint is only the recommended TypeScript configuration and is not type-aware.
3. Bootstrap configuration is not reusable by tests.
4. Environment variables are not schema-validated at startup.
5. No standard global error response exists.
6. Unit coverage is partial and no e2e tests or coverage thresholds exist.
7. CI does not run backend quality gates.
