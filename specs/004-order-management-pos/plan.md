# Implementation Plan: Order Management & POS (ORDER-001)

**Branch**: `004-order-management-pos` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-order-management-pos/spec.md`

## Summary

Implement Order Management and POS as a new vertical domain aligned with existing Auth, Categories, Kitchen Sections, and Menu Items patterns. The implementation introduces cashier-first POS order creation, draft-style pre-submit editing, kitchen status progression, cashier-scoped order visibility, and admin analytics/monitoring while preserving SRMS constitution requirements for shared contracts, restaurant isolation, role-based access, standardized error envelopes, and future extensibility.

## Technical Context

**Language/Version**: TypeScript 5.9.x across API, dashboard, and workspace packages

**Primary Dependencies**: Express 5, Mongoose 9, Zod 4, React 19, TanStack Query 5, Zustand 5, React Hook Form 7, shadcn/ui, Sonner

**Storage**: MongoDB via Mongoose (`orders`, `order_items` collections)

**Testing**: Domain-level automated tests are required once the domain test harness is in place; near-term plan includes explicit test-infra tasks plus independently testable acceptance scenarios

**Target Platform**: Node.js API server and browser-based dashboard app

**Project Type**: Monorepo web application (API + dashboard + shared packages)

**Performance Goals**: POS actions should remain interactive for cashier workflow; list and analytics endpoints should remain index-backed and keep back-office dashboard latency acceptable under normal restaurant traffic

**Constraints**: Mandatory restaurant scoping, strict role permissions (ADMIN/CASHIER/KITCHEN_STAFF), backend-authoritative totals, strict status transition validation, no app-local duplicated DTO/schema definitions

**Scale/Scope**: New orders domain in API/dashboard plus shared contract and client updates; integration-ready for future kitchen app and reporting expansion

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- ✅ Domain boundaries remain business-capability driven using a dedicated `orders` vertical slice.
- ✅ Shared contracts are centralized in `packages/api-contracts/src/orders` and consumed by both API and dashboard.
- ✅ DTO naming follows `<Entity><Action>DTO` (e.g., `CreateOrderDTO`, `UpdateOrderStatusDTO`).
- ✅ API calls live in `packages/api-client/src/orders.ts` and dashboard imports from `@srms/api-client`.
- ✅ External input validation is planned through shared Zod schemas (params, query, create/edit payloads, metrics filters).
- ✅ Authentication and authorization are explicit; protected routes use `ProtectedRoute`, role gates use `RoleGuard`.
- ✅ State ownership split is explicit: TanStack Query for server state; Zustand for session and POS cart UI state.
- ✅ Session model stays aligned (refresh cookie + in-memory access token).
- ✅ API envelope + AppError hierarchy + structured logging remain unchanged and reused.
- ✅ Real-time consideration documented (kitchen updates can emit socket events later; initial version can ship with polling).
- ✅ Testing phase is declared with deferred automation only where infra is missing, plus mandatory follow-up tasks.
- ✅ Future-proofing checklist answered with clear trade-off decisions in this plan.
- ✅ No constitution violations requiring exceptions.

### Post-Design Constitution Re-check

PASS. Generated artifacts (`research.md`, `data-model.md`, `contracts/orders-api.yaml`, `quickstart.md`) preserve shared contracts, domain boundaries, and security constraints.

## Project Structure

### Documentation (this feature)

```text
specs/004-order-management-pos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── orders-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
packages/
├── api-contracts/
│   └── src/
│       └── orders/
│           ├── order.types.ts
│           ├── schemas.ts
│           ├── routes.ts
│           └── index.ts
└── api-client/
    └── src/
        └── orders.ts

apps/
├── api/
│   └── src/
│       └── modules/
│           └── orders/
│               ├── repository/
│               ├── service/
│               ├── controller/
│               └── routes/
└── dashboard/
    └── src/
        └── modules/
            └── orders/
                ├── api/
                ├── hooks/
                ├── store/
                ├── components/
                ├── pages/
                └── schemas/
