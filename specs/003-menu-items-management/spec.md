# Feature Specification: Menu Items Management

**Feature Branch**: `003-menu-items-management`

**Created**: 2026-07-10

**Status**: Draft

**Feature ID**: MENU-001

**Input**: User description: "SRMS Menu Management Feature Specification"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Menu Items List (Priority: P1)

An admin opens the Menu Items page and sees the restaurant's menu items in a paginated list with category, kitchen section, price, and availability information.

**Why this priority**: Listing is the foundation of the management workflow. Without a reliable list view, create, update, filter, toggle, and delete actions cannot be verified or managed efficiently.

**Independent Test**: Log in as an admin, navigate to the Menu Items page, and verify the table displays only menu items belonging to the current restaurant with correct pagination metadata and visible category/kitchen section labels.

**Acceptance Scenarios**:

1. **Given** an admin with existing menu items, **When** they open the Menu Items page, **Then** they see a paginated list containing Name, Category, Kitchen Section, Price, Availability Status, Created Date, and Actions.
2. **Given** a restaurant with no menu items, **When** the admin opens the Menu Items page, **Then** they see a friendly empty state with a create action.
3. **Given** more menu items than the default page limit, **When** the admin moves between pages, **Then** pagination updates correctly and the list shows the correct subset.
4. **Given** two restaurants with distinct menu items, **When** an admin from restaurant A views the Menu Items page, **Then** they only see menu items belonging to restaurant A.

---

### User Story 2 - Create Menu Item (Priority: P2)

An admin creates a new menu item by entering item details and selecting a category and kitchen section.

**Why this priority**: Create is the first write operation and establishes the validation, relationship checks, and success/error patterns reused by update and toggle flows.

**Independent Test**: Submit a valid create form, then verify the new item appears in the list with the selected category, kitchen section, price, and default availability status.

**Acceptance Scenarios**:

1. **Given** an admin on the Menu Items page, **When** they submit valid name, price, category, and kitchen section values, **Then** the menu item is created, associated with the current restaurant, and shown in the list.
2. **Given** an admin creating a menu item, **When** they do not set availability explicitly, **Then** the item is created with `isAvailable = true`.
3. **Given** an admin submitting invalid data such as a missing name, invalid price, or missing category/kitchen section, **When** they submit the form, **Then** client-side and server-side validation block the request and show clear errors.
4. **Given** a non-admin authenticated user, **When** they attempt to create a menu item through the UI or direct API request, **Then** the action is blocked and the backend returns a proper forbidden response.

---

### User Story 3 - Update and Toggle Availability (Priority: P3)

An admin updates a menu item and toggles its availability so menu offerings remain accurate and orderable state is controlled.

**Why this priority**: Update and availability are essential for day-to-day operations after creation. They directly impact what customers can order later in the system.

**Independent Test**: Edit a menu item, save changes, then toggle availability and verify both the list and detail views reflect the latest values immediately.

**Acceptance Scenarios**:

1. **Given** an admin editing an existing menu item, **When** they update editable fields and submit, **Then** the updated values are persisted and reflected in the list.
2. **Given** an admin viewing the menu items list, **When** they toggle availability, **Then** the availability status changes immediately and persists on refresh.
3. **Given** an admin attempts to update or toggle a menu item belonging to another restaurant via a direct request, **When** the request is made, **Then** the system rejects the operation as not found within scope.

---

### User Story 4 - Search, Filter, and View Details (Priority: P4)

An admin searches and filters menu items or opens a specific menu item detail view to quickly find and inspect items.

**Why this priority**: Search, filter, and detail views improve usability but depend on a stable list, relationships, and CRUD behaviors already being present.

**Independent Test**: Search by partial name, filter by category, kitchen section, and availability, and open a detail view for one result. Confirm that result sets and details are correct and restaurant-scoped.

**Acceptance Scenarios**:

1. **Given** a list with multiple menu items, **When** the admin searches by name, **Then** only matching items are shown.
2. **Given** multiple categories and kitchen sections, **When** the admin applies filters by category, kitchen section, and availability, **Then** only matching items are shown.
3. **Given** a menu item row, **When** the admin opens its detail view, **Then** they see all item information including category, kitchen section, price, description, and availability.

---

### User Story 5 - Delete Menu Item (Priority: P5)

An admin removes an obsolete menu item after confirming the action.

**Why this priority**: Delete is a full lifecycle action but has the highest risk and the lowest urgency compared with listing, creation, and editing.

**Independent Test**: Delete a menu item with confirmation and verify it disappears from the list and no longer appears in active results.

**Acceptance Scenarios**:

1. **Given** an admin chooses to delete a menu item, **When** they confirm the deletion, **Then** the item is removed and no longer appears in the active list.
2. **Given** the admin opens delete confirmation, **When** they cancel, **Then** no deletion occurs.
3. **Given** a non-admin attempts to delete a menu item, **When** the request is made, **Then** the system returns a proper forbidden response.

---

### Edge Cases

