# Feature Specification: Restaurant Category Management

**Feature Branch**: `002-category-management`

**Created**: 2026-07-09

**Status**: Implementation Ready

**Feature ID**: CATEGORY-001

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Admin Views and Navigates Category List (Priority: P1)

A restaurant admin (or any authenticated user) opens the Categories page and sees all
categories for their restaurant with pagination controls.

**Why this priority**: Viewing categories is the foundation of the feature — no create,
edit, or delete workflow is meaningful until the list works. It also validates
restaurant-scoped data isolation end-to-end.

**Independent Test**: Navigate to `/categories` as an authenticated user, verify the
paginated list renders correctly with name, description, and created date columns, and
that only categories belonging to the current restaurant are shown.

**Acceptance Scenarios**:

1. **Given** an authenticated user with existing categories, **When** they open `/categories`, **Then** they see a paginated table with columns Name, Description, Created Date, and Actions.
2. **Given** a restaurant with no categories, **When** the user opens `/categories`, **Then** they see a friendly empty state with a "Create Category" button (admin) or a plain empty message (non-admin).
3. **Given** more categories than the default page limit, **When** the user navigates between pages, **Then** each page shows the correct subset and pagination reflects total count accurately.
4. **Given** two restaurants each with categories, **When** a user from restaurant A views `/categories`, **Then** they see only restaurant A's categories — never restaurant B's.

---

### User Story 2 - Admin Creates a Category (Priority: P2)

An admin creates a new category to organize upcoming menu items for their restaurant.

**Why this priority**: Creation is the primary write action; without it the list is
permanently empty. It establishes the validation, duplicate-prevention, and success
feedback patterns used by edit as well.

**Independent Test**: Submit the create-category form with valid data; verify the new
category appears in the list, the API returns the created object in the standard
envelope, and a success toast is shown. Then submit with a duplicate name and verify
rejection.

**Acceptance Scenarios**:

1. **Given** an admin on the Categories page, **When** they open the create dialog and submit a valid name, **Then** the category is created, the list refreshes, and a success notification appears.
2. **Given** an admin submitting a name that already exists in their restaurant, **When** they submit the form, **Then** the API returns a conflict error and the form shows the error message without closing.
3. **Given** an admin submitting with an empty name or a name under 2 characters, **When** they submit, **Then** client-side validation blocks submission and shows the relevant field error.
4. **Given** a non-admin (Cashier or Kitchen Staff), **When** they are on the Categories page, **Then** the Create button is not visible and a direct `POST /categories` request returns 403 Forbidden.

---

### User Story 3 - Admin Edits a Category (Priority: P3)

An admin updates the name or description of an existing category.

**Why this priority**: Edit corrects mistakes and keeps menu organization accurate. It
reuses the create form pattern, so it delivers incremental value after P2 is working.

**Independent Test**: Click Edit on a category row, change the name, submit; verify the
list reflects the update, the API returns the updated object, and a success toast
appears. Attempt edit on a category that does not belong to the current restaurant and
verify rejection.

**Acceptance Scenarios**:

