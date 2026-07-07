# Implementation Plan: SRMS Authentication and Restaurant Registration (AUTH-001)

**Branch**: `001-auth-restaurant-registration` | **Date**: 2026-07-08 | **Spec**: `specs/001-auth-restaurant-registration/spec.md`

**Input**: Feature specification from `/specs/001-auth-restaurant-registration/spec.md`

## Summary

Implement first-class authentication for SRMS with restaurant onboarding, owner account creation, login, and protected route foundations across `apps/api` and `apps/dashboard`. The design follows the constitution's feature-first boundaries, shared-contract reuse, tsx-first API runtime, and standardized envelopes/AppError handling.

## 1. Current State Analysis

### Repository and Architecture

- Monorepo with pnpm workspaces.
- Active applications: `apps/api`, `apps/dashboard`.
- Active shared runtime packages: `packages/types`, `packages/validation`, `packages/api-client`, `packages/utils`, `packages/ui`.
- API already has shared HTTP infrastructure (`response`, `middleware`, `AppError`, `logger`) and alias imports (`@/...`).
- Dashboard already has auth UI pages/components shell (`modules/auth`) but no backend integration/state/session implementation.

### Existing Authentication-Related Baseline

- No `apps/api/src/modules/auth` module exists yet.
- No user/restaurant models or auth routes exist.
- No JWT/bcrypt/auth middleware flow implemented.
- Shared types currently include health/orders/payments/users role enums, but no auth request/response contracts.
- Shared validation package has health/http schemas only; no login/register schemas.

### Dependencies Already Available

- API: `express`, `mongoose`, `zod`, `pino` (present).
- Dashboard: React and routing stack present.
- Missing for auth implementation: JWT library and bcrypt library in API dependencies.

## 2. Architecture Impact

### Affected Applications

- `apps/api`: new `modules/auth` vertical slice, model additions, token issuance/verification, auth middleware.
- `apps/dashboard`: signup/login flow integration, API calls, session store, guarded route behavior.

### Affected Shared Packages

- `packages/types`: add feature contracts for restaurant, user auth profile, auth response, and role-related types.
- `packages/validation`: add register/login schemas and reusable auth-related schema fragments.
- `packages/api-client`: add auth API methods and token-aware request utilities.

### Constitution Fit

- Follows feature-driven ownership under `modules/auth`.
- Reuses shared contracts from packages (no duplicate frontend/backend DTO definitions).
- Keeps validation in `packages/validation` and role/domain constants in `packages/types` (no separate constants package).

## 3. Database Implementation Plan

### Collections

1. `restaurants`
   - Fields: `_id`, `name`, `address`, `phone`, `email`, `isActive`, `createdAt`, `updatedAt`.
   - Defaults: `isActive = true`.

2. `users`
   - Fields: `_id`, `restaurantId`, `name`, `email`, `password`, `role`, `isActive`, `createdAt`, `updatedAt`.
   - Defaults: `isActive = true`.

### Relationships

- One restaurant has many users.
- Each user belongs to exactly one restaurant (`users.restaurantId -> restaurants._id`).

### Indexes and Constraints

- `users.email`: unique index, normalized lower-case value.
- `restaurants.email`: non-unique index for contact lookups.
- `users.restaurantId`: index for tenant user queries.
- Optional compound index for future role queries: `(restaurantId, role)`.

### Transaction Strategy

- Register flow must create restaurant and first user atomically via Mongo transaction/session.
- On failure, rollback both creations to avoid orphan restaurant/user records.

### Data Validation Rules

- Schema-level validation via Zod at request boundary.
- Mongoose schema validation for persistence constraints (required fields, enum role, normalized email).

## 4. Backend Implementation Plan

### Auth Module Structure

Target path: `apps/api/src/modules/auth`

Subfolders:

- `controller`
- `service`
- `repository`
- `routes`
- `schemas`
- `types`
- `utils`

### Responsibilities

- Registration endpoint.
- Login endpoint.
- Password hashing/verification.
- Access and refresh token generation.
- Authentication middleware and current-user extraction.

### Workflow Design

Registration:

1. Validate request payload (shared schema).
2. Verify user email uniqueness.
3. Start DB transaction.
4. Create restaurant.
5. Hash password.
6. Create user with ADMIN role.
7. Commit transaction.
8. Generate tokens and return envelope.

Login:

1. Validate login payload.
2. Find user by email.
3. Check user active status.
4. Compare password hash.
5. Generate tokens.
6. Return authenticated user envelope.

### Error and Middleware Flow

- Use existing `AppError` hierarchy for validation/conflict/unauthorized/forbidden.
- Preserve standardized response envelope via `sendSuccess`/`sendError`.
- Integrate auth middleware into protected routes foundation.

## 5. Frontend Implementation Plan

### Dashboard Changes

- Extend signup form to capture restaurant + owner fields.
- Bind forms using React Hook Form + Zod schema resolver.
- Add TanStack Query mutations for register/login.
- Add Zustand auth session slice for UI/session state only.
- Add route guard strategy for protected pages.
- Redirect to dashboard home on successful auth.

### Auth Module Scope

`apps/dashboard/src/modules/auth/`:

- `api/` for auth requests.
- `components/` for login/signup form components.
- `hooks/` for auth mutation/session hooks.
- `pages/` for route-level pages.
- `schemas/` for form-level schema wiring.
- `store/` for session UI state.
- `types/` for local view-model wrappers only.

## 6. Shared Packages Plan

