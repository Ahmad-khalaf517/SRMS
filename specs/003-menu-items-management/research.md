# Phase 0 Research: Menu Items Management (MENU-001)

## Decision 1: Follow the exact Categories and Kitchen Sections module shape

- **Decision**: Implement `apps/api/src/modules/menu-item/` and `apps/dashboard/src/modules/menu-item/` using the same vertical-slice structure already used by Categories and Kitchen Sections.
- **Rationale**: The repository already has proven CRUD management module patterns for `categories` and `kitchen-section`. Reusing them preserves developer experience and keeps future modules predictable.
- **Alternatives considered**:
  - Introduce a generic "management" abstraction layer: rejected — unnecessary indirection and divergence from the reference modules.
  - Use a different module name/layout (`menu-items` everywhere): possible, but `menu-item` should be chosen only if it matches existing naming conventions around imports and route constants consistently.

## Decision 2: Use `packages/api-contracts/src/menu-item/` as the single source of truth

- **Decision**: Add a new `menu-item` domain in `packages/api-contracts` with:
  - `menu-item.types.ts`
  - `schemas.ts`
  - `routes.ts` or `constants.ts`
  - `index.ts`
- **Rationale**: Constitution v1.1.0 mandates centralized shared API contracts. Auth, Category, and Kitchen Section already follow this model.
- **Alternatives considered**:
  - App-local DTOs and schemas: rejected — violates Single Source of Truth.
  - Split contracts by feature fragments (filters in one package, types in another): rejected — increases cognitive load.

## Decision 3: Use a single `packages/api-client/src/menu-item.ts` file

- **Decision**: Add one API client file for all Menu Item requests:
  - `getMenuItems`
  - `getMenuItemById`
  - `createMenuItem`
  - `updateMenuItem`
  - `toggleMenuItemAvailability`
  - `deleteMenuItem`
- **Rationale**: Constitution requires one file per domain in `api-client`. This matches `auth.ts`, `categories.ts`, and `kitchen-section.ts` style.

## Decision 4: Restaurant scoping always comes from authenticated context

- **Decision**: The API never accepts `restaurantId` from client input for create, update, list, toggle, or delete. It is always taken from `req.auth.restaurantId`.
- **Rationale**: Prevents cross-tenant access and matches existing auth/category/kitchen-section security model.
- **Alternatives considered**:
  - Accepting `restaurantId` in request body or query: rejected — insecure and constitutionally invalid.

## Decision 5: Validate referenced Category and Kitchen Section at service layer

- **Decision**: On create and update, the service must verify that `categoryId` and `kitchenSectionId` both exist and belong to the same `restaurantId` as the authenticated user.
- **Rationale**: MongoDB does not enforce referential integrity; the service must protect cross-restaurant and dangling relationships.
- **Alternatives considered**:
  - Rely solely on front-end dropdown options: rejected — frontend restrictions are not security.
  - Mongoose middleware hooks: rejected — harder to keep the validation flow explicit and testable.

## Decision 6: Support search and filters in one list endpoint

- **Decision**: `GET /menu-items` will accept pagination plus optional `search`, `categoryId`, `kitchenSectionId`, and `isAvailable` query params.
- **Rationale**: This matches admin list management expectations and reduces the need for multiple specialized endpoints.
- **Alternatives considered**:
  - Separate search endpoint: rejected — unnecessary API surface for current scope.
  - Client-side filtering only: rejected — not scalable and violates restaurant isolation assumptions when data volume grows.

## Decision 7: Availability toggle is a dedicated endpoint

- **Decision**: Expose a dedicated endpoint (likely `PATCH /menu-items/:id/availability`) for toggling `isAvailable`.
- **Rationale**: Keeps availability changes explicit, easier to audit, and consistent with future ordering logic where availability may become operationally significant.
- **Alternatives considered**:
  - Fold toggle into the generic update endpoint only: possible, but less expressive for the frontend and future audit logging.

## Decision 8: Hard delete in v1, but keep future order-system compatibility in mind

- **Decision**: Use hard delete in this feature to stay aligned with current CRUD management modules.
- **Rationale**: The spec marks inventory, modifiers, promotions, and order integration as out of scope. Hard delete keeps implementation simple now.
- **Future consideration**: Once orders reference menu items, a soft-delete or archival strategy may be required.

## Decision 9: Reuse Categories/Kitchen Sections frontend UX patterns directly

- **Decision**: Use the same frontend pattern set:
  - table list + skeleton loading
  - Sheet-based create/edit forms
  - delete confirmation dialog component
  - TanStack Query list/mutation hooks
  - Sonner success/error notifications
- **Rationale**: The spec explicitly names Categories and Kitchen Sections as the reference implementation.

## Decision 10: Price remains a number in contracts, normalized at API boundary

- **Decision**: Shared schemas validate `price` as a positive numeric value. Frontend form can collect it as string input but must coerce to number before or during schema validation.
- **Rationale**: Keeps backend contracts clean and future order calculations type-safe.
- **Alternatives considered**:
  - Store price as string: rejected — harms arithmetic correctness and future totals/tax logic.

## Decision 11: Detail view should reuse existing list query state where possible

- **Decision**: Provide `GET /menu-items/:id` and a dedicated detail page or sheet that can fetch one item by ID. The implementation may open details from the list, but a distinct route-friendly data fetch path should exist.
- **Rationale**: The feature requires viewing menu item details and should support direct navigation later.

## Decision 12: Automated tests are required, but current repository lacks test infrastructure

- **Decision**: The plan will require backend and frontend tests for this feature because the constitution says Menu Items is in a domain that requires automation.
- **Constraint**: The current repository does not yet contain Vitest, Jest, Supertest, or a test runner scaffold. The implementation plan must therefore include introducing or standardizing test infrastructure as part of the feature or as a blocking prerequisite.
- **Rationale**: We should not silently mark tests as done when the environment cannot run them.
