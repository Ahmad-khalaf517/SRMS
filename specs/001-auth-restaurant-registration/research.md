# Phase 0 Research: SRMS Authentication and Restaurant Registration

> **Architecture Amendment (2026-07-09)**: Decisions 1 and 2 below describe the
> original design rationale. After implementation, `packages/types` and
> `packages/validation` were retired and consolidated into a unified
> `packages/api-contracts` package per constitution v1.1.0. All new features MUST
> follow the api-contracts model described at the end of this document.

## Decision 1 (superseded): Auth schemas initially in `packages/validation`

- Decision: Add `register` and `login` schemas under `packages/validation/src/auth`.
- Status: **Superseded**. Schemas are now in `packages/api-contracts/src/auth/schemas.ts`.

## Decision 2 (superseded): Role/auth constants in `packages/types`

- Decision: Define role and auth-related types/const objects in `packages/types/src/auth`.
- Status: **Superseded**. Types are now in `packages/api-contracts/src/auth/auth.types.ts` and
  `packages/api-contracts/src/user/user.types.ts`.

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

## Decision 9: Unified api-contracts package replaces types + validation (post-implementation)

- Decision: Consolidate `packages/types` and `packages/validation` into `packages/api-contracts`,
  organized by domain. Each domain folder contains `<domain>.types.ts`, `schemas.ts`, and `constants.ts`.
- Rationale: Reduces import path complexity, co-locates related contracts, and removes the split between
  type definitions and schemas that caused repeated synchronization errors. Constitutionally ratified as v1.1.0.
- Impact on api-client: `packages/api-client` now has one file per domain (`auth.ts`, `orders.ts`, etc.)
  containing all API call functions for that domain. Frontend apps import directly.

## Decision 10: DTO naming convention

- Decision: All DTOs that cross the API boundary MUST follow `<Entity><Action>DTO` naming
  (e.g., `LoginDTO`, `CreateUserDTO`, `RegisterRestaurantDTO`).
- Rationale: Distinguishes request/response transfer objects from domain model types and
  improves discoverability across both apps.

## Decision 11: Session strategy — httpOnly cookie + in-memory access token

- Decision: Refresh token is stored in an httpOnly, Secure, SameSite=Lax cookie managed by the API.
  Access token is held in memory only (Zustand store or closure). Logout calls `POST /auth/logout`
  which clears the cookie server-side.
- Rationale: Prevents XSS access to long-lived credentials; cookie transport handles refresh silently;
  logout is explicit and server-enforced.
