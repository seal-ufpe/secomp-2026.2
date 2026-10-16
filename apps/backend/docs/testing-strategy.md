# Backend testing strategy

## Pyramid and scope

Unit tests are colocated with source files and isolate one controller, service,
repository, function, or filter at a time. Dependencies are typed mocks so
failure propagation, validation branches, security decisions, and side effects
can be asserted deterministically.

E2E tests live under `test/` and use Nest's real `AppModule`, the shared
`configureApp` bootstrap, Supertest, and a real one-node MongoDB replica set
provided by `mongodb-memory-server`. E2E tests do not mock repositories. The
database is cleaned before each test; external metadata fetches are stubbed
because external network access is prohibited.

## Conventions

Test names follow `describe(unit)`, `describe(method)` where useful, and
`it('should <result> when <condition>')`. Each test follows Arrange, Act,
Assert and checks a concrete response or side effect. Tests do not use skipped,
focused, or disabled cases. The Vitest sequence is shuffled for unit tests and
has retry disabled.

Never run `bun test`: that invokes Bun's native test runner. Use the scripts
below, which invoke Vitest:

```sh
bun run test
bun run test:watch
bun run test:cov
bun run test:e2e
bun run test src/projects/project-service.spec.ts
bunx vitest run src/projects/project-service.spec.ts -t "normalizes"
```

For debugging, use `bunx vitest --inspect-brk`, run one file, and use
`--sequence.shuffle=false` only while diagnosing a failure. Do not commit
diagnostic flags or real secrets.

## E2E database

`test/global-setup.ts` starts `MongoMemoryReplSet` with one node and injects its
URI into the test process. If the MongoDB binary cannot be downloaded, setup
fails with the downloader error; the suite never silently falls back to fake
repositories. `test/helpers/db.ts` removes all documents between tests.

## Endpoint matrix

| Endpoint               | Success                                            | Validation/error                                                      | Auth/security                                                    | Persistence              |
| ---------------------- | -------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------ |
| `GET /health`          | 200 and exact body                                 | N/A                                                                   | public                                                           | none                     |
| `GET /users`           | 200 and newest list                                | database errors surface                                               | public                                                           | reads MongoDB            |
| `POST /users`          | 201 and generated id                               | malformed cases pending DTO adoption                                  | public; sensitive fields are not accepted by the structural body | writes MongoDB           |
| `GET /projects`        | list/filter/cursor unit coverage                   | invalid query cases pending controller DTO adoption                   | public; public projection removes edit hash                      | reads MongoDB            |
| `POST /projects`       | 201, normalized URL, edit token                    | duplicate, invalid URL, host, honeypot, course code, metadata failure | host allowlist, no token hash in output                          | writes project and audit |
| `GET /projects/stream` | stream wiring covered by controller implementation | hidden projects are deletion events                                   | edit hash is removed from events                                 | change emitter           |
| `POST /admin/login`    | 201 and HttpOnly/SameSite cookie                   | invalid password returns safe error                                   | timing-safe comparison and constant-delay failure                | session cookie           |

## Coverage

The configured target is 85% global lines, functions, and statements, 80%
global branches, and 90% for services, guards, pipes, and filters. The
latest local run reports 66.08% lines, 64.63% statements, 64.13% functions,
and 70.38% branches. Mongo repository paths and several controller branches
still need focused unit tests; the coverage gate therefore fails until those
tests are added.

## Verification status

| Gate                   | Result                                          |
| ---------------------- | ----------------------------------------------- |
| `bun run format:check` | Passes after the localized formatting pass      |
| `bun run lint`         | Passes with zero warnings                       |
| `bun run typecheck`    | Passes                                          |
| `bun run test`         | 25 unit tests pass                              |
| `bun run test:e2e`     | 6 tests pass across 4 files                     |
| `bun run build`        | Passes                                          |
| `bun run test:cov`     | Fails configured thresholds; see coverage above |

Mutation sanity checks for the eight critical rules, Docker image validation,
and repeated stability runs remain release-blocking follow-up work. No test is
marked skipped, todo, focused, or disabled.
