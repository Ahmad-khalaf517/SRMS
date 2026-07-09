# Phase 0 Research: Restaurant Category Management (CATEGORY-001)

## Decision 1: Follow identical module structure to `modules/auth`

- **Decision**: Implement `apps/api/src/modules/categories/` as a vertical slice with
  `controller/`, `service/`, `repository/`, and `routes/` sub-folders. No `schemas/` or
  `types/` folder inside the module — those live in `packages/api-contracts`.
- **Rationale**: Matches the only existing module (`modules/auth`) and the constitution
  vertical-slice requirement. Keeps the slice thin: repository → service → controller → routes.
- **Alternatives considered**:
  - Flat files inside `modules/categories/`: rejected — subfolder grouping matches existing auth pattern.
  - Full DDD with separate mapper layer: rejected — complexity not justified for a simple CRUD domain.

## Decision 2: Use `packages/api-contracts/src/categories/` for all shared contracts

- **Decision**: Create a `categories` domain in `packages/api-contracts` with:
  - `category.types.ts`: `Category`, `CreateCategoryDTO`, `UpdateCategoryDTO`, `CategoryList`, `PaginationMeta`.
  - `schemas.ts`: `CreateCategorySchema`, `UpdateCategorySchema`, `CategoryQuerySchema` (Zod).
  - `constants.ts`: `CATEGORY_ENDPOINTS` route URI constants.
  - `index.ts`: barrel export.
- **Rationale**: Constitution v1.1.0 mandates `packages/api-contracts` as single source of truth. Matches auth domain layout exactly.
- **Alternatives considered**:
  - App-local DTOs in API or dashboard: rejected — violates Single Source of Truth principle and DTO naming convention.

## Decision 3: Single `packages/api-client/src/categories.ts` for all API calls

- **Decision**: Add `categories.ts` to `packages/api-client/src/` with functions `getCategories`, `getCategoryById`, `createCategory`, `updateCategory`, `deleteCategory`. Export from package root.
- **Rationale**: Constitution mandates one file per domain in `api-client`; dashboard imports directly, no route URIs in dashboard modules.
- **Alternatives considered**:
  - Per-operation files: rejected — constitution explicitly requires one file per domain.

## Decision 4: `restaurantId` sourced from authenticated request context, never from request body

- **Decision**: The `restaurantId` is always extracted from `req.auth.restaurantId` (set by `authenticate` middleware). The API never accepts `restaurantId` in the request body for category operations.
- **Rationale**: Prevents cross-restaurant data injection. Matches existing auth service pattern where `restaurantId` comes from verified JWT payload.
- **Alternatives considered**:
  - Accept `restaurantId` from query/body: rejected — security anti-pattern; client can forge any restaurant ID.

## Decision 5: Duplicate name check scoped to restaurant with `{ name, restaurantId }` compound query

- **Decision**: Before create and update, check `CategoryModel.findOne({ name: trimmedName, restaurantId })`. On create, any match throws `ConflictError`. On update, check excludes the document being updated (query adds `_id: { $ne: id }`).
- **Rationale**: Duplicate names across restaurants are allowed; only within-restaurant uniqueness is required. The self-exclusion on update prevents false conflict when name is unchanged.
- **Alternatives considered**:
  - Unique compound index at DB level: used as backup enforcement (`{ name: 1, restaurantId: 1 }` unique), but application-layer check provides clear `ConflictError` response.

## Decision 6: Reuse `PaginationQuerySchema` from `packages/api-contracts/src/http/schemas.ts`

- **Decision**: Use the existing `PaginationQuerySchema` (page/limit with coercion and defaults) for category list query params. No new pagination schema needed.
- **Rationale**: Already exists, already used by the app. DRY principle.
- **Alternatives considered**:
  - Create a `CategoryQuerySchema` that extends/re-declares pagination: rejected — unnecessary duplication.

## Decision 7: Dashboard category module mirrors auth module structure

- **Decision**: Implement `apps/dashboard/src/modules/categories/` with:
  - `api/index.ts`: request functions calling `@srms/api-client` directly.
  - `hooks/`: `use-categories.ts` (query), `use-create-category.ts`, `use-update-category.ts`, `use-delete-category.ts`.
  - `components/`: `category-form.tsx` (shared create/edit form), `delete-category-dialog.tsx`.
  - `pages/categories-page.tsx`.
- **Rationale**: Mirrors the auth module layout exactly. Keeps components, hooks, and API requests domain-scoped.
- **Alternatives considered**:
  - Putting categories under a generic admin module: rejected — constitution requires feature-first domain ownership.

## Decision 8: Route protection — `ProtectedRoute` + `RoleGuard` for write routes; `ProtectedRoute` only for read

- **Decision**: `/categories` route uses `ProtectedRoute` (any authenticated user can view). Create/edit/delete actions are conditionally shown based on `user.role === USER_ROLE.ADMIN` from session store. No separate `RoleGuard` route for the list page, but a `RoleGuard` would be added for an admin-only management page if that is ever introduced as a separate route.
- **Rationale**: The spec says all authenticated users can view, but only admin can write. The API enforces the role restriction server-side; the frontend hides the controls. This matches the constitutional pattern.

## Decision 9: Use `@tanstack/react-query` for all server state; no Zustand for categories

- **Decision**: Use `useQuery` for list fetching with `queryKey: ['categories', restaurantId, page, limit]`. Use `useMutation` for create/update/delete, each invalidating `['categories']` on success.
- **Rationale**: Constitution mandates TanStack Query for server state. Zustand is only for UI/session state.

## Decision 10: No soft delete in v1

- **Decision**: Use hard delete (`CategoryModel.findOneAndDelete`). Soft delete deferred to menu items feature when cascade behavior becomes relevant.
- **Rationale**: Spec explicitly states hard delete for this phase. Soft delete would require additional `isActive` field and query filter changes throughout, adding complexity without current value.