```

**Structure Decision**: Reuse the existing SRMS vertical-slice module shape from `categories`, `kitchen-section`, and `menu-item`, adding POS-specific state (`store/`) only in dashboard orders module.

## 1. Existing System Analysis

### Existing Module Structure

- API modules (`auth`, `categories`, `kitchen-section`, `menu-item`) consistently use `repository -> service -> controller -> routes`.
- Dashboard modules use `api`, `hooks`, `components`, `pages`, and occasionally `schemas`/`store`.
- `app.ts` registers domain routes under `/api/v{n}` and uses shared middleware (`requestLogger`, `notFoundHandler`, `errorHandler`).

### Shared Package Usage Patterns

- `packages/api-contracts` is the single source for DTOs, schemas, and endpoint constants/routes.
- `packages/api-client` wraps Axios calls per domain and returns typed response envelopes.
- Dashboard feature API adapters bind `authApiClient` to `@srms/api-client` functions.

### API Contract and Validation Patterns

- Route handlers apply `authenticate`, `authorize`, and shared `validate` middleware with Zod schemas from `@srms/api-contracts`.
- List endpoints use pagination query schemas and return `{ data, pagination }` inside standard success envelope.
- Service layer maps Mongoose documents to DTOs and throws typed `AppError` subclasses.

### Authentication and Restaurant Isolation Strategy

- Access token parsed in `authenticate`; context includes `userId`, `restaurantId`, `role`.
- Controllers extract `restaurantId` from auth context and never accept it from client payload.
- Repository queries always include `restaurantId` filter, preventing cross-restaurant access.

### Frontend Feature/Query/Mutation Patterns

- Route protection uses `ProtectedRoute` and `RoleGuard`.
- TanStack Query handles list/detail/mutations; successful mutations invalidate relevant keys.
- Mutation hooks surface success/error via Sonner toasts.
- Pages provide Skeleton loading, retry for error states, and empty-state CTAs.

### Reusable Patterns for ORDER-001

1. API vertical slice with thin controllers and business logic in services.
2. Shared contracts + shared client calls for all API boundaries.
3. Role checks in routes (CASHIER, KITCHEN_STAFF, ADMIN) with explicit permissions.
4. Restaurant-scoped queries in every repository function.
5. Dashboard hooks and module APIs mirroring `menu-item` feature ergonomics.

## 2. Architecture Impact

### Affected Applications

- `apps/api`: new `modules/orders` (orders + order-items operations and analytics).
- `apps/dashboard`: new orders module pages (POS, My Orders, Admin Orders/Analytics), plus route/nav integration.
- `apps/kitchen` (future): consume shared order contracts and status APIs/events without backend contract changes.

### Affected Packages

- `packages/api-contracts`: expand `src/orders` to include full DTOs, schemas, and route constants.
- `packages/api-client`: add `src/orders.ts` with order operations and analytics calls; export from package index.

### New Modules and Integrations

- New `orders` domain module in API with dependencies on `auth`, `menu-item` repository lookup, and optionally `kitchen-section` for operational enrichments.
- New dashboard `orders` module integrating with existing auth/session and shared query/mutation patterns.

### Cross-Module Dependencies

- Orders rely on Menu Items for referential validation and price snapshot source.
- Auth context provides ownership and scoping (`createdBy`, `restaurantId`).
- Kitchen status progression updates the same order aggregate and feeds admin analytics.

## 3. Domain Design Plan

### Core Entities

- **Order**: `_id`, `orderNumber`, `status`, `subtotal`, `tax`, `total`, `restaurantId`, `createdBy`, `createdAt`, `updatedAt`, optional `completedAt` (recommended now).
- **OrderItem**: `_id`, `orderId`, `menuItemId`, `quantity`, `price`, `notes`, `status`, timestamps.

### Relationships

- Order -> Restaurant (many-to-one)
- Order -> User (cashier creator, many-to-one)
- Order -> OrderItems (one-to-many)
- OrderItem -> MenuItem (many-to-one snapshot reference)

### Ownership Rules

- Cashier can create and view only own orders within same restaurant.
- Kitchen staff can update lifecycle statuses for restaurant orders.
- Admin can view all restaurant orders and analytics.

### Aggregation Strategy

- Order is aggregate root.
- Order items are created/updated through order service boundaries to guarantee total consistency.
- Financial totals are recalculated server-side from current order-item set every write path.

### Future Extensibility Decisions

- Add `completedAt` now to support accurate revenue time slicing and future SLA analytics.
- Do not persist `orderType` now (out of current scope); design DTOs/schemas to add it non-breakingly later.
- Do not persist `paymentStatus` now (payments out of scope); reserve nullable field strategy for later migration.

## 4. Database Implementation Plan

### Mongoose Models

- `OrderModel` in `orders` collection.
- `OrderItemModel` in `order_items` collection.

### Suggested Index Strategy

- Orders:
  - `{ restaurantId: 1, createdAt: -1 }` for default listing.
  - `{ restaurantId: 1, orderNumber: 1 }` unique for search and lookup.
  - `{ restaurantId: 1, status: 1, createdAt: -1 }` for status/date filtering.
  - `{ restaurantId: 1, createdBy: 1, createdAt: -1 }` for cashier-owned lists.
  - `{ restaurantId: 1, completedAt: -1 }` for revenue metrics.
- Order items:
  - `{ orderId: 1 }` for order detail hydration.
  - `{ restaurantId: 1, menuItemId: 1, createdAt: -1 }` for top-selling aggregation.

### Query Optimization and Reporting

- Use aggregation pipelines for analytics (metrics and top-selling items) with early `$match` by `restaurantId` and date range.
- Maintain status/date compound indexes to keep admin filtering and pending counts efficient.

### Referential Validation

- Validate menu item existence and same-restaurant ownership before persisting each order item.
- Snapshot item `price` at ordering time in `order_items` to preserve historical accuracy.

### Restaurant Isolation

- Include `restaurantId` in both `orders` and `order_items` documents for isolation and analytics performance.
- Scope every read/write by `restaurantId`; never trust client-provided restaurant identifier.

## 5. Order Lifecycle Plan

### Official Status Flow

`PENDING -> PREPARING -> READY -> COMPLETED`

Optional future: `CANCELLED` with guarded transition rules.

### Valid and Invalid Transitions

- Valid: only adjacent forward transitions above.
- Invalid: backward transitions, jumps, and any update after `COMPLETED` unless explicit cancellation policy is added later.

### Status Ownership

- CASHIER: creates order into `PENDING`.
- KITCHEN_STAFF: transitions `PENDING/PREPARING/READY` forward.
- ADMIN: monitor/reporting and optional override only if explicitly permitted by policy.

### Transition Logic Placement

- Transition validation and side effects live in `orders.service.ts` (not controller/repository).

## 6. POS Architecture Plan

### Cart and State Responsibilities

- Zustand (`orders/store/pos-cart.store.ts`): ephemeral cart state, item notes/quantity, computed UI totals, clear/reset actions.
- TanStack Query: menu catalog fetch, create order mutation, my-orders list/detail fetch, analytics fetch.

### Temporary Cart Handling

- V1 uses client-side draft cart (unsubmitted state) for speed and minimal clicks.
- Draft persistence in DB is deferred; no `DRAFT` order status in v1 lifecycle.

### Submission and Validation Flow

1. Cashier builds cart from menu browser.
2. Frontend performs basic guard checks (non-empty cart, positive quantity).
3. `createOrder` mutation sends normalized payload.
4. Backend validates menu items, computes totals, generates order number, persists order + items, sets `PENDING`.
5. UI confirms success and resets cart.

### POS Page Structure

- `MenuBrowserPanel`: search + category filter + quick add.
- `CartPanel`: editable item list (quantity/remove/notes).
- `OrderSummaryPanel`: subtotal/tax/total + place order + clear order.

## 7. Backend Implementation Plan

### Orders Module Responsibilities

- `routes/orders.routes.ts`
  - Define endpoints with auth/role/validate middleware.
- `controller/orders.controller.ts`
  - Extract auth context and pass validated inputs to services.
- `service/orders.service.ts`
  - Core business rules: create/edit/transition/list/analytics.
- `repository/orders.repository.ts`
  - Mongoose models + persistence/query/aggregation primitives.

### Required Operations

- Create Order
- Get Order Details
- List Orders (admin/kitchen scopes)
- Get My Orders (cashier-owned)
- Update Order Status
- Metrics summary
- Top selling items

### Error Handling

- `ValidationError`: invalid payloads/status transition/date ranges.
- `UnauthorizedError`: missing/expired auth.
- `ForbiddenError`: role or ownership violations.
- `NotFoundError`: missing order/menu item.
- `ConflictError`: duplicate order number edge collisions (if any).

## 8. API Contract Plan

### Endpoints (proposed)

- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
- `GET /orders/my`
- `PATCH /orders/:id/status`
- `GET /orders/metrics`
- `GET /orders/top-selling`

### List/Report Query Capabilities

- Pagination: `page`, `limit`
- Search: `search` by order number
- Filters: `status`, `createdBy`, `from`, `to`
- Sorting: default `createdAt desc`; optional explicit sort parameters

### Response Convention

- Reuse standard envelope:
  - success: `{ success: true, message, data }`
  - error: `{ success: false, message, errors }`

## 9. Analytics Plan

### Required Metrics

- Total Revenue (sum of `total` for completed orders)
- Total Orders (count)
- Pending Orders (count for `PENDING` + `PREPARING`)
- Top Selling Items (sum quantities by `menuItemId`, include item name)

### Aggregation Strategy

- Use MongoDB aggregation pipelines with mandatory leading `$match` on `restaurantId` and date range.
- Revenue/pending/total metrics can be computed in one pipeline using `$group` with conditional sums.
- Top selling uses `order_items` aggregation grouped by `menuItemId` with post-lookup for item labels.

### Performance Considerations

- Keep date range required or defaulted to avoid unbounded scans.
- Ensure compound indexes support primary match patterns.

## 10. Frontend Implementation Plan

### Required Pages

- CASHIER:
  - POS Screen
  - My Orders
- ADMIN:
  - Orders Management
  - Order Details panel/page
  - Dashboard analytics widgets/cards

### Route Structure

- Protected routes for all order pages.
- Role-guarded sections:
  - CASHIER-only POS/My Orders
  - ADMIN-only monitoring/analytics routes

### Data Strategy

- Query keys scoped by feature (`orders`, `order-metrics`, `top-selling`).
- Mutations invalidate minimally required queries to keep UI fast.
- Reuse existing loading/error/empty state design patterns.

### UI and Interaction Patterns

- Sheet/dialog detail interactions similar to current admin modules where appropriate.
- Fast cashier interactions prioritized: single-click add, inline quantity controls, clear feedback.

## 11. Shared Packages Plan

### `packages/api-contracts/src/orders`

- Expand from current enum-only contract to include:
  - `order.types.ts`: Order, OrderItem, OrderMetrics, TopSellingItem, list/detail DTOs
  - `schemas.ts`: CreateOrderSchema, UpdateOrderStatusSchema, OrderFiltersSchema, MetricsQuerySchema
  - `routes.ts`: `ORDER_ENDPOINTS`
  - `index.ts`: consolidated exports

### `packages/api-client/src/orders.ts`

- Add typed API functions:
  - `createOrder`
  - `getOrders`
  - `getMyOrders`
  - `getOrderById`
  - `updateOrderStatus`
  - `getOrderMetrics`
  - `getTopSellingItems`

### Alignment Note on Requested Legacy Packages

- Requested `packages/types`, `packages/schemas`, `packages/constants` are constitution-retired in this repo.
- Equivalent responsibilities are implemented under `packages/api-contracts` to remain compliant.

## 12. Security & Authorization Plan

### Permission Matrix

- CASHIER: create order, edit in-progress cart, view own orders.
- KITCHEN_STAFF: view restaurant orders needed for prep, update allowed statuses.
- ADMIN: view all restaurant orders, analytics, monitoring.

### Enforcement Strategy

- Route-level `authorize` guards for role permissions.
- Service/repository-level ownership and restaurant scope checks.
- Cashier “my orders” endpoint hard-filters by `createdBy = auth.userId`.

### Protections

- No cross-restaurant read/write.
- No unauthorized status changes.
- No unauthorized access to non-owned cashier orders.

## 13. Future Extensibility

### Planned Future Features Considered

- Dine-in/takeaway/delivery
- Payments and invoicing
- Customer ordering channels
- Inventory integration
- Multi-branch scale

### Decisions to Avoid Breaking Changes

- Use aggregate root (`Order`) + line items (`OrderItem`) with stable IDs and immutable price snapshots.
- Keep status engine centralized in service so new statuses/transitions can be added safely.
- Design contract DTOs with additive evolution paths.

### Field Introduction Recommendation

- `orderType`: **Not now** (out of v1 scope), but reserve additive migration path.
- `paymentStatus`: **Not now** (payments out of scope), add when payment domain lands.
- `completedAt`: **Add now** to support accurate revenue/reporting windows and future SLAs.

## 14. Recommended Development Sequence

1. Finalize shared order contracts in `api-contracts`.
2. Add order API client functions in `api-client`.
3. Implement Mongoose models + repository primitives.
4. Implement service-layer business logic and lifecycle validation.
5. Wire controllers/routes and integrate in `app.ts`.
6. Build cashier POS store and page shell.
7. Add create-order and my-orders hooks/pages.
8. Add kitchen/admin status update flows.
9. Add admin orders table with filters/search/date range.
10. Add analytics endpoints and dashboard widgets.
11. Integrate route guards/navigation and finalize UX states.
12. Complete validation, QA scenarios, and domain tests/tasks.

**Why this order**: It builds contract-first, keeps backend consistency before UI coupling, and delivers cashier value early while enabling admin analytics incrementally.

## 15. Definition of Completion

ORDER-001 is complete when all of the following are true:

- POS cashier flow supports browse/search/add/edit cart and place order.
- My Orders shows cashier-owned orders only with status and filters.
- Kitchen/Admin status updates enforce valid transitions only.
- Admin order monitoring table supports date/status/search filters.
- Admin analytics show total revenue, total orders, pending orders, and top-selling items by date range.
- Backend enforces restaurant isolation and role authorization on every endpoint.
- Shared contracts and client APIs are fully implemented with no app-local contract duplication.
- API responses and errors follow SRMS envelope + AppError conventions.
- Quickstart scenarios execute successfully end-to-end.
- Tasks for test infrastructure and ORDER-001 test coverage are defined for the next phase.

## Complexity Tracking

No constitution violations requiring exception records.
