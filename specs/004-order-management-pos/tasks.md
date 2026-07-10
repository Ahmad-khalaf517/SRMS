# Tasks: Order Management & POS (ORDER-001)

**Input**: Design documents from `specs/004-order-management-pos/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/orders-api.yaml`, `quickstart.md`

**Tests**: Domain is currently in deferred-with-plan mode. This task list includes explicit test-readiness tasks and executable quickstart validation tasks; automation tasks are staged once the domain test harness is enabled.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize shared contracts and API client surfaces for orders domain.

- [x] T001 Expand orders domain types in packages/api-contracts/src/orders/order.types.ts
- [x] T002 Add orders Zod schemas in packages/api-contracts/src/orders/schemas.ts
- [x] T003 Add orders route constants in packages/api-contracts/src/orders/routes.ts
- [x] T004 Export orders schemas/routes in packages/api-contracts/src/orders/index.ts
- [x] T005 Export orders domain from packages/api-contracts/src/index.ts
- [x] T006 Create orders API methods in packages/api-client/src/orders.ts
- [x] T007 Export orders client API in packages/api-client/src/index.ts
- [x] T008 [P] Align package exports for orders files in packages/api-contracts/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core orders backend/frontend scaffolding that all stories depend on.

**⚠️ CRITICAL**: No user story work should begin before this phase is complete.

- [x] T009 Create orders repository base and models in apps/api/src/modules/orders/repository/orders.repository.ts
- [x] T010 [P] Add order and order-item indexes in apps/api/src/modules/orders/repository/orders.repository.ts
- [x] T011 Create orders service scaffolding in apps/api/src/modules/orders/service/orders.service.ts
- [x] T012 [P] Create orders controller scaffolding in apps/api/src/modules/orders/controller/orders.controller.ts
- [x] T013 Create orders routes scaffolding in apps/api/src/modules/orders/routes/orders.routes.ts
- [x] T014 Register orders routes in apps/api/src/app.ts
- [x] T015 Create dashboard orders API adapter in apps/dashboard/src/modules/orders/api/index.ts
- [x] T016 [P] Create orders hook barrel and skeleton exports in apps/dashboard/src/modules/orders/hooks/index.ts
- [x] T017 Create POS cart store scaffold in apps/dashboard/src/modules/orders/store/pos-cart.store.ts
- [x] T018 Add shared orders route entries in apps/dashboard/src/app/constants/nav-links.ts
- [x] T019 Register protected order routes in apps/dashboard/src/app/routes/app-routes.tsx
- [x] T020 Define ORDER-001 test readiness plan in specs/004-order-management-pos/tasks.md

**Checkpoint**: Foundation ready. User stories can be implemented independently.

---

## Phase 3: User Story 1 - Cashier Create and Place POS Order (Priority: P1) 🎯 MVP

**Goal**: Cashier can browse/search menu items, build cart, and place an order that persists as Pending with generated order number.

**Independent Test**: Login as cashier, add menu items, place order, verify persisted order number and `PENDING` status.

### Implementation for User Story 1

- [x] T021 [US1] Implement create-order repository operation in apps/api/src/modules/orders/repository/orders.repository.ts
- [x] T022 [US1] Implement create-order business logic (totals, numbering, price snapshot) in apps/api/src/modules/orders/service/orders.service.ts
- [x] T023 [US1] Implement create-order controller in apps/api/src/modules/orders/controller/orders.controller.ts
- [x] T024 [US1] Wire POST /orders endpoint with auth/validation in apps/api/src/modules/orders/routes/orders.routes.ts
- [x] T025 [P] [US1] Add create-order request schema and DTO in packages/api-contracts/src/orders/schemas.ts
- [x] T026 [P] [US1] Add createOrder client method in packages/api-client/src/orders.ts
- [x] T027 [P] [US1] Implement POS menu browser component in apps/dashboard/src/modules/orders/components/pos-menu-browser.tsx
- [x] T028 [P] [US1] Implement POS order summary component in apps/dashboard/src/modules/orders/components/pos-order-summary.tsx
- [x] T029 [US1] Implement place-order mutation hook in apps/dashboard/src/modules/orders/hooks/use-create-order.ts
- [x] T030 [US1] Implement POS page composition in apps/dashboard/src/modules/orders/pages/pos-page.tsx
- [x] T031 [US1] Implement cart-to-payload mapping utility in apps/dashboard/src/modules/orders/schemas/pos-order.schema.ts
- [x] T032 [US1] Add cashier POS route guard wiring in apps/dashboard/src/app/routes/app-routes.tsx

**Checkpoint**: Cashier can place a valid order end-to-end.

---

## Phase 4: User Story 2 - Cashier Edit Draft Order Before Submission (Priority: P1)

