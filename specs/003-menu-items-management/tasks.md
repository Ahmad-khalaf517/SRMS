# Tasks: Menu Items Management (MENU-001)

**Input**: Design documents from `specs/003-menu-items-management/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/menu-item-api.yaml`

**Tests**: Automated tests are required for this domain. Because the repository currently lacks a standardized test runner, this task list includes test-infrastructure work as a blocking prerequisite before menu-item tests can be added.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (`[US1]` ... `[US5]`) for story-specific tasks only
- Each task includes an exact file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add shared menu-item contracts and API client support before application code starts.

- [x] T001 Add `packages/api-contracts/src/menu-item/menu-item.types.ts` with `MenuItem`, `MenuItemListItem`, `CreateMenuItemDTO`, `UpdateMenuItemDTO`, `MenuItemFiltersDTO`, and menu-item response envelope types
- [x] T002 [P] Add `packages/api-contracts/src/menu-item/schemas.ts` with `CreateMenuItemSchema`, `UpdateMenuItemSchema`, `MenuItemFiltersSchema`, and route-param validation schema(s)
- [x] T003 [P] Add `packages/api-contracts/src/menu-item/routes.ts` (or `constants.ts`) with `MENU_ITEM_ENDPOINTS` route constants following existing Categories and Kitchen Sections patterns
- [x] T004 Add `packages/api-contracts/src/menu-item/index.ts` barrel exporting menu-item types, schemas, and route constants
- [x] T005 Update `packages/api-contracts/src/index.ts` to export the new `menu-item` domain
- [x] T006 Update `packages/api-contracts/package.json` exports to add `./menu-item`
- [x] T007 Add `packages/api-client/src/menu-item.ts` with `getMenuItems`, `getMenuItemById`, `createMenuItem`, `updateMenuItem`, `toggleMenuItemAvailability`, and `deleteMenuItem`
- [x] T008 Update `packages/api-client/src/index.ts` to export `./menu-item.js`

**Checkpoint**: `pnpm --filter @srms/api-contracts typecheck` and `pnpm --filter @srms/api-client typecheck` pass.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build backend foundations and establish test infrastructure required by constitution before user story work proceeds.

**⚠️ CRITICAL**: No user story implementation should begin before this phase completes.

- [ ] T009 Add automated test infrastructure configuration for the repo in `package.json`, `apps/api/package.json`, `apps/dashboard/package.json`, and any required config files so backend and frontend tests can be executed consistently
- [x] T010 Add `apps/api/src/modules/menu-item/repository/menu-item.repository.ts` with Mongoose schema, indexes, model, and repository functions (`findMenuItemsByRestaurant`, `findMenuItemById`, `createMenuItem`, `updateMenuItemById`, `deleteMenuItemById`, `toggleMenuItemAvailability`)
- [x] T011 Add `apps/api/src/modules/menu-item/service/menu-item.service.ts` with restaurant-scoped CRUD, detail, search, filter, toggle, DTO mapping, and referential validation against Categories and Kitchen Sections
- [x] T012 Add `apps/api/src/modules/menu-item/controller/menu-item.controller.ts` with list, detail, create, update, toggle, and delete handlers using `sendSuccess`
- [x] T013 Add `apps/api/src/modules/menu-item/routes/menu-item.routes.ts` wiring `authenticate`, `authorize`, and `validate` middleware to all menu-item endpoints
- [x] T014 Update `apps/api/src/app.ts` to register menu-item routes under the existing API base path

**Checkpoint**: Shared contracts, test infrastructure, and the API module exist. `pnpm --filter api typecheck` passes.

---

## Phase 3: User Story 1 - View Menu Items List (Priority: P1) 🎯 MVP

**Goal**: Admins can view a paginated, restaurant-scoped list of menu items with category, kitchen section, price, and availability information.

**Independent Test**: Log in as an admin, open `/menu-items`, and verify only current-restaurant items are listed with correct pagination and visible category/kitchen-section labels.

### Tests for User Story 1 ⚠️

- [ ] T015 [P] [US1] Add backend integration tests for `GET /menu-items` pagination and restaurant isolation in the chosen API test location/config introduced by T009
- [ ] T016 [P] [US1] Add frontend tests for menu-items list rendering, loading state, empty state, and pagination behavior in the chosen dashboard test location/config introduced by T009

### Implementation for User Story 1

- [x] T017 [P] [US1] Add `apps/dashboard/src/modules/menu-item/api/index.ts` with thin wrappers that bind `authApiClient` to the menu-item API client functions
- [x] T018 [P] [US1] Add `apps/dashboard/src/modules/menu-item/hooks/use-menu-items.ts` using TanStack Query for list retrieval with pagination, search, and filter inputs
- [x] T019 [US1] Add `apps/dashboard/src/modules/menu-item/pages/menu-items-page.tsx` with paginated table UI, skeleton loading, empty state, error state, and visible columns: Name, Category, Kitchen Section, Price, Availability Status, Created Date, Actions
- [x] T020 [US1] Update `apps/dashboard/src/app/routes/app-routes.tsx` and `apps/dashboard/src/app/constants/nav-links.ts` to register the `/menu-items` route and admin navigation entry using existing ProtectedRoute/RoleGuard patterns

