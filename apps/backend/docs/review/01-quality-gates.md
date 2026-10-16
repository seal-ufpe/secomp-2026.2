# Backend quality-gate review

## Current status

The backend quality infrastructure is installed and the deterministic checks
pass for formatting, linting, type checking, unit execution, e2e execution,
and compilation. The coverage gate is intentionally not weakened: the current
run reports 66.08% lines, 64.63% statements, 64.13% functions, and 70.38%
branches against targets of 85%, 85%, 85%, and 80%.

The remaining coverage gap is concentrated in Mongo repository implementations,
the projects stream controller, and untested controller and service branches.

## E2E scenario matrix

| Endpoint            | Covered scenarios                                               | Not yet covered                                     |
| ------------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| `GET /health`       | healthy response and exact body                                 | database-degraded readiness                         |
| `POST /users`       | valid creation and sensitive-field projection                   | full validation matrix, duplicate and malformed IDs |
| `GET /users`        | persisted listing                                               | authorization and database failure                  |
| `POST /admin/login` | valid session, invalid password, cookie attributes              | expiry, tampering, rate limit                       |
| `POST /projects`    | valid creation, URL normalization, duplicate URL, metadata stub | concurrency, full validation matrix, authorization  |
| `GET /projects`     | persisted public projection                                     | cursor edge cases and injection payloads            |

## Mutation sanity

The required eight manual mutations have not yet been executed. They must be
performed before claiming the quality gate is complete:

| Rule                      | Mutation | Failing test |
| ------------------------- | -------- | ------------ |
| Host allowlist            | pending  | pending      |
| Course-code comparison    | pending  | pending      |
| Session expiry            | pending  | pending      |
| URL duplicate detection   | pending  | pending      |
| Sensitive hash projection | pending  | pending      |
| Rate limiting             | pending  | pending      |
| Admin guard               | pending  | pending      |
| Pagination                | pending  | pending      |

## Bugs

No new business-logic bug was confirmed by the passing tests. The coverage,
mutation, stability, and Docker checks are incomplete verification items rather
than silently ignored failures.
