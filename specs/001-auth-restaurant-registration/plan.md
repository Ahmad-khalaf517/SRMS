# Implementation Plan: SRMS Authentication and Restaurant Registration (AUTH-001)

**Branch**: `001-auth-restaurant-registration` | **Date**: 2026-07-08 | **Spec**: `specs/001-auth-restaurant-registration/spec.md`

**Input**: Feature specification from `/specs/001-auth-restaurant-registration/spec.md`

## Summary

Implement first-class authentication for SRMS with restaurant onboarding, owner account creation, login, and protected route foundations across `apps/api` and `apps/dashboard`. The design follows the constitution's feature-first boundaries, shared-contract reuse, tsx-first API runtime, and standardized envelopes/AppError handling.

## 1. Current State Analysis

### Repository and Architecture

- Monorepo with pnpm workspaces.
- Active applications: `apps/api`, `apps/dashboard`.
- Active shared runtime packages: `packages/api-contracts`, `packages/api-client`, `packages/utils`, `packages/ui`.
- `packages/types` and `packages/validation` were retired and consolidated into `packages/api-contracts`.
- API already has shared HTTP infrastructure (`response`, `middleware`, `AppError`, `logger`) and alias imports (`@/...`).
- Dashboard already has auth UI pages/components shell (`modules/auth`) but no backend integration/state/session implementation.

### Existing Authentication-Related Baseline

- No `apps/api/src/modules/auth` module exists yet.
- No user/restaurant models or auth routes exist.
- No JWT/bcrypt/auth middleware flow implemented.
- Shared contracts are in `packages/api-contracts` which did not yet have auth domain entries (auth, user, restaurant domains).
- Validation schemas did not yet exist for login/register.

### Dependencies Already Available

- API: `express`, `mongoose`, `zod`, `pino` (present).
- Dashboard: React and routing stack present.
- Missing for auth implementation: JWT library and bcrypt library in API dependencies.

## 2. Architecture Impact

### Affected Applications

- `apps/api`: new `modules/auth` vertical slice, model additions, token issuance/verification, auth middleware.
- `apps/dashboard`: signup/login flow integration, API calls, session store, guarded route behavior.

### Affected Shared Packages

- `packages/api-contracts`: add auth domain types (DTOs), schemas, and route constants.
- `packages/api-client`: add auth domain file `auth.ts` with all auth API call functions.
- `packages/api-client`: add auth API methods and token-aware request utilities.

### Constitution Fit

- Centralizes all contracts in `packages/api-contracts` (types, schemas, route constants) per constitution v1.1.0.
- One api-client file per domain (`packages/api-client/src/auth.ts`) with all auth calls.
- Dashboard imports api-client directly; no route URI duplication in dashboard modules.

## 3. Database Implementation Plan

### Collections

1. `restaurants`
   - Fields: `_id`, `name`, `address`, `phone`, `email`, `isActive`, `createdAt`, `updatedAt`.
   - Defaults: `isActive = true`.

2. `users`

- Fields: `_id`, `name`, `email`, `password`, `isActive`, `createdAt`, `updatedAt`.
- Defaults: `isActive = true`.

3. `user_roles`

- Fields: `_id`, `userId`, `restaurantId`, `role`, `isActive`, `createdAt`, `updatedAt`.
- Defaults: `isActive = true`.

### Relationships

- One restaurant has many user-role assignments.
- One user has many user-role assignments.
- User-role assignment binds one user to one restaurant with one role (`user_roles.userId -> users._id`, `user_roles.restaurantId -> restaurants._id`).

### Indexes and Constraints

- `users.email`: unique index, normalized lower-case value.
- `restaurants.email`: non-unique index for contact lookups.
- `user_roles.userId`: index for user permission lookups.
- `user_roles.restaurantId`: index for tenant user-role queries.
- `user_roles`: unique compound index `(userId, restaurantId, role)`.
- Optional compound index for future role queries: `(restaurantId, role)`.

### Transaction Strategy

- Register flow must create restaurant, first user, and first user-role assignment atomically via Mongo transaction/session.
- On failure, rollback all three writes to avoid orphan records.

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
6. Create user.
7. Create `user_roles` assignment with ADMIN role.
8. Commit transaction.
9. Generate tokens and return envelope.

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

### `packages/api-contracts`

- Add auth domain folder with:
  - `auth.types.ts`: `LoginDTO`, `RegisterDTO`, `AuthUserDTO`, `AuthResponseDTO`, `RefreshResponseDTO`.
  - `schemas.ts`: `LoginSchema`, `RegisterSchema` (Zod).
  - `constants.ts`: `AUTH_ROUTES` URI constants.
  - `index.ts`: barrel export.

### `packages/api-client`

- Add methods:
  - `registerRestaurantOwner(payload)`
  - `login(payload)`
  - Optional `getCurrentUser()` foundation.
- Add auth header/cookie handling primitives suitable for token strategy.

### Constitutional Decision (Requested `packages/schemas` and `packages/constants`)

- Auth schemas and route constants live in `packages/api-contracts/src/auth`; role/domain
  constants live in the same package under each feature domain.
- `packages/api-client/src/auth.ts` contains all auth API call functions.
- Dashboard modules import directly from `@srms/api-client`.

## 7. Security Plan

- Hash passwords with bcrypt (cost factor configurable via env).
- Use JWT access token + refresh token pair.
- Keep refresh token transport and storage strategy explicit (httpOnly secure cookie preferred for refresh token).
- Implement token verification middleware for protected routes.
- Implement current-user middleware to attach authenticated identity context.
- Redact sensitive values in logs (already supported by logger redact config).
- Ensure responses never include password fields.

## 8. Implementation Order

1. Add auth domain contracts in `packages/api-contracts` (types, schemas, route constants).
2. Add auth API calls in `packages/api-client/src/auth.ts`.
3. Create restaurant, user, and user-role models in API.
4. Build `modules/auth` repository/service/controller/routes.
5. Add JWT + bcrypt utilities and auth middleware.
6. Integrate dashboard forms and API mutations.
7. Add protected route handling and session store wiring.
8. Run end-to-end integration validation and acceptance checks.

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

- Tenant linkage through `user_roles.restaurantId` supports future branch-level models.
- Role model includes ADMIN/CASHIER/KITCHEN_STAFF via `user_roles` assignment for upcoming operational apps.
- API contracts designed reusable for future customer/delivery clients.

## 10. Definition of Completion

Feature planning and implementation will be considered complete when:

1. Register and login endpoints pass acceptance scenarios and follow envelope/error standards.
2. Restaurant, user, and user-role models exist with required indexes/constraints and transactional registration flow.
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
├── api-contracts/
│   └── src/
│       └── auth/      # types (DTOs), schemas, route constants
├── api-client/
│   └── src/
│       └── auth.ts    # all auth API calls
├── ui/
└── utils/
```

**Structure Decision**: Continue the current monorepo feature-first architecture; add auth as first full business module in both API and dashboard while reusing `packages/api-contracts` for all shared contracts and `packages/api-client` for all API call functions.

## Complexity Tracking

No constitution violations identified. No exception tracking required.
