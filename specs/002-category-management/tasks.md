# Tasks: Restaurant Category Management (CATEGORY-001)

**Input**: Design documents from `specs/002-category-management/`

**Prerequisites**: `plan.md` ✅ | `spec.md` ✅ | `research.md` ✅ | `data-model.md` ✅ | `contracts/category-api.yaml` ✅

**Tests**: Automated tests are required for this domain per constitution phase policy.
Backend must cover create, duplicate prevention, restaurant isolation, admin authorization, non-admin forbidden, and pagination.
Frontend must cover list rendering, pagination, admin action visibility, form validation, and delete confirmation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: User story this task belongs to (US1–US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add shared contracts and API client functions that all other phases depend on.

- [ ] T001 Add `packages/api-contracts/src/categories/category.types.ts` — export `Category`, `CreateCategoryDTO`, `UpdateCategoryDTO`, `CategoryList`, `PaginationMeta`, `CategoryResponse`, `CategoryListResponse`
- [ ] T002 [P] Add `packages/api-contracts/src/categories/schemas.ts` — export `CreateCategorySchema` (name trim min 2 max 100, description trim max 500 optional), `UpdateCategorySchema` (both optional, refine at least one), re-export `PaginationQuerySchema` as `CategoryQuerySchema`
- [ ] T003 [P] Add `packages/api-contracts/src/categories/constants.ts` — export `CATEGORY_ENDPOINTS = { BASE: '/categories', BY_ID: (id) => '/categories/${id}' }`
- [ ] T004 Add `packages/api-contracts/src/categories/index.ts` barrel — `export * from './category.types'; export * from './schemas'; export * from './constants'`
- [ ] T005 Update `packages/api-contracts/src/index.ts` — add `export * from './categories'`
- [ ] T006 Update `packages/api-contracts/package.json` exports — add `./categories` entry pointing to `./src/categories/index.ts`
- [ ] T007 Add `packages/api-client/src/categories.ts` — export `getCategories(client, params)`, `createCategory(client, payload)`, `updateCategory(client, id, payload)`, `deleteCategory(client, id)` using `CATEGORY_ENDPOINTS`
- [ ] T008 Update `packages/api-client/src/index.ts` — add `export * from './categories.js'`

**Checkpoint**: `pnpm --filter @srms/api-contracts typecheck` and `pnpm --filter @srms/api-client typecheck` both pass. Shared contracts ready; all phases can proceed.

---

## Phase 2: Foundational — API Backend Infrastructure

**Purpose**: Build the repository, service, controller, and routes. Depends on Phase 1 types and schemas.

**⚠️ CRITICAL**: No user story API phase should begin before this phase completes.

- [ ] T009 Add `apps/api/src/modules/categories/repository/category.repository.ts` — Mongoose schema, model, indexes (`{ restaurantId: 1 }`, `{ restaurantId: 1, createdAt: -1 }`, `{ name: 1, restaurantId: 1 }` unique), and functions: `findCategoriesByRestaurant`, `findCategoryById`, `findCategoryByName`, `createCategory`, `updateCategoryById`, `deleteCategoryById`
- [ ] T010 Add `apps/api/src/modules/categories/service/category.service.ts` — implement `listCategories`, `createCategory` (trim + duplicate check), `updateCategory` (404 guard + self-exclusion duplicate check), `deleteCategory` (404 guard); import DTOs from `@srms/api-contracts`
- [ ] T011 Add `apps/api/src/modules/categories/controller/category.controller.ts` — `listCategoriesController`, `createCategoryController`, `updateCategoryController`, `deleteCategoryController`; extract `auth.restaurantId` from `req.auth`; call `sendSuccess`; delegate errors via `next`
- [ ] T012 Add `apps/api/src/modules/categories/routes/category.routes.ts` — wire routes: GET `/categories` (`authenticate`, `validate({ query })`), POST `/categories` (`authenticate`, `authorize([ADMIN])`, `validate({ body })`), PATCH `/categories/:id` (`authenticate`, `authorize([ADMIN])`, `validate({ body })`), DELETE `/categories/:id` (`authenticate`, `authorize([ADMIN])`)
- [ ] T013 Update `apps/api/src/app.ts` — import `categoryRoutes` and add `app.use(BASE_URL, categoryRoutes)`

**Checkpoint**: `pnpm --filter api typecheck` passes. Manual smoke-test with `curl` or HTTP client confirms 401 on unauthenticated request and 403 on non-admin write attempt.

---

## Phase 3: User Story 1 — View and Navigate Category List (Priority: P1) 🎯 MVP

**Goal**: Any authenticated user can view their restaurant's categories with pagination, loading, empty, and error states.

**Independent Test**: Log in as any role, navigate to `/categories`, verify paginated list with correct columns; verify restaurant isolation by logging in as a different restaurant and confirming no data cross-over.

### Tests for User Story 1

- [ ] T014 [P] [US1] Backend integration test — `GET /categories` returns only categories for the authenticated user's restaurant; verifies pagination metadata (`total`, `totalPages`); verifies empty array for restaurant with no categories
- [ ] T015 [P] [US1] Backend integration test — `GET /categories` with another restaurant's categories in DB returns empty data (restaurant isolation)

### Implementation for User Story 1

- [ ] T016 [P] [US1] Add `apps/dashboard/src/modules/categories/api/index.ts` — export thin wrappers: `getCategoriesRequest`, `createCategoryRequest`, `updateCategoryRequest`, `deleteCategoryRequest`; bind `authApiClient` from `@/modules/auth/api/client`
- [ ] T017 [US1] Add `apps/dashboard/src/modules/categories/hooks/use-categories.ts` — `useQuery({ queryKey: ['categories', { page, limit }], queryFn: getCategoriesRequest })`
- [ ] T018 [US1] Add `apps/dashboard/src/modules/categories/pages/categories-page.tsx` — renders paginated table with columns Name, Description, Created Date, Actions; handles loading (skeleton), empty (admin shows create CTA; non-admin shows plain message), error (retry button), data states; reads `user.role` from `useAuthSessionStore` for admin detection
- [ ] T019 [US1] Update `apps/dashboard/src/app/routes/app-routes.tsx` — add `/categories` route inside `<ProtectedRoute />` block (not inside `RoleGuard`)

**Checkpoint**: User Story 1 is independently functional — authenticated users can view the category list end-to-end.

---

## Phase 4: User Story 2 — Create Category (Priority: P2)

**Goal**: Admin creates a category via a validated form dialog; duplicate names are rejected; non-admin cannot create.

**Independent Test**: Submit valid create form as admin → category appears in list. Submit duplicate name → 409 error shown in form. Attempt create as non-admin → 403 returned.

### Tests for User Story 2

- [ ] T020 [P] [US2] Backend integration test — `POST /categories` with valid payload creates category and returns 201 with `CategoryResponse` envelope; name is stored trimmed
- [ ] T021 [P] [US2] Backend integration test — `POST /categories` with duplicate name (case/trim variants) returns 409 Conflict
- [ ] T022 [P] [US2] Backend integration test — `POST /categories` as Cashier/Kitchen Staff returns 403 Forbidden

### Implementation for User Story 2

- [ ] T023 [P] [US2] Add `apps/dashboard/src/modules/categories/schemas/category-form.schema.ts` — export `CategoryFormSchema` (wraps `CreateCategorySchema`), `CategoryFormValues` type, and `EditCategoryFormSchema` (wraps `UpdateCategorySchema`)
- [ ] T024 [P] [US2] Add `apps/dashboard/src/modules/categories/components/category-form.tsx` — React Hook Form + `zodResolver`; `name` (required) + `description` (optional textarea); inline field errors; submit button disabled + shows "Saving…" while pending; `onSuccess` callback prop; `onError` calls `toast.error(getErrorMessage(error))`; supports both create and edit via `defaultValues` prop
- [ ] T025 [US2] Add `apps/dashboard/src/modules/categories/hooks/use-create-category.ts` — `useMutation({ mutationFn: createCategoryRequest })`; `onSuccess`: `toast.success('Category created')`, invalidate `['categories']`; `onError`: `toast.error(getErrorMessage(error))`
- [ ] T026 [US2] Update `apps/dashboard/src/modules/categories/pages/categories-page.tsx` — add create dialog (controlled with `useState`); show "New Category" button only when `isAdmin`; wire `use-create-category` hook to `category-form`

**Checkpoint**: Admin can complete full create flow; non-admin sees no create button and API rejects direct attempts with 403.

---

## Phase 5: User Story 3 — Edit Category (Priority: P3)

**Goal**: Admin edits an existing category's name or description; duplicate names (other than self) are rejected; wrong restaurant returns 404.

**Independent Test**: Click Edit, change name, submit → list refreshes with new value. Edit to a name already used by another category → 409. Edit on category from different restaurant via API → 404.

### Tests for User Story 3

- [ ] T027 [P] [US3] Backend integration test — `PATCH /categories/:id` with valid payload updates and returns 200 with updated `CategoryResponse`
- [ ] T028 [P] [US3] Backend integration test — `PATCH /categories/:id` where name matches another category in same restaurant returns 409; same name as self succeeds (no false conflict)
- [ ] T029 [P] [US3] Backend integration test — `PATCH /categories/:id` where category belongs to different restaurant returns 404

### Implementation for User Story 3

- [ ] T030 [US3] Add `apps/dashboard/src/modules/categories/hooks/use-update-category.ts` — `useMutation({ mutationFn: ({ id, payload }) => updateCategoryRequest(id, payload) })`; `onSuccess`: `toast.success('Category updated')`, invalidate `['categories']`; `onError`: `toast.error(getErrorMessage(error))`
- [ ] T031 [US3] Update `apps/dashboard/src/modules/categories/pages/categories-page.tsx` — add edit dialog (controlled with `useState` + selected category state); show Edit action in table row only when `isAdmin`; wire `use-update-category` hook; pass existing category data as `defaultValues` to `category-form`

**Checkpoint**: Admin can edit categories end-to-end; self-name update succeeds; cross-restaurant edit rejected.

---

## Phase 6: User Story 4 — Delete Category (Priority: P4)

**Goal**: Admin deletes a category after confirmation dialog; cancelling leaves data unchanged; non-existent category returns 404.

**Independent Test**: Click Delete, confirm → category removed from list with success toast. Cancel → no change. API delete of non-existent ID → 404.

### Tests for User Story 4

- [ ] T032 [P] [US4] Backend integration test — `DELETE /categories/:id` removes the category and returns 200 success envelope
- [ ] T033 [P] [US4] Backend integration test — `DELETE /categories/:id` for non-existent or cross-restaurant ID returns 404
- [ ] T034 [P] [US4] Backend integration test — `DELETE /categories/:id` as non-admin returns 403

### Implementation for User Story 4

- [ ] T035 [P] [US4] Add `apps/dashboard/src/modules/categories/components/delete-category-dialog.tsx` — shadcn `AlertDialog`; shows category name in confirmation text; Delete button disabled + shows "Deleting…" while mutation is pending; Cancel closes dialog without action
- [ ] T036 [US4] Add `apps/dashboard/src/modules/categories/hooks/use-delete-category.ts` — `useMutation({ mutationFn: deleteCategoryRequest })`; `onSuccess`: `toast.success('Category deleted')`, invalidate `['categories']`; `onError`: `toast.error(getErrorMessage(error))`
- [ ] T037 [US4] Update `apps/dashboard/src/modules/categories/pages/categories-page.tsx` — add delete dialog (controlled with `useState` + selected category state); show Delete action in table row only when `isAdmin`; wire `use-delete-category` hook to `delete-category-dialog`

**Checkpoint**: All four user stories are independently functional and demo-ready end-to-end.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Typecheck validation, frontend component test coverage, and acceptance scenario verification.

- [ ] T038 [P] Run and confirm `pnpm --filter @srms/api-contracts typecheck` passes
- [ ] T039 [P] Run and confirm `pnpm --filter @srms/api-client typecheck` passes
- [ ] T040 [P] Run and confirm `pnpm --filter api typecheck` passes
- [ ] T041 [P] Run and confirm `pnpm --filter dashboard typecheck` passes
- [ ] T042 [P] Frontend component test — `categories-page.tsx`: renders skeleton during loading, empty state for admin vs non-admin, table rows when data present
- [ ] T043 [P] Frontend component test — pagination: clicking next/previous page updates query key and renders correct subset
- [ ] T044 [P] Frontend component test — admin action visibility: Edit/Delete visible for ADMIN role, hidden for CASHIER
- [ ] T045 [P] Frontend component test — `category-form.tsx`: shows inline field error for empty name; disables submit while pending
- [ ] T046 [P] Frontend component test — `delete-category-dialog.tsx`: Cancel closes dialog without calling mutation; Confirm calls mutation
- [ ] T047 Run all quickstart.md acceptance scenarios A–K and confirm each passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately.
- **Phase 2 (Foundational API)**: Depends on Phase 1 (T001–T008). Blocks US1–US4 API integration.
- **Phase 3 (US1 — View)**: Depends on Phase 1 (api-client) + Phase 2 (API running). MVP deliverable.
- **Phase 4 (US2 — Create)**: Depends on Phase 3 complete (list page exists to show new item).
- **Phase 5 (US3 — Edit)**: Depends on Phase 4 (reuses `category-form` from T024).
- **Phase 6 (US4 — Delete)**: Depends on Phase 3 complete (delete removes from list).
- **Phase 7 (Polish)**: Depends on Phases 3–6 complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 1+2; no dependency on other stories.
- **US2 (P2)**: Depends on US1 (needs the list page to show the created item).
- **US3 (P3)**: Depends on US2 (reuses `category-form.tsx`).
- **US4 (P4)**: Depends on US1 (needs the list page); independent of US2/US3.

### Parallel Opportunities

**Phase 1**: T002, T003 can run in parallel with T001 after the types file is created.

**Phase 2**: T009 (repository) can start immediately after T001–T004. T010 (service) after T009. T011 (controller) after T010. T012 (routes) after T011. T013 (app.ts) after T012.

**Phase 3**: T014, T015 (backend tests) run in parallel with T016, T017, T018 (dashboard). T019 (routes) after T018.

**Phase 4**: T020, T021, T022 (backend tests) run in parallel with T023, T024 (dashboard components). T025 depends on T024 existing. T026 depends on T024 + T025.

**Phase 5**: T027, T028, T029 (backend tests) parallel with T030 (hook). T031 depends on T024 + T030.

**Phase 6**: T032, T033, T034 (backend tests) parallel with T035 (dialog component). T036 depends on T035. T037 depends on T035 + T036.

**Phase 7**: All T038–T046 can run in parallel.

---

## Parallel Example: Phase 1

```bash
# After T001 (types) is done, run in parallel:
T002  packages/api-contracts/src/categories/schemas.ts
T003  packages/api-contracts/src/categories/constants.ts
# Then sequentially:
T004  packages/api-contracts/src/categories/index.ts
T005  packages/api-contracts/src/index.ts
T006  packages/api-contracts/package.json
T007  packages/api-client/src/categories.ts
T008  packages/api-client/src/index.ts
```

## Parallel Example: User Story 1

```bash
# Backend tests and dashboard code in parallel after Phase 2:
T014  backend integration test — list + pagination
T015  backend integration test — restaurant isolation
T016  apps/dashboard/src/modules/categories/api/index.ts
T017  apps/dashboard/src/modules/categories/hooks/use-categories.ts
T018  apps/dashboard/src/modules/categories/pages/categories-page.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 (shared contracts + api-client).
2. Complete Phase 2 (full API backend).
3. Complete Phase 3 (US1 list view).
4. **STOP and VALIDATE**: run `pnpm --filter api typecheck`, `pnpm --filter dashboard typecheck`, and quickstart Scenarios A–C.
5. Demo the authenticated paginated list with restaurant isolation before proceeding.

### Incremental Delivery

1. Phase 1+2 → Foundation ready.
2. Phase 3 (US1) → Authenticated users can view categories. Demo-ready MVP.
3. Phase 4 (US2) → Admin can create. List auto-refreshes.
4. Phase 6 (US4) → Admin can delete. (Can ship before edit.)
5. Phase 5 (US3) → Admin can edit (reuses create form, fastest to add after create).
6. Phase 7 → Tests + acceptance validation.

---

## Notes

- `[P]` marks tasks safe for parallel execution.
- `[US1]`–`[US4]` labels map each task to its independent user story deliverable.
- `restaurantId` is **never** sourced from request body — always from `req.auth.restaurantId`.
- Self-update uniqueness check must exclude `_id` of document being updated.
- TanStack Query cache key `['categories']` is invalidated on every successful mutation.
- No new npm dependencies required — all packages already present in both apps.