- Creating a menu item with a valid category but a kitchen section belonging to another restaurant must be rejected.
- Creating a menu item with a valid kitchen section but a category belonging to another restaurant must be rejected.
- Price values of `0`, negative numbers, or non-numeric input must be rejected.
- Search terms with leading/trailing spaces must be trimmed before filtering.
- Filters that produce no results must return an empty state without error.
- Toggling availability on a non-existent or cross-restaurant item must return a not-found style error.
- Deleting a menu item that may later be referenced by orders must be reviewed for future policy, but in this phase the behavior is hard delete unless blocked by later domain rules.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow admin users to create a menu item for their current restaurant.
- **FR-002**: System MUST allow authenticated admin users to view a paginated list of menu items scoped to their restaurant.
- **FR-003**: System MUST allow authenticated admin users to view menu item details scoped to their restaurant.
- **FR-004**: System MUST allow authenticated admin users to update existing menu items within their restaurant.
- **FR-005**: System MUST allow authenticated admin users to toggle menu item availability within their restaurant.
- **FR-006**: System MUST allow authenticated admin users to delete menu items within their restaurant.
- **FR-007**: System MUST allow searching menu items by name.
- **FR-008**: System MUST allow filtering menu items by category, kitchen section, and availability status.
- **FR-009**: System MUST enforce that each menu item belongs to exactly one category, one kitchen section, and one restaurant.
- **FR-010**: System MUST reject creation or update of a menu item when the referenced category or kitchen section does not belong to the current restaurant.
- **FR-011**: System MUST require `price > 0` for all menu items.
- **FR-012**: System MUST default `isAvailable` to `true` when a menu item is created.
- **FR-013**: System MUST prevent users from accessing or mutating menu items belonging to another restaurant.
- **FR-014**: System MUST use shared Zod schemas for all menu item request and query validation.
- **FR-015**: Frontend MUST provide consistent loading, empty, error, mutation, and confirmation patterns aligned with Categories and Kitchen Sections.

### Key Entities _(include if feature involves data)_

- **Menu Item**: Represents an orderable restaurant product with a name, description, price, category, kitchen section, restaurant, and availability state.
- **Category Reference**: The linked category that groups the menu item within a restaurant.
- **Kitchen Section Reference**: The linked kitchen section that determines where the item is prepared.

## Constitution Alignment _(mandatory)_

- **Domain Ownership**: Feature is owned by `modules/menu-item` (or `modules/menu-items`, matching the final repo naming decision) in both `apps/api` and `apps/dashboard`. All menu-item-specific UI, hooks, API calls, controllers, services, and repositories stay within that feature domain.
- **Shared Contracts**: Add `packages/api-contracts/src/menu-item/` with DTOs/types, route constants, and Zod schemas. Add `packages/api-client/src/menu-item.ts` containing all menu-item API calls.
- **Validation Coverage**: Create, update, route params, list query params, search, filters, and availability toggle inputs must all be validated with shared Zod schemas from `packages/api-contracts`.
- **AuthN/AuthZ Impact**: All menu item routes require authentication. View/list/detail routes are limited to authenticated admins per this feature specification unless expanded later. Write operations require admin role explicitly. Frontend routes use `ProtectedRoute` and admin-only page access uses `RoleGuard` when the route is intended only for admin users.
- **State Ownership**: TanStack Query owns menu item list/detail server state, filters, and mutations. Zustand remains limited to session/UI state and is not used to store menu item server data.
- **API and Errors**: Responses follow the SRMS `{ success, message, data }` envelope. Errors use existing `AppError` subclasses (`ValidationError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`).
- **Testing Phase Declaration**: Automated tests are required for this domain. Backend tests cover CRUD, toggle, search, filters, restaurant isolation, and authorization. Frontend tests cover list rendering, filters, form validation, detail loading, toggle interactions, and delete confirmation.
- **Future-Proofing Check**:
  1. Reuse by another frontend: Yes — shared contracts and api-client make the feature portable to other frontends.
  2. Support multi-branch: Yes — restaurant-scoped ownership can later expand to branch-aware menu management.
  3. Scales to future customer/delivery apps: Yes — menu item contracts are foundational for ordering and customer-facing catalogs.
  4. AI agents can understand/extend safely: Yes — feature-first architecture and shared contracts maintain clear boundaries.
  5. Avoids duplication: Yes — schemas, DTOs, route constants, and API call functions are defined once and reused.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admin can complete menu item creation in under 60 seconds including category and kitchen section selection.
- **SC-002**: 100% of menu item requests return only items belonging to the authenticated restaurant.
- **SC-003**: 100% of unauthorized create, update, toggle, and delete attempts return forbidden responses.
- **SC-004**: Search and filter actions produce correct result sets without requiring a full page reload.
- **SC-005**: Availability toggles persist correctly and reflect immediately in the list view.
- **SC-006**: Menu item list, detail, create, update, toggle, and delete flows all complete without violating the established Categories and Kitchen Sections interaction patterns.

## Assumptions

- Categories and Kitchen Sections must already exist before an admin can create meaningful menu items.
- Menu item images, modifiers, customizations, combo meals, inventory integration, pricing rules, and discounts are explicitly out of scope for this feature version.
- Hard delete is acceptable for this phase; later order history or inventory features may require a revised archival strategy.
- Sorting beyond the default list order is not mandatory unless required by the final implementation analysis.
- Menu item availability affects future ordering behavior but not current back-office visibility.
