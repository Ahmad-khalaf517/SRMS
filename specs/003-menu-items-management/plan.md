# Implementation Plan: Menu Items Management (MENU-001)

**Branch**: `003-menu-items-management` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-menu-items-management/spec.md`

## Summary

Implement a full restaurant-scoped Menu Items management feature for admins using the same vertical-slice architecture, API conventions, validation flow, dashboard UX, and shared package strategy already established by the Categories and Kitchen Sections features. The feature will introduce list, detail, create, update, delete, search, filter, and availability toggle flows while keeping Menu Items ready for future ordering, inventory, customization, and promotion features.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9.x across API, dashboard, and shared packages

**Primary Dependencies**: Express 5, Mongoose 9, Zod 4, React 19, React Hook Form 7, TanStack Query 5, Zustand 5, shadcn/ui, Sonner

**Storage**: MongoDB via Mongoose (`menu_items` collection)

**Testing**: Automated tests required by constitution for this domain, but current repository lacks test runner infrastructure; implementation plan must include adding/standardizing test infrastructure or an explicit prerequisite task

**Target Platform**: Node.js API server and modern browser dashboard app

**Project Type**: Monorepo web application feature slice

**Performance Goals**: Paginated list and filtered search requests should stay within normal back-office interactive latency; list queries must remain index-backed and restaurant-scoped

**Constraints**: Restaurant isolation on every operation, positive numeric pricing only, category and kitchen section references must be same-restaurant valid, no duplicated contract definitions, align closely with Categories and Kitchen Sections implementation

**Scale/Scope**: One new CRUD management module in API and dashboard plus additions to `packages/api-contracts` and `packages/api-client`; foundational for future order system

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- ✅ Domain boundaries defined by business capability — `modules/menu-item` in API/dashboard, no layer-first drift.
- ✅ Shared contracts identified and located in `packages/api-contracts/src/menu-item/`.
- ✅ DTO naming will follow `<Entity><Action>DTO`: `CreateMenuItemDTO`, `UpdateMenuItemDTO`, `MenuItemFiltersDTO`.
- ✅ API client functions will live in `packages/api-client/src/menu-item.ts`.
- ✅ Validation plan covers create, update, params, query/search/filter inputs using shared Zod schemas.
- ✅ Auth and authorization explicitly captured; frontend uses `ProtectedRoute` and admin-only access uses `RoleGuard` where the route is admin-only.
- ✅ State ownership split: TanStack Query for list/detail/mutations; Zustand only for session.
- ✅ Session strategy unchanged: refresh cookie + in-memory access token.
- ✅ API envelope, AppError hierarchy, and structured logging strategy reused from existing API infrastructure.
- ✅ Real-time not required for v1 Menu Items management.
- ✅ Testing phase declared: automation required, but current repo lacks runner and must add or standardize test tooling as prerequisite.
- ✅ Future-proofing answers are all YES in the spec.
- ✅ No constitution exceptions identified.

### Post-Design Constitution Re-check

PASS. Research, data model, API contract, and quickstart preserve architecture consistency with Categories/Kitchen Sections while following constitution v1.1.0.

## Project Structure

### Documentation (this feature)

```text
specs/003-menu-items-management/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── menu-item-api.yaml
└── tasks.md
```

```text
packages/
├── api-contracts/
│   └── src/
│       └── menu-item/
│           ├── menu-item.types.ts
│           ├── schemas.ts
│           ├── routes.ts or constants.ts
│           └── index.ts
└── api-client/
    └── src/
        └── menu-item.ts

apps/
├── api/
│   └── src/
│       └── modules/
│           └── menu-item/
│               ├── controller/
│               ├── service/
│               ├── repository/
│               └── routes/
└── dashboard/
    └── src/
        └── modules/
            └── menu-item/
                ├── api/
                ├── hooks/
                ├── components/
                ├── schemas/
                └── pages/
