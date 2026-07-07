# Phase 0 Research: SRMS Authentication and Restaurant Registration

## Decision 1: Keep auth schemas in `packages/validation` (not a new schemas package)

- Decision: Add `register` and `login` schemas under `packages/validation/src/auth` and export them from `@srms/validation/auth`.
- Rationale: Current constitution defines `packages/validation` as shared Zod home and disallows unnecessary package proliferation.
- Alternatives considered:
  - Create `packages/schemas`: rejected because it conflicts with current package ownership rules and increases cognitive overhead.
  - Keep schemas app-local in API/dashboard: rejected due to duplication risk.

## Decision 2: Keep role/auth constants in `packages/types` feature contracts

- Decision: Define role and auth-related reusable value types/const objects in `packages/types/src/auth` and related feature folders.
- Rationale: Constitution explicitly positions business enums/types in `packages/types` by feature.
- Alternatives considered:
  - Introduce `packages/constants`: rejected because constants package was intentionally removed and would reintroduce extra abstraction.
  - Duplicate role literals in frontend/backend: rejected due to contract drift risk.

## Decision 3: Use transactional registration flow (restaurant + user)

- Decision: Wrap registration persistence in a MongoDB session transaction so restaurant and user creation are atomic.
- Rationale: Prevents partial onboarding state and supports robust retry/error semantics.
- Alternatives considered:
  - Sequential non-transactional writes: rejected due to orphan risk.
  - Compensating rollback logic only: rejected as more error-prone than native transactions.

## Decision 4: Access + refresh token model with bcrypt password hashing

- Decision: Use bcrypt for password hashing and JWT access/refresh token pair for session handling.
- Rationale: Matches constitution security standards and requested feature behavior.
- Alternatives considered:
  - Access-token-only auth: rejected due to poor long-session UX/security tradeoffs.
  - Stateless refresh without rotation strategy: rejected due to weaker revocation posture.

## Decision 5: API middleware flow reuse via existing shared HTTP utilities

- Decision: Reuse existing `AppError`, `sendSuccess`/`sendError`, and shared middleware patterns for auth.
- Rationale: Keeps auth implementation aligned with existing API conventions and reduces new plumbing.
- Alternatives considered:
  - New auth-specific response/error wrappers: rejected due to duplicate abstractions.

## Decision 6: Dashboard auth state split (TanStack Query + Zustand)

- Decision: Use TanStack Query for auth API mutations/fetches and Zustand for client session/UI state.
- Rationale: Aligns with constitution state-ownership rule and keeps side effects predictable.
- Alternatives considered:
  - Zustand-only auth state/data fetching: rejected for cache/fetch lifecycle complexity.
  - Query-only global UI/session state: rejected for ergonomic UI state management concerns.

## Decision 7: Preserve tsx-first API runtime and alias imports

- Decision: Implement auth without changing current API runtime model (`tsx`) and alias style (`@/...`).
- Rationale: Matches current repository operation and avoids disruption before feature delivery.
- Alternatives considered:
  - Switch API back to dist-first runtime: rejected due to local-development friction and recent architecture decisions.

## Decision 8: Testing strategy for this phase

- Decision: Follow deferred-with-plan policy for full automation while requiring concrete acceptance checks for register/login/protected-route paths.
- Rationale: Constitution allows phased testing while requiring testable scenarios now.
- Alternatives considered:
  - Full unit/integration/e2e suite immediately: deferred to avoid blocking feature foundation delivery.
