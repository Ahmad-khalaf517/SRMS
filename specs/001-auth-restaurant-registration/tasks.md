# Tasks: SRMS Authentication and Restaurant Registration (AUTH-001)

**Input**: Design documents from `/specs/001-auth-restaurant-registration/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/auth-api.yaml`

**Tests**: Automated tests are deferred by constitution phase policy for this domain; include explicit acceptance validation and test-readiness tasks.

**Organization**: Tasks are grouped by user story so each story remains independently implementable and demonstrable.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared contracts and workspace plumbing required by authentication.

- [x] T001 Update auth dependency set in `apps/api/package.json` (add JWT, bcrypt, cookie-parser, cors runtime libraries and type packages).
- [x] T002 Create `packages/api-contracts` package with domain folder structure (`src/auth`, `src/user`, `src/restaurant`, etc.).
- [x] T003 [P] Add api-contracts package exports in `packages/api-contracts/package.json` for each domain.
- [x] T004 [P] Add auth domain API call functions in `packages/api-client/src/auth.ts` and export from package root.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create foundational contracts and server/client auth primitives that block all user stories.

**⚠️ CRITICAL**: No user story implementation should begin before this phase completes.

- [x] T005 Create auth DTOs in `packages/api-contracts/src/auth/auth.types.ts` (`LoginDTO`, `RegisterDTO`, `AuthUserDTO`, `AuthResponseDTO`, `RefreshResponseDTO`).
- [x] T006 Export auth domain contracts from `packages/api-contracts/src/auth/index.ts` and package root.
- [x] T007 Create auth validation schemas in `packages/api-contracts/src/auth/schemas.ts` (`LoginSchema`, `RegisterSchema`).
- [x] T008 Create auth route constants in `packages/api-contracts/src/auth/constants.ts` (`AUTH_ROUTES`).
- [x] T009 [P] Add auth API client methods in `packages/api-client/src/auth.ts` (register/login/refresh/logout/current-user).
- [x] T010 Export auth API client methods from `packages/api-client/src/index.ts`.
- [ ] T011 Create auth crypto/token utilities in `apps/api/src/modules/auth/utils/password.util.ts` and `apps/api/src/modules/auth/utils/token.util.ts`.
- [ ] T012 Create auth repository layer with Restaurant/User/UserRole model definitions in `apps/api/src/modules/auth/repository/restaurant.repository.ts`, `apps/api/src/modules/auth/repository/user.repository.ts`, and `apps/api/src/modules/auth/repository/user-role.repository.ts`.
- [ ] T013 Create auth module route/controller/service skeleton in `apps/api/src/modules/auth/routes/auth.routes.ts`, `apps/api/src/modules/auth/controller/auth.controller.ts`, and `apps/api/src/modules/auth/service/auth.service.ts`.
- [ ] T014 Register auth module routes in `apps/api/src/app.ts` and expose `/api/v1/auth` base path.

**Checkpoint**: Foundation ready; user story phases can proceed.

---

## Phase 3: User Story 1 - Register Restaurant and First Admin (Priority: P1) 🎯 MVP

**Goal**: Allow restaurant owner onboarding that creates restaurant + first ADMIN user and starts an authenticated session.

**Independent Test**: Submit valid registration payload once and verify restaurant/user creation, ADMIN assignment, session token response, and dashboard redirect.

- [x] T015 [US1] Add `RegisterDTO` and `RegisterResponseDTO` in `packages/api-contracts/src/auth/auth.types.ts`.
- [x] T016 [US1] Implement register schema details (nested restaurant + user payload) in `packages/api-contracts/src/auth/schemas.ts`.
- [ ] T017 [US1] Implement transactional restaurant creation flow in `apps/api/src/modules/auth/repository/restaurant.repository.ts`.
- [ ] T018 [US1] Implement user uniqueness lookup plus first ADMIN user-role assignment behavior in `apps/api/src/modules/auth/repository/user.repository.ts` and `apps/api/src/modules/auth/repository/user-role.repository.ts`.
- [ ] T019 [US1] Implement register workflow service (validate, unique check, transaction, hash, create user, create ADMIN user-role, token issue) in `apps/api/src/modules/auth/service/auth.service.ts`.
- [ ] T020 [US1] Implement `POST /auth/register` controller + route wiring in `apps/api/src/modules/auth/controller/auth.controller.ts` and `apps/api/src/modules/auth/routes/auth.routes.ts`.
- [ ] T021 [P] [US1] Extend signup UI with restaurant fields in `apps/dashboard/src/modules/auth/components/signup-form.tsx`.
- [ ] T022 [P] [US1] Add signup form schema and transformation mapping in `apps/dashboard/src/modules/auth/schemas/register.schema.ts`.
- [ ] T023 [US1] Implement register API mutation in `apps/dashboard/src/modules/auth/api/register.ts` and `apps/dashboard/src/modules/auth/hooks/use-register.ts`.
- [ ] T024 [US1] Handle post-registration session set and redirect in `apps/dashboard/src/modules/auth/pages/signup-page.tsx`.

**Checkpoint**: User Story 1 is independently functional and demo-ready.

---

## Phase 4: User Story 2 - Login Existing User (Priority: P2)

**Goal**: Authenticate existing active users with email/password and establish session for normal access.

**Independent Test**: Log in with valid credentials and invalid/inactive credentials, confirming correct success/error behavior and redirect logic.