```

**Structure Decision**: Follow the exact structure already used by Categories and Kitchen Sections. Menu Items should feel like the third management module in the same family rather than a new architectural pattern.

## 1. Existing Module Analysis

### Categories

- **Folder structure**
  - API: `modules/categories/{repository,service,controller,routes}`
  - Dashboard: `modules/categories/{api,hooks,components,schemas,pages}`
- **API patterns**
  - One repository file owns Mongoose schema + indexes + query helpers
  - One service file owns business logic and DTO mapping
  - One controller file extracts `restaurantId` from auth context and calls `sendSuccess`
  - One routes file wires `authenticate`, `authorize`, and `validate`
- **Route conventions**
  - `GET /categories`
  - `POST /categories`
  - `PATCH /categories/:id`
  - `DELETE /categories/:id`
- **Validation strategy**
  - Shared schemas from `@srms/api-contracts/categories`
  - Query validation uses `PaginationQuerySchema`-style contract
- **Frontend patterns**
  - Sheet-based create/edit form
  - Separate delete confirmation component
  - TanStack Query hooks for list + mutations
  - Loading via Skeleton, retry on error, empty state with create CTA for admin

### Kitchen Sections

- **Folder structure**
  - Mirrors Categories exactly
- **Route conventions**
  - Same CRUD route structure as Categories
- **Business logic patterns**
  - Duplicate name checks scoped to `restaurantId`
  - `findById(id, restaurantId)` for cross-restaurant protection
  - DTO mapping in service layer
- **Frontend behavior**
  - Same list/table structure, same Sheet create/edit pattern, same delete dialog, same admin button visibility rules

### Reusable Patterns Menu Items Should Follow

1. Shared `api-contracts` domain package
2. Single `api-client` domain file
3. Vertical-slice API module with repository/service/controller/routes
4. `authenticate` on all routes and `authorize([USER_ROLE.ADMIN])` for write actions
5. Service-layer DTO mapping and cross-restaurant enforcement
6. Dashboard list page using TanStack Query + Sheet + Skeleton + toast notifications

## 2. Architecture Impact

### Affected Applications

- `apps/api`
  - new `modules/menu-item` feature module
  - route registration in `apps/api/src/app.ts`
- `apps/dashboard`
  - new `modules/menu-item` feature module
  - new `/menu-items` route in app routing
  - integration into navigation constants and admin nav UI

### Affected Shared Packages

- `packages/api-contracts`
  - add `menu-item` domain contracts
- `packages/api-client`
  - add `menu-item.ts` API wrapper file

### Dependencies Between Domains

- Menu Items depend on Categories and Kitchen Sections existing as referenceable records.
- Create/update flows must validate that `categoryId` and `kitchenSectionId` belong to the same restaurant as the menu item.
- Future ordering features will depend on Menu Items but Menu Items should not depend on Orders yet.

## 3. Database Implementation Plan

### Mongoose Schema

`menu_items` collection with fields:

- `_id`
- `name`
- `description`
- `price`
- `categoryId`
- `kitchenSectionId`
- `restaurantId`
- `isAvailable` (default `true`)
- `createdAt`
- `updatedAt`

### Index Strategy

- `{ restaurantId: 1, createdAt: -1 }` for paginated listing
- `{ restaurantId: 1, name: 1 }` for search and name sorting
- `{ restaurantId: 1, categoryId: 1 }` for category filter
- `{ restaurantId: 1, kitchenSectionId: 1 }` for kitchen section filter
- `{ restaurantId: 1, isAvailable: 1 }` for availability filter
- Optional later compound index for combined filters if profiling shows need

### Referential Integrity

- On create/update, verify `categoryId` exists within the current `restaurantId`
- On create/update, verify `kitchenSectionId` exists within the current `restaurantId`
- Reject dangling or cross-restaurant references with `NotFoundError` or `ValidationError` depending on final API decision

### Restaurant Isolation

- Every query is scoped by `restaurantId` from authenticated context
- No request accepts `restaurantId` from client
- `findMenuItemById(id, restaurantId)` style repository helper prevents cross-restaurant access

### Search Support

- Search by `name` using case-insensitive regex inside restaurant scope for v1
- Trim search input before query construction

## 4. Backend Implementation Plan

### Module Structure

`apps/api/src/modules/menu-item/`

- `repository/menu-item.repository.ts`
  - Mongoose schema, model, indexes, low-level DB queries
- `service/menu-item.service.ts`
  - business logic, scope checks, reference validation, DTO mapping
- `controller/menu-item.controller.ts`
  - list/detail/create/update/toggle/delete handlers
- `routes/menu-item.routes.ts`
  - route wiring + auth + validation middleware

### Repository Responsibilities

- `findMenuItemsByRestaurant(restaurantId, filters)`
- `findMenuItemById(id, restaurantId)`
- `createMenuItem(payload)`
- `updateMenuItemById(id, restaurantId, payload)`
- `deleteMenuItemById(id, restaurantId)`
- `toggleMenuItemAvailability(id, restaurantId, nextValue)`

### Service Responsibilities

- normalize/trim text fields
- enforce `price > 0`
- verify category and kitchen section existence in same restaurant
- apply search/filter query logic
- build list pagination response
- map Mongo documents to DTOs

### Controller Responsibilities

- extract `restaurantId` from `req.auth`
- extract `id` from params
- pass validated body/query to service
- return standard success envelope with `sendSuccess`

### Operations Required

- Create Menu Item
- List Menu Items
- Get Menu Item By Id
- Update Menu Item
- Toggle Availability
- Delete Menu Item

### Error Handling

- invalid body/query → `ValidationError`
- missing token → `UnauthorizedError`
- non-admin write/toggle/delete → `ForbiddenError`
- cross-restaurant or missing entity → `NotFoundError`
- future duplicate naming rule if introduced → `ConflictError`

## 5. API Contract Plan

### Shared Contracts (`packages/api-contracts/src/menu-item/`)

- `menu-item.types.ts`
  - `MenuItem`
  - `MenuItemListItem`
  - `CreateMenuItemDTO`
  - `UpdateMenuItemDTO`
  - `MenuItemFiltersDTO`
  - list/detail/create/update/toggle response envelope shapes as needed
- `schemas.ts`
  - `CreateMenuItemSchema`
  - `UpdateMenuItemSchema`
  - `MenuItemFiltersSchema`
  - route param schema for `id` if the team uses param validation contracts
- `routes.ts` or `constants.ts`
  - `MENU_ITEM_ENDPOINTS`

### Endpoint Set

- `GET /menu-items`
  - pagination + search + filters + optional sorting
- `GET /menu-items/:id`
- `POST /menu-items`
- `PATCH /menu-items/:id`
- `PATCH /menu-items/:id/availability`
- `DELETE /menu-items/:id`

### Query Inputs for List

- `page`
- `limit`
- `search`
- `categoryId`
- `kitchenSectionId`
- `isAvailable`
- optional `sortBy`, `sortOrder` if implemented in v1

### Response Format

- Must follow SRMS success envelope:
  - `{ success: true, message, data }`
- List response `data` should include:
  - `data: MenuItemListItem[]`
  - `pagination: { page, limit, total, totalPages }`

## 6. Frontend Implementation Plan

### Dashboard Module Structure

`apps/dashboard/src/modules/menu-item/`

- `api/index.ts`
  - bind `authApiClient` to `@srms/api-client` functions
- `hooks/`
  - `use-menu-items.ts`
  - `use-menu-item.ts`
  - `use-create-menu-item.ts`
  - `use-update-menu-item.ts`
  - `use-delete-menu-item.ts`
  - `use-toggle-menu-item-availability.ts`
- `components/`
  - `menu-item-form.tsx`
  - `delete-menu-item-dialog.tsx`
  - filter toolbar component if needed
- `schemas/`
  - thin wrapper around shared Zod schemas for React Hook Form
- `pages/`
  - `menu-items-page.tsx`
  - optional `menu-item-detail-page.tsx` if implemented as a route rather than a sheet

### UI Behavior

- **List page**
  - Table with Name, Category, Kitchen Section, Price, Availability, Created Date, Actions
  - Search input and filter controls above table
  - Skeleton loading state
  - Friendly empty state
  - Error state with retry
- **Create/Edit**
  - Reuse Sheet-based form pattern from Categories/Kitchen Sections
- **Delete**
  - Reuse delete confirmation component pattern
- **Toggle availability**
  - Inline action in row (button/switch/badge action depending design system consistency)

### Query / Mutation Patterns

- list uses `useQuery`
- detail uses `useQuery` by id
- create/update/delete/toggle use `useMutation`
- invalidate `['menu-items']` after all successful mutations

### Permission Handling

- Route protection with `ProtectedRoute`
- Admin-only route access can use `RoleGuard` if the entire page should be admin-only
- If read access later expands, keep page in `ProtectedRoute` and hide write actions for non-admins

## 7. Form Design Plan

Fields:

- `name` (required)
- `description` (optional)
- `price` (required, positive)
- `categoryId` (required, dropdown)
- `kitchenSectionId` (required, dropdown)
- `isAvailable` (boolean)

### Validation Strategy

- Shared schemas from `packages/api-contracts`
- Frontend uses `zodResolver`
- API validates again at request boundary

### Dropdown Data Loading

- Category options fetched from existing Categories API
- Kitchen Section options fetched from existing Kitchen Sections API
- Both lists scoped to current restaurant through backend auth context

### Submission Flow

- validate locally
- submit via TanStack Query mutation
- show pending state
- show success toast and refresh list
- keep consistent error handling with Categories/Kitchen Sections

## 8. Shared Package Changes

### `packages/api-contracts`

Add `src/menu-item/` domain with:

- `MenuItem`
- `MenuItemListItem`
- `CreateMenuItemDTO`
- `UpdateMenuItemDTO`
- `MenuItemFiltersDTO`
- `CreateMenuItemSchema`
- `UpdateMenuItemSchema`
- `MenuItemFiltersSchema`
- `MENU_ITEM_ENDPOINTS`

Update:

- `packages/api-contracts/src/index.ts`
- `packages/api-contracts/package.json` exports

### `packages/api-client`

Add:

- `getMenuItems`
- `getMenuItemById`
- `createMenuItem`
- `updateMenuItem`
- `toggleMenuItemAvailability`
- `deleteMenuItem`

Update `packages/api-client/src/index.ts` export barrel.

## 9. Security & Authorization Plan

- All menu-item operations require authentication
- All operations scoped by `restaurantId` from token
- Create/update/toggle/delete require admin role
- Cross-restaurant access prevented by repository/service methods that always include `restaurantId` in lookup filters
- Category/kitchen section references must be same-restaurant valid before write operations succeed

## 10. Future Extensibility

Design decisions to avoid future breakage:

- keep `isAvailable` explicit for ordering system
- keep `price` numeric for totals, taxes, discounts, promotions
- keep category and kitchen section references first-class
- expose detail endpoint to support future product pages
- shape contracts so item images, modifiers, combos, promotions, and inventory fields can be added without renaming core DTOs

Potential future expansions:

- modifiers/customizations
- product images
- inventory integration
- combo meals
- promotion/discount rules
- order-time snapshotting of menu item data

## 11. Implementation Order

Recommended sequence:

1. Shared contracts in `packages/api-contracts`
2. API client functions in `packages/api-client`
3. API repository/model
4. API service
5. API controller
6. API routes + app registration
7. Dashboard API binding layer
8. Dashboard create/edit form
9. Dashboard list/table page
10. Search and filters
11. Detail view
12. Toggle availability
13. Delete confirmation
14. Full integration + validation

### Why this order

- shared contracts unblock both apps
- backend first provides stable API surface for frontend
- list/create/edit patterns should be reused before layering filters and detail
- toggle/delete are lower-risk once list and detail work

## 12. Definition of Completion

Menu Items feature is complete when:

1. API module exists and supports create, list, detail, update, toggle availability, and delete
2. All operations are restaurant-scoped and auth-protected
3. Category and kitchen section relationship checks are enforced on create/update
4. Shared menu-item contracts, schemas, and route constants exist in `packages/api-contracts`
5. All menu-item API calls exist in `packages/api-client/src/menu-item.ts`
6. Dashboard provides list, detail, create, update, toggle, delete, search, and filters with UX consistent to Categories/Kitchen Sections
7. Loading, empty, error, and success states follow established patterns
8. Typechecks pass across shared packages, API, and dashboard
9. Required tests are either implemented with standardized test infrastructure or the infrastructure prerequisite is explicitly completed before merge

## Complexity Tracking

No constitution violations identified. No exception tracking required.