**Goal**: Cashier can modify in-progress cart contents, quantities, and notes before placing order.

**Independent Test**: Build a draft cart, edit items and notes, verify totals and final placed payload reflect edits.

### Implementation for User Story 2

- [x] T033 [US2] Implement add/remove cart item actions in apps/dashboard/src/modules/orders/store/pos-cart.store.ts
- [x] T034 [US2] Implement quantity update and note update actions in apps/dashboard/src/modules/orders/store/pos-cart.store.ts
- [x] T035 [US2] Implement clear-cart and reset-after-submit actions in apps/dashboard/src/modules/orders/store/pos-cart.store.ts
- [x] T036 [P] [US2] Implement cart item editor component in apps/dashboard/src/modules/orders/components/pos-cart-item-row.tsx
- [x] T037 [P] [US2] Implement cart list component in apps/dashboard/src/modules/orders/components/pos-cart-panel.tsx
- [x] T038 [US2] Integrate editable cart panel into POS page in apps/dashboard/src/modules/orders/pages/pos-page.tsx
- [x] T039 [US2] Add client-side guards for empty cart and invalid quantity in apps/dashboard/src/modules/orders/pages/pos-page.tsx

**Checkpoint**: Draft cart editing works independently before order submission.

---

## Phase 5: User Story 3 - Cashier View My Orders (Priority: P2)

**Goal**: Cashier can view only their own orders with status and search filtering.

**Independent Test**: Create orders under two cashiers and verify My Orders isolates by creator.

### Implementation for User Story 3

- [x] T040 [US3] Implement my-orders query in repository with createdBy filter in apps/api/src/modules/orders/repository/orders.repository.ts
- [x] T041 [US3] Implement my-orders service method in apps/api/src/modules/orders/service/orders.service.ts
- [x] T042 [US3] Implement my-orders controller in apps/api/src/modules/orders/controller/orders.controller.ts
- [x] T043 [US3] Wire GET /orders/my endpoint with query validation in apps/api/src/modules/orders/routes/orders.routes.ts
- [x] T044 [P] [US3] Add my-orders query schema in packages/api-contracts/src/orders/schemas.ts
- [x] T045 [P] [US3] Add getMyOrders API client method in packages/api-client/src/orders.ts
- [x] T046 [US3] Implement use-my-orders hook in apps/dashboard/src/modules/orders/hooks/use-my-orders.ts
- [x] T047 [US3] Implement cashier My Orders page in apps/dashboard/src/modules/orders/pages/my-orders-page.tsx
- [x] T048 [US3] Add cashier My Orders route in apps/dashboard/src/app/routes/app-routes.tsx

**Checkpoint**: Cashier order visibility is isolated and filterable.

---

## Phase 6: User Story 4 - Kitchen Updates Order Progress (Priority: P2)

**Goal**: Kitchen staff can progress order statuses through valid transitions only.

**Independent Test**: Update one order through full lifecycle and verify invalid jumps are rejected.

### Implementation for User Story 4

- [x] T049 [US4] Implement status transition guard utility in apps/api/src/modules/orders/service/orders.service.ts
- [x] T050 [US4] Implement update-status repository operation in apps/api/src/modules/orders/repository/orders.repository.ts
- [x] T051 [US4] Implement update-status service method with ownership and transition checks in apps/api/src/modules/orders/service/orders.service.ts
- [x] T052 [US4] Implement update-status controller in apps/api/src/modules/orders/controller/orders.controller.ts
- [x] T053 [US4] Wire PATCH /orders/:id/status endpoint with role guard in apps/api/src/modules/orders/routes/orders.routes.ts
- [x] T054 [P] [US4] Add update-status schema/DTO in packages/api-contracts/src/orders/schemas.ts
- [x] T055 [P] [US4] Add updateOrderStatus API client method in packages/api-client/src/orders.ts
- [x] T056 [US4] Implement use-update-order-status hook in apps/dashboard/src/modules/orders/hooks/use-update-order-status.ts
- [x] T057 [US4] Implement kitchen order status board page in apps/dashboard/src/modules/orders/pages/kitchen-orders-page.tsx
- [x] T058 [US4] Add kitchen staff route guard entries in apps/dashboard/src/app/routes/app-routes.tsx

**Checkpoint**: Kitchen status progression is enforced and operational.

---

## Phase 7: User Story 5 - Admin Monitor Orders and Analytics (Priority: P3)

**Goal**: Admin can monitor all restaurant orders and view revenue/operational metrics with date filtering.

**Independent Test**: Apply date/status filters in admin pages and validate table + metrics + top-selling values.

### Implementation for User Story 5

