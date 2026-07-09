# Quickstart Validation: Restaurant Category Management (CATEGORY-001)

## Prerequisites

- Node.js, pnpm installed.
- MongoDB running and `MONGODB_URI` configured in `apps/api/.env`.
- A registered admin user account available.
- Workspace dependencies installed: `pnpm install`.

## Setup

```bash
pnpm install
pnpm --filter @srms/api-contracts typecheck
pnpm --filter @srms/api-client typecheck
pnpm --filter api typecheck
pnpm --filter dashboard typecheck
pnpm --filter api dev        # API at http://localhost:3000
pnpm --filter dashboard dev  # Dashboard at http://localhost:5173
```

## Scenario A: View Empty Category List (P1 foundation)

1. Log in as any authenticated user.
2. Navigate to `/categories`.
3. Validate outcomes:
   - Page renders with loading skeleton, then empty state.
   - Empty state shows "Create Category" button for admin, plain message for non-admin.

## Scenario B: View Paginated Category List (P1 pagination)

1. Log in as admin and create 15+ categories.
2. Navigate to `/categories`.
3. Validate outcomes:
   - Table shows 10 results on page 1 (default limit).
   - Pagination controls show correct total and page count.
   - Navigating to page 2 shows the next 5+ results.

## Scenario C: Restaurant Isolation (P1 isolation)

1. Register two separate restaurant accounts.
2. Create categories under restaurant A.
3. Log in as restaurant B user and navigate to `/categories`.
4. Validate outcomes:
   - Restaurant B sees zero categories from restaurant A.
   - `GET /api/v1/categories` only returns categories with matching `restaurantId`.

## Scenario D: Create Category (P2)

1. Log in as admin.
2. Open the create category dialog and submit `name: "Pizza"`.
3. Validate outcomes:
   - Category appears in list.
   - Success toast shown.
   - API returns `{ success: true, data: { id, name: "Pizza", ... } }` with status 201.

## Scenario E: Duplicate Name Rejected (P2 edge)

1. Create a category named `"Pizza"`.
2. Attempt to create another category named `"Pizza"` (or `"  pizza  "` with whitespace).
3. Validate outcomes:
   - API returns 409 Conflict.
   - Form shows error message without closing.

## Scenario F: Non-Admin Forbidden (P2 / P3 / P4 authz)

1. Log in as Cashier or Kitchen Staff user.
2. Confirm Create / Edit / Delete buttons are not visible.
3. Attempt direct `POST /api/v1/categories` with Bearer token.
4. Validate outcomes:
   - API returns 403 Forbidden.
   - No category is created.

## Scenario G: Edit Category (P3)

1. Log in as admin. Click Edit on an existing category.
2. Change name to `"Burgers"` and submit.
3. Validate outcomes:
   - List reflects updated name.
   - Success toast shown.

## Scenario H: Duplicate Name on Edit Rejected (P3 edge)

1. Category `"Pizza"` and `"Burgers"` both exist.
2. Edit `"Burgers"`, attempt to change name to `"Pizza"`.
3. Validate outcomes:
   - API returns 409 Conflict. Form shows error.

## Scenario I: Self-Update Without Conflict (P3 edge)

1. Edit a category but submit the same name unchanged.
2. Validate outcomes:
   - Update succeeds without a conflict error.

## Scenario J: Delete Category with Confirmation (P4)

1. Log in as admin. Click Delete on a category.
2. Cancel the confirmation dialog.
3. Validate: category still exists in list.
4. Click Delete again and confirm.
5. Validate:
   - Category removed from list.
   - Success toast shown.
   - `DELETE /api/v1/categories/:id` returns 200.

## Scenario K: Delete Non-Existent Category (P4 edge)

1. Issue `DELETE /api/v1/categories/000000000000000000000000` with admin token.
2. Validate: API returns 404 Not Found.

## Verification Commands

```bash
pnpm --filter @srms/api-contracts typecheck
pnpm --filter @srms/api-client typecheck
pnpm --filter api typecheck
pnpm --filter dashboard typecheck
```

## References

- Specification: `specs/002-category-management/spec.md`
- Plan: `specs/002-category-management/plan.md`
- Data model: `specs/002-category-management/data-model.md`
- API contract: `specs/002-category-management/contracts/category-api.yaml`