- [x] T025 [US2] Add `LoginDTO` and `LoginResponseDTO` in `packages/api-contracts/src/auth/auth.types.ts`.
- [x] T026 [US2] Implement login schema details in `packages/api-contracts/src/auth/schemas.ts`.
- [ ] T027 [US2] Implement password verification, inactive-user blocking, and active user-role lookup in `apps/api/src/modules/auth/service/auth.service.ts`.
- [ ] T028 [US2] Implement `POST /auth/login` controller + route behavior in `apps/api/src/modules/auth/controller/auth.controller.ts` and `apps/api/src/modules/auth/routes/auth.routes.ts`.
- [ ] T029 [P] [US2] Implement login API client/mutation in `apps/dashboard/src/modules/auth/api/login.ts` and `apps/dashboard/src/modules/auth/hooks/use-login.ts`.
- [ ] T030 [US2] Wire login form submission to API integration and error display in `apps/dashboard/src/modules/auth/components/login-form.tsx`.
- [ ] T031 [US2] Create auth session Zustand store in `apps/dashboard/src/modules/auth/store/auth-session.store.ts`.
- [ ] T032 [US2] Apply post-login redirect behavior in `apps/dashboard/src/modules/auth/pages/login-page.tsx`.

**Checkpoint**: User Stories 1 and 2 both run independently.

---

## Phase 5: User Story 3 - Protected Route Foundation (Priority: P3)

**Goal**: Enforce protected access boundaries in API and dashboard using authenticated session context.

**Independent Test**: Verify protected resources deny unauthenticated access and allow authenticated users.

- [ ] T033 [US3] Implement JWT auth middleware and current-user resolver with user-role permission context in `apps/api/src/modules/auth/utils/auth.middleware.ts`.
- [ ] T034 [US3] Add protected auth endpoint(s) (e.g., current user) with role/permission checks in `apps/api/src/modules/auth/controller/auth.controller.ts` and `apps/api/src/modules/auth/routes/auth.routes.ts`.
- [ ] T035 [US3] Add dashboard protected-route component in `apps/dashboard/src/modules/auth/components/protected-route.tsx`.
- [ ] T036 [US3] Integrate protected-route guard into app routing in `apps/dashboard/src/app/routes/app-routes.tsx`.
- [ ] T037 [US3] Add session bootstrap/current-user hook in `apps/dashboard/src/modules/auth/hooks/use-auth-session.ts`.

**Checkpoint**: All user stories are functionally complete and independently verifiable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, docs alignment, and validation for handoff.

- [x] T038 [P] Update feature quickstart verification steps in `specs/001-auth-restaurant-registration/quickstart.md` for final auth behavior including logout scenario F.
- [x] T039 [P] Update API environment variable documentation in root `README.md`.
- [x] T040 Perform security hardening pass for token/cookie settings and response redaction in `apps/api/src/modules/auth/utils/token.util.ts` and `apps/api/src/shared/logging/logger.ts`.
- [x] T041 Run acceptance and typecheck validation commands and record results.
- [x] T042 Implement `POST /auth/logout` endpoint that clears `srms_refresh_token` httpOnly cookie (API controller + route).
- [x] T043 Implement `useLogout` hook in dashboard that calls logout API, clears access token from memory, clears session store, and redirects to `/login`.
- [x] T044 Wire Log out item in `apps/dashboard/src/components/nav-user.tsx` to `useLogout` hook with loading and disabled states.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: can start immediately.
- **Phase 2 (Foundational)**: depends on Phase 1 and blocks all user stories.
- **Phases 3-5 (User Stories)**: depend on Phase 2 completion.
- **Phase 6 (Polish)**: depends on completion of all user story phases.

### User Story Dependencies

- **US1 (P1)**: starts first after foundation; establishes onboarding and first-session behavior.
- **US2 (P2)**: depends on shared auth foundation and reuses service/repository/token utilities from US1.
- **US3 (P3)**: depends on finalized auth session model from US1+US2 to implement protection boundaries.

### Parallel Opportunities

- Setup: T003 and T004 can run in parallel after T001/T002 context is clear.
- Foundational: T009 and T010 can run in parallel; T011 and T012 can proceed in parallel once shared contracts exist.
- US1: T021 and T022 can run in parallel with backend flow tasks T017-T020.
- US2: T029 can run in parallel with backend login tasks T027-T028.
- Polish: T038 and T039 can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Backend and frontend tracks in parallel after shared contracts are available
T017 apps/api/src/modules/auth/repository/restaurant.repository.ts
T018 apps/api/src/modules/auth/repository/user.repository.ts
T018 apps/api/src/modules/auth/repository/user-role.repository.ts
T021 apps/dashboard/src/modules/auth/components/signup-form.tsx
T022 apps/dashboard/src/modules/auth/schemas/register.schema.ts
```

## Parallel Example: User Story 2

```bash
# API login flow and dashboard mutation wiring in parallel
T027 apps/api/src/modules/auth/service/auth.service.ts
T028 apps/api/src/modules/auth/controller/auth.controller.ts
T029 apps/dashboard/src/modules/auth/api/login.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phases 1 and 2.
2. Deliver Phase 3 (US1) end-to-end.
3. Validate onboarding flow via quickstart scenarios.
4. Demo/merge MVP if stable.

### Incremental Delivery

1. US1 onboarding and first admin authentication.
2. US2 repeat login and session persistence.
3. US3 route protection and current-user foundation.
4. Polish and finalize acceptance evidence.

### Team Parallelization

1. One engineer focuses API auth module/repository/service.
2. One engineer focuses dashboard auth flows and session store.
3. One engineer handles shared package contracts and api-client.
4. Integrate at phase checkpoints to reduce merge conflicts.

---

## Notes

- All tasks use strict checklist format with IDs and file paths.
- `[P]` marks tasks safe for parallel execution.
- User story labels (`[US1]`, `[US2]`, `[US3]`) map work to independent deliverables.
- Automated test suite implementation is deferred per current constitution testing phase; acceptance validation is mandatory in this feature.