- [x] T059 [US5] Implement admin list-orders repository query with filters/sort/pagination in apps/api/src/modules/orders/repository/orders.repository.ts
- [x] T060 [US5] Implement order metrics aggregation in apps/api/src/modules/orders/repository/orders.repository.ts
- [x] T061 [US5] Implement top-selling aggregation in apps/api/src/modules/orders/repository/orders.repository.ts
- [x] T062 [US5] Implement list/metrics/top-selling service methods in apps/api/src/modules/orders/service/orders.service.ts
- [x] T063 [US5] Implement list/metrics/top-selling controllers in apps/api/src/modules/orders/controller/orders.controller.ts
- [x] T064 [US5] Wire GET /orders, GET /orders/metrics, GET /orders/top-selling in apps/api/src/modules/orders/routes/orders.routes.ts
- [x] T065 [P] [US5] Add list/filter/metrics schemas in packages/api-contracts/src/orders/schemas.ts
- [x] T066 [P] [US5] Add getOrders/getOrderMetrics/getTopSellingItems methods in packages/api-client/src/orders.ts
- [x] T067 [US5] Implement admin orders hook in apps/dashboard/src/modules/orders/hooks/use-orders.ts
- [x] T068 [US5] Implement admin metrics hooks in apps/dashboard/src/modules/orders/hooks/use-order-metrics.ts
- [x] T069 [US5] Implement admin orders table page in apps/dashboard/src/modules/orders/pages/admin-orders-page.tsx
- [x] T070 [US5] Implement analytics cards and top-selling component in apps/dashboard/src/modules/orders/components/order-analytics-cards.tsx
- [x] T071 [US5] Integrate admin dashboard order analytics widgets in apps/dashboard/src/modules/dashboard/pages/dashboard-page.tsx
- [x] T072 [US5] Add admin orders route and nav entry wiring in apps/dashboard/src/app/routes/app-routes.tsx

**Checkpoint**: Admin monitoring and analytics are independently functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, validation, and documentation.

- [x] T073 [P] Add ORDER-001 API docs notes in specs/004-order-management-pos/contracts/orders-api.yaml
- [x] T074 Enforce consistent AppError mapping for orders domain in apps/api/src/modules/orders/service/orders.service.ts
- [x] T075 [P] Add structured logger events for order lifecycle transitions in apps/api/src/modules/orders/controller/orders.controller.ts
- [ ] T076 Validate all quickstart scenarios and record outcomes in specs/004-order-management-pos/quickstart.md
- [x] T077 [P] Add domain test scaffolding placeholders for future automation in apps/api/src/modules/orders/tests/README.md
- [x] T078 Run full typecheck across workspace from package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion and blocks all stories.
- **Phases 3-7 (User Stories)**: Depend on Phase 2 completion.
- **Phase 8 (Polish)**: Depends on completion of selected user stories.

### User Story Dependencies

- **US1 (P1)**: Starts immediately after Foundational phase.
- **US2 (P1)**: Depends on POS/cart scaffolding from US1 but is independently testable.
- **US3 (P2)**: Depends on foundational orders list contracts; independent from US4/US5.
- **US4 (P2)**: Depends on core order persistence from US1.
- **US5 (P3)**: Depends on order creation and status data flows from US1/US4.

### Suggested Story Completion Order

1. US1
2. US2
3. US3
4. US4
5. US5

## Parallel Execution Examples

### User Story 1

- T025 and T026 can run in parallel after T001-T007.
- T027 and T028 can run in parallel after T017.

### User Story 2

- T036 and T037 can run in parallel after T033-T035.

### User Story 3

- T044 and T045 can run in parallel after base order contracts are in place.

### User Story 4

- T054 and T055 can run in parallel after transition rules are finalized.

### User Story 5

- T060 and T061 can run in parallel after analytics data model is finalized.
- T067 and T068 can run in parallel after backend analytics endpoints are available.

## Implementation Strategy

### MVP First (US1)

1. Complete Phases 1 and 2.
2. Deliver Phase 3 (US1) end-to-end.
3. Validate with quickstart Scenario A before expanding scope.

### Incremental Delivery

1. Add US2 for full cashier pre-submit editing.
2. Add US3 for cashier operational visibility.
3. Add US4 for kitchen progress lifecycle.
4. Add US5 for admin monitoring and analytics.

### Validation Milestones

1. After US1: POS create/place works.
2. After US3: cashier visibility and isolation validated.
3. After US4: status lifecycle guard validated.
4. After US5: analytics and monitoring validated.

## Notes

- `[P]` marks tasks that can be executed in parallel safely.
- `[USx]` labels map tasks directly to user stories from `spec.md`.
- All tasks include concrete file paths so execution is immediately actionable.
- Automation test tasks are intentionally staged for readiness because the domain remains in deferred-with-plan mode.