1. **Given** an admin editing an existing category, **When** they submit a valid updated name, **Then** the category is updated, the list refreshes with the new values, and a success notification appears.
2. **Given** an admin editing a category with a name already used by another category in the same restaurant, **When** they submit, **Then** a conflict error is returned and the form shows the error.
3. **Given** an admin attempting to edit a category that belongs to a different restaurant (via direct API call), **When** the request is submitted, **Then** the API returns 404 Not Found (category does not exist in this restaurant's scope).

---

### User Story 4 - Admin Deletes a Category (Priority: P4)

An admin removes a category from their restaurant after confirming the action.

**Why this priority**: Deletion is needed for full lifecycle management but has the
highest risk of accidental data loss, so it is the last story. A confirmation step
reduces that risk.

**Independent Test**: Click Delete on a category row, confirm the dialog, verify the
category is removed from the list, the API returns success, and a success toast
appears. Attempt delete on a non-existent category and verify 404.

**Acceptance Scenarios**:

1. **Given** an admin clicking Delete on a category, **When** a confirmation dialog appears and they confirm, **Then** the category is deleted, the list refreshes, and a success notification appears.
2. **Given** an admin clicking Delete, **When** they cancel the confirmation dialog, **Then** no deletion occurs and the list is unchanged.
3. **Given** an admin attempting to delete a category that does not exist in their restaurant, **When** the request is submitted, **Then** the API returns 404 Not Found.
4. **Given** a non-admin user, **When** a direct `DELETE /categories/:id` request is made, **Then** the API returns 403 Forbidden.

---

### Edge Cases

- A category name submitted with leading/trailing whitespace must be stored trimmed; trim must also apply before uniqueness checks.
- Concurrent create requests with the same name in the same restaurant must result in only one category created (index-level enforcement).
- Pagination parameters outside valid range (`page=0`, `limit=0`, `limit=999`) must be coerced to safe defaults (page min 1, limit min 1, limit max 100).
- Editing a category's name to the same current name must succeed (no false duplicate error on self).
- Requesting categories for a restaurant with no categories must return an empty data array with correct pagination metadata (`total: 0, totalPages: 0`).
- A soft-deleted or inactive category (if soft delete is ever added) must not appear in list results.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to retrieve a paginated list of categories scoped to their restaurant.
- **FR-002**: System MUST allow admin users to create a new category with a name (required) and description (optional) for their restaurant.
- **FR-003**: System MUST prevent creation of a category whose name (trimmed) already exists within the same restaurant.
- **FR-004**: System MUST allow admin users to update the name and/or description of an existing category in their restaurant.
- **FR-005**: System MUST allow admin users to delete an existing category from their restaurant.
- **FR-006**: System MUST return 403 Forbidden when a non-admin user attempts to create, update, or delete a category.
- **FR-007**: System MUST return 404 Not Found when an admin targets a category that does not belong to their restaurant.
- **FR-008**: System MUST validate all category inputs — name (2–100 chars, trimmed), description (≤500 chars, trimmed, optional).
- **FR-009**: System MUST support pagination for the category list with configurable `page` (default 1) and `limit` (default 10, max 100) query parameters.
- **FR-010**: System MUST include pagination metadata (`page`, `limit`, `total`, `totalPages`) in list responses.
- **FR-011**: Frontend MUST show a confirmation dialog before executing a delete action.
- **FR-012**: Frontend MUST display loading, empty, and error states for the category list.
- **FR-013**: Frontend MUST hide create, edit, and delete controls from non-admin users.
- **FR-014**: Frontend MUST show inline field errors and a general error toast on submission failures.
- **FR-015**: Frontend MUST refresh the category list automatically after a successful create, update, or delete.

### Key Entities

- **Category**: Represents a named grouping that organizes menu items within a restaurant. Belongs exclusively to one restaurant. Key attributes: `id`, `name`, `description` (optional), `restaurantId`, `createdAt`, `updatedAt`.

## Constitution Alignment _(mandatory)_

- **Domain Ownership**: Feature is owned by `modules/categories` in both `apps/api` and `apps/dashboard`. Category-specific components, pages, hooks, and API calls stay within the domain module.
- **Shared Contracts**: Add `packages/api-contracts/src/categories/` domain with `category.types.ts` (DTOs: `CategoryDTO`, `CreateCategoryDTO`, `UpdateCategoryDTO`, `CategoryListDTO`, `PaginationDTO`), `schemas.ts` (`CreateCategorySchema`, `UpdateCategorySchema`, `CategoryQuerySchema`), and `constants.ts` (`CATEGORY_ROUTES`). All API call functions go in `packages/api-client/src/categories.ts`.
- **Validation Coverage**: `CreateCategorySchema` and `UpdateCategorySchema` validate request body at API boundary. `CategoryQuerySchema` validates pagination query params. Form-side validation uses the same schemas via `@hookform/resolvers/zod`.
- **AuthN/AuthZ Impact**: All routes require authentication via existing `authenticate` middleware. Create/update/delete routes additionally require `authorize([UserRole.ADMIN])`. Frontend `/categories` route is wrapped in `ProtectedRoute`. Admin-only action buttons are conditionally rendered based on the session user role read from the auth session store. RoleGuard wraps future role-restricted sub-routes if needed.
- **State Ownership**: TanStack Query owns category list data, mutations, and cache invalidation. Zustand is not used for category data. Dialog open/close and form state are local React state.
- **API and Errors**: All responses use the standard `{ success, message, data }` envelope. Errors use `AppError` subclasses — `ValidationError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ConflictError` (409).
- **Testing Phase Declaration**: Backend unit/integration tests are required for this domain per constitution phase 2 policy (create, duplicate, isolation, admin authz, non-admin forbidden, pagination). Frontend tests cover list rendering, pagination behavior, admin action visibility, form validation, and delete confirmation.
- **Future-Proofing Check**:
  1. Reuse by another frontend: Yes — contracts are in `packages/api-contracts` and API calls in `packages/api-client`; any future frontend (kitchen app, customer app) can import and use them.
  2. Support multi-branch: Yes — categories are scoped by `restaurantId` which already maps to the tenant model.
  3. Scales to future customer/delivery apps: Yes — the category list endpoint is read-accessible to any authenticated role, making it usable by future consumer-facing features.
  4. AI agents can understand/extend safely: Yes — feature-first module structure, typed contracts, and explicit role guards make the boundaries clear.
  5. Avoids duplication: Yes — single schema definition in `packages/api-contracts` used by both API validation and frontend form resolver; single API client file per domain.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admin can complete a full create-category flow (open form → submit → see in list) in under 30 seconds.
- **SC-002**: 100% of non-admin create/update/delete requests return 403 Forbidden — no role bypass is possible.
- **SC-003**: 100% of category list requests return only categories belonging to the authenticated user's restaurant.
- **SC-004**: Duplicate category name submissions (same restaurant, same trimmed name) are rejected 100% of the time.
- **SC-005**: Category list with pagination navigates correctly across all pages with accurate `total` and `totalPages` counts.
- **SC-006**: All four CRUD operations complete and reflect in the UI without requiring a manual page refresh.

## Assumptions

- Menu items domain is out of scope for this feature; categories serve as preparation for menu item management in the next feature.
- Hard delete is used for categories in this phase; if menu items exist that reference a category, deletion behavior (block or cascade) will be handled in the menu items feature.
- The single-page admin dashboard app already has auth session available via `useAuthSessionStore`; no additional auth plumbing is needed beyond route protection.
- Category images/icons are out of scope for v1.
- Search/filter by category name is out of scope for v1; pagination only.
- Ordering/sorting of categories is out of scope for v1; results are sorted by `createdAt` descending by default.