**Checkpoint**: The menu-items list page is independently functional and demo-ready.

---

## Phase 4: User Story 2 - Create Menu Item (Priority: P2)

**Goal**: Admins can create a menu item with category and kitchen section selections; the new item defaults to available and appears in the list.

**Independent Test**: Submit a valid create form and confirm the new row appears with the correct category, kitchen section, price, and `isAvailable=true`.

### Tests for User Story 2 ⚠️

- [ ] T021 [P] [US2] Add backend tests for `POST /menu-items` success, invalid price rejection, missing relationship rejection, and non-admin forbidden access
- [ ] T022 [P] [US2] Add frontend tests for create form validation, dropdown loading, submit loading state, success feedback, and error handling

### Implementation for User Story 2

- [x] T023 [P] [US2] Add `apps/dashboard/src/modules/menu-item/schemas/menu-item-form.schema.ts` wrapping shared create/update schemas for React Hook Form usage
- [x] T024 [P] [US2] Add `apps/dashboard/src/modules/menu-item/hooks/use-create-menu-item.ts` using TanStack Query mutation with success/error notifications and list invalidation
- [x] T025 [P] [US2] Add `apps/dashboard/src/modules/menu-item/components/menu-item-form.tsx` with fields for name, description, price, category, kitchen section, and availability, including category/kitchen-section dropdown data loading
- [x] T026 [US2] Update `apps/dashboard/src/modules/menu-item/pages/menu-items-page.tsx` to add create-menu-item flow (Sheet/dialog), create button visibility for admins only, and post-create list refresh

**Checkpoint**: Admin can create a menu item end-to-end and non-admin attempts are rejected.

---

## Phase 5: User Story 3 - Update and Toggle Availability (Priority: P3)

**Goal**: Admins can edit menu item details and toggle availability from the management UI.

**Independent Test**: Edit an item, save changes, toggle availability, and verify the list/detail reflect the new values immediately and after refresh.

### Tests for User Story 3 ⚠️

- [ ] T027 [P] [US3] Add backend tests for `PATCH /menu-items/:id` update success, cross-restaurant rejection, and `PATCH /menu-items/:id/availability` toggle behavior
- [ ] T028 [P] [US3] Add frontend tests for edit flow, availability toggle interaction, success notification, and persisted list refresh

### Implementation for User Story 3

- [x] T029 [P] [US3] Add `apps/dashboard/src/modules/menu-item/hooks/use-update-menu-item.ts` and `apps/dashboard/src/modules/menu-item/hooks/use-toggle-menu-item-availability.ts` with mutation + invalidation behavior
- [x] T030 [US3] Update `apps/dashboard/src/modules/menu-item/pages/menu-items-page.tsx` to support edit flow, prefilled form state, and inline availability toggle controls for admins

**Checkpoint**: Update and toggle availability are independently functional.

---

## Phase 6: User Story 4 - Search, Filter, and View Details (Priority: P4)

**Goal**: Admins can search menu items by name, filter them by category/kitchen section/availability, and open a detail view for a specific item.

**Independent Test**: Search and filter produce correct subsets, and opening a detail view shows the full menu-item record scoped to the current restaurant.

### Tests for User Story 4 ⚠️

- [ ] T031 [P] [US4] Add backend tests for search, category filter, kitchen section filter, availability filter, and detail endpoint restaurant scoping
- [ ] T032 [P] [US4] Add frontend tests for search input behavior, filter UI behavior, detail-view loading, and empty results handling

### Implementation for User Story 4

- [x] T033 [P] [US4] Add `apps/dashboard/src/modules/menu-item/hooks/use-menu-item.ts` for single-item detail retrieval
- [x] T034 [US4] Update `apps/dashboard/src/modules/menu-item/pages/menu-items-page.tsx` and/or add a dedicated detail page/component to support name search, filter toolbar, and menu-item detail viewing while following Categories/Kitchen Sections UI conventions

**Checkpoint**: Search, filters, and detail view all work without breaking the main list flow.

---

## Phase 7: User Story 5 - Delete Menu Item (Priority: P5)

**Goal**: Admins can remove obsolete menu items after explicit confirmation.

**Independent Test**: Delete an item after confirmation, confirm it disappears from active list results, and verify cancellation does not remove it.

### Tests for User Story 5 ⚠️

- [ ] T035 [P] [US5] Add backend tests for `DELETE /menu-items/:id` success, non-admin forbidden access, and cross-restaurant not-found behavior
- [ ] T036 [P] [US5] Add frontend tests for delete confirmation dialog, cancel path, confirm path, and post-delete list refresh