### `packages/types`

- Add feature folders for auth contracts:
  - Restaurant type.
  - User auth-safe type (no password).
  - Auth response type.
  - UserRole type alignment for ADMIN/CASHIER/KITCHEN_STAFF.

### `packages/validation`

- Add auth schemas:
  - Register schema (restaurant + user nested payload).
  - Login schema.

### `packages/api-client`

- Add methods:
  - `registerRestaurantOwner(payload)`
  - `login(payload)`
  - Optional `getCurrentUser()` foundation.
- Add auth header/cookie handling primitives suitable for token strategy.

### Constitutional Decision (Requested `packages/schemas` and `packages/constants`)

- To comply with current constitution, auth schemas live in `packages/validation` and role/constants live in `packages/types` feature contracts.
- No new `packages/schemas` or `packages/constants` package will be introduced.

## 7. Security Plan

- Hash passwords with bcrypt (cost factor configurable via env).
- Use JWT access token + refresh token pair.
- Keep refresh token transport and storage strategy explicit (httpOnly secure cookie preferred for refresh token).
- Implement token verification middleware for protected routes.
- Implement current-user middleware to attach authenticated identity context.
- Redact sensitive values in logs (already supported by logger redact config).
- Ensure responses never include password fields.

## 8. Implementation Order

1. Add shared auth types in `packages/types`.
2. Add shared auth schemas in `packages/validation`.
3. Add/extend auth methods in `packages/api-client`.
4. Create restaurant and user models in API.
5. Build `modules/auth` repository/service/controller/routes.
6. Add JWT + bcrypt utilities and auth middleware.
7. Integrate dashboard forms and API mutations.
8. Add protected route handling and session store wiring.
9. Run end-to-end integration validation and acceptance checks.

## 9. Risks and Technical Decisions

### Risks

- Transaction misuse may create partial onboarding records.
- Token refresh strategy mismatch between API and dashboard can cause session instability.
- Email normalization inconsistencies can bypass uniqueness guarantees.
- Over-coupling auth responses to dashboard UI can hurt reuse for future apps.

### Decisions

- Keep contracts in shared packages and avoid per-app DTO duplication.
- Use module-first auth slice with minimum required layers.
- Keep auth package changes constitution-compliant (`types` + `validation`, no constants package).

### Scalability Considerations

- Tenant linkage through `restaurantId` supports future branch-level models.
- Role model includes ADMIN/CASHIER/KITCHEN_STAFF for upcoming operational apps.
- API contracts designed reusable for future customer/delivery clients.

## 10. Definition of Completion

Feature planning and implementation will be considered complete when:

1. Register and login endpoints pass acceptance scenarios and follow envelope/error standards.
2. Restaurant and user models exist with required indexes/constraints and transactional registration flow.
3. Dashboard signup/login are integrated with real API and redirect behavior.
4. Protected route foundation is active in API and dashboard routing.
5. Shared auth contracts/schemas are reused from packages with no duplicate business definitions.
6. Security controls (bcrypt, JWT, sensitive-data protection) are implemented and validated.
7. Constitution compliance check passes with no unresolved exceptions.

## Technical Context

**Language/Version**: TypeScript 5.9.x (API + dashboard + shared packages)

**Primary Dependencies**: Express 5, Mongoose 9, Zod 4, Pino 9, React 19, React Router 8, TanStack Query, Zustand, React Hook Form

**Storage**: MongoDB via Mongoose

**Testing**: Type checking currently enforced (`tsc --noEmit`); acceptance scenarios required for auth workflows in this phase

**Target Platform**: Node.js server (API), modern browsers (dashboard)

**Project Type**: Monorepo web application (backend API + frontend dashboard + shared packages)

**Performance Goals**: Authentication requests should return in user-perceived interactive time (< 2s typical path in local/prod-like env)

**Constraints**: Constitution compliance, shared-contract reuse, no duplicate business logic, tsx-first API runtime

**Scale/Scope**: Initial tenant onboarding and role-ready auth foundation for first production SRMS workflows

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Domain boundaries defined by business capability (no layer-first drift). PASS
- Shared contracts identified (types/schemas/enums/constants) and reused from packages. PASS
- Validation plan covers all external inputs with Zod (API, forms, query, env). PASS
- Auth and authorization rules explicitly captured for protected routes and permissions. PASS
- State ownership split documented (TanStack Query for server state, Zustand for UI/session). PASS
- API envelope, AppError hierarchy, and structured logging strategy included. PASS
- Real-time requirements evaluated; Socket.IO preferred where immediacy is required. PASS (not required for auth v1)
- Testing phase declared per domain (deferred-with-plan or required automated tests). PASS
- Future-proofing checklist answered (reuse, multi-branch, scale, AI-readability, no duplication). PASS
- Any constitution exception includes owner, expiration, and remediation plan. PASS (no exceptions)

### Post-Design Constitution Re-check

PASS. Generated artifacts maintain constitution alignment and contain no unresolved exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-restaurant-registration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── auth-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── api/
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   └── health/
│       ├── shared/
│       └── config/
└── dashboard/
    └── src/
        ├── app/
        ├── modules/
        │   └── auth/
        └── templates/

packages/
├── api-client/
├── types/
├── validation/
├── ui/
└── utils/
```

**Structure Decision**: Continue the current monorepo feature-first architecture; add auth as first full business module in both API and dashboard while reusing shared packages for contracts.

## Complexity Tracking

No constitution violations identified. No exception tracking required.
