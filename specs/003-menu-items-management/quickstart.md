# Quickstart Validation: Menu Items Management (MENU-001)

## Prerequisites

- MongoDB running and API environment configured
- Seed or create at least one Category and one Kitchen Section for the current restaurant
- Admin user available
- Dependencies installed: `pnpm install`

## Setup

1. `pnpm --filter @srms/api-contracts typecheck`
2. `pnpm --filter @srms/api-client typecheck`
3. `pnpm --filter api typecheck`
4. `pnpm --filter dashboard typecheck`
5. Start API: `pnpm --filter api dev`
6. Start dashboard: `pnpm --filter dashboard dev`

## Scenario A: View Empty List

1. Log in as admin for a restaurant with no menu items.
2. Open `/menu-items`.
3. Validate:
   - Loading state appears first
   - Empty state appears after load
   - Create action is visible for admin

## Scenario B: Create Menu Item

1. Open create form.
2. Enter valid `name`, `price`, select `category`, select `kitchen section`, optional description.
3. Submit.
4. Validate:
   - Success toast appears
   - Item appears in the list
   - `isAvailable` is `true` by default

## Scenario C: Reject Invalid Create Data

1. Submit with missing name or `price <= 0`.
2. Validate:
   - Field validation errors shown
   - No item created

## Scenario D: Restaurant Isolation

1. Create menu item under restaurant A.
2. Log in as restaurant B admin.
3. Open `/menu-items` and attempt to fetch A's item by direct URL/API.
4. Validate:
   - List excludes A's item
   - Detail endpoint returns not found for A's item id

## Scenario E: Search

1. Create multiple menu items.
2. Search by partial item name.
3. Validate:
   - Only matching rows remain visible

## Scenario F: Filter

1. Apply category filter.
2. Apply kitchen section filter.
3. Apply availability filter.
4. Validate:
   - Results match all active filters

## Scenario G: Update Menu Item

1. Open edit form for an existing item.
2. Change name/description/price/category/kitchen section.
3. Submit.
4. Validate:
   - Success toast appears
   - Updated values are visible in list and detail

## Scenario H: Toggle Availability

1. Toggle one item from available to unavailable.
2. Validate:
   - Status updates immediately in UI
   - Value persists after refresh

## Scenario I: Delete Menu Item

1. Trigger delete action.
2. Cancel once.
3. Confirm on second attempt.
4. Validate:
   - Item disappears from list after confirmation
   - Success feedback appears

## Scenario J: Non-Admin Forbidden

1. Log in as non-admin.
2. Attempt create/update/delete/toggle via direct API request.
3. Validate:
   - Backend returns forbidden responses

## Verification Commands

- `pnpm --filter @srms/api-contracts typecheck`
- `pnpm --filter @srms/api-client typecheck`
- `pnpm --filter api typecheck`
- `pnpm --filter dashboard typecheck`

## References

- Specification: `specs/003-menu-items-management/spec.md`
- Plan: `specs/003-menu-items-management/plan.md`
- Data Model: `specs/003-menu-items-management/data-model.md`
- API Contract: `specs/003-menu-items-management/contracts/menu-item-api.yaml`