### Implementation for User Story 5

- [x] T037 [P] [US5] Add `apps/dashboard/src/modules/menu-item/hooks/use-delete-menu-item.ts` with mutation, notifications, and list invalidation
- [x] T038 [P] [US5] Add `apps/dashboard/src/modules/menu-item/components/delete-menu-item-dialog.tsx` following the delete-confirmation pattern from Categories and Kitchen Sections
- [x] T039 [US5] Update `apps/dashboard/src/modules/menu-item/pages/menu-items-page.tsx` to wire delete actions, confirmation dialog flow, and list refresh after successful deletion

**Checkpoint**: Delete flow is complete and independently verifiable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, consistency checks, validation runs, and doc alignment.

- [ ] T040 [P] Update `specs/003-menu-items-management/quickstart.md` with any final endpoint or UX refinements discovered during implementation
- [ ] T041 [P] Run `pnpm --filter @srms/api-contracts typecheck`, `pnpm --filter @srms/api-client typecheck`, `pnpm --filter api typecheck`, and `pnpm --filter dashboard typecheck` and record results in `specs/003-menu-items-management/quickstart.md`
- [ ] T042 [P] Verify navigation, route protection, and role-based action visibility match Categories and Kitchen Sections patterns in `apps/dashboard/src/app/constants/nav-links.ts`, `apps/dashboard/src/app/routes/app-routes.tsx`, and `apps/dashboard/src/components/nav-main.tsx`
- [ ] T043 Perform a consistency review across `apps/api/src/modules/categories`, `apps/api/src/modules/kitchen-section`, and the new menu-item module to remove any unnecessary deviations in DX, naming, or API conventions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies, starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion and blocks all user stories.
- **Phases 3–7 (User Stories)**: Depend on Phase 2 completion.
- **Phase 8 (Polish)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts first after foundational work and is the MVP.
- **US2 (P2)**: Depends on US1 list/page existing so newly created items can be displayed immediately.
- **US3 (P3)**: Depends on US2 form/mutation patterns for reuse in edit flow.
- **US4 (P4)**: Depends on US1 list API and page but can be developed partially in parallel with US3 after foundational hooks exist.
- **US5 (P5)**: Depends on US1 list/page and uses the established mutation + dialog pattern from US2/US3.

### Within Each User Story

- Tests should be added before or alongside implementation as soon as the test infrastructure from Phase 2 exists.
- Repository/model work before service.
- Service before controller/routes.
- Shared hooks/components before full page integration.

### Parallel Opportunities

- **Phase 1**: T002 and T003 parallel after T001 context is established.
- **Phase 2**: T010–T014 are mostly sequential inside API, but T009 (test infrastructure) can proceed in parallel with repository/service work.
- **US1**: T015 and T016 can run in parallel with T017 and T018 once foundational APIs exist.
- **US2**: T021 and T022 can run in parallel with T023–T025.
- **US3**: T027 and T028 can run in parallel with T029.
- **US4**: T031 and T032 can run in parallel with T033.
- **US5**: T035 and T036 can run in parallel with T037 and T038.
- **Phase 8**: T040–T043 can run in parallel after implementation stabilizes.

---

## Parallel Example: User Story 2

```bash
# Tests and frontend building in parallel after foundational API exists
Task: "Add backend tests for POST /menu-items success, invalid price rejection, missing relationship rejection, and non-admin forbidden access"
Task: "Add frontend tests for create form validation, dropdown loading, submit loading state, success feedback, and error handling"
Task: "Add apps/dashboard/src/modules/menu-item/schemas/menu-item-form.schema.ts"
Task: "Add apps/dashboard/src/modules/menu-item/hooks/use-create-menu-item.ts"
Task: "Add apps/dashboard/src/modules/menu-item/components/menu-item-form.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 shared contracts and API client.
2. Complete Phase 2 foundational backend and test-infrastructure setup.
3. Complete Phase 3 list view.
4. Stop and validate the menu-items list, pagination, and restaurant isolation.

### Incremental Delivery

1. Foundation + list page
2. Create flow
3. Update + toggle availability
4. Search/filter/detail
5. Delete flow
6. Polish and validation

### Parallel Team Strategy

1. Engineer A: shared contracts + api-client
2. Engineer B: backend menu-item module
3. Engineer C: dashboard menu-item module
4. Once the API surface stabilizes, split into create/edit/toggle/delete/search-filter tasks in parallel

---

## Notes

- The current repository does **not** yet contain standardized automated test tooling; Phase 2 must account for that before test tasks can be considered complete.
- Menu Items must follow Categories and Kitchen Sections as the reference implementation for naming, route shape, table UX, and mutation feedback.
- `restaurantId` is always derived from auth context and never accepted from the client.
- `categoryId` and `kitchenSectionId` must be validated against same-restaurant ownership before persistence.
