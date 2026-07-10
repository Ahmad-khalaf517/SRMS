# Quickstart Validation - ORDER-001

This guide validates ORDER-001 end-to-end behavior after implementation.

## Prerequisites

- API and dashboard dependencies installed (`pnpm install`)
- MongoDB available and API env configured
- At least one restaurant, admin, cashier, and kitchen staff account exist
- Menu items, categories, and kitchen sections exist for the test restaurant

## Start Applications

1. Start API:
   - `pnpm --filter api dev`
2. Start dashboard:
   - `pnpm --filter dashboard dev`

## Scenario A: Cashier POS Create and Place Order

1. Login as CASHIER.
2. Open POS page.
3. Search menu items and add at least two items to cart.
4. Adjust quantity and add notes for one item.
5. Verify subtotal/tax/total update in UI.
6. Place order.

Expected outcomes:

- Success confirmation displayed.
- New order number generated.
- Order status is `PENDING`.
- Order appears in cashier My Orders.

## Scenario B: Cashier Draft Edit Before Submission

1. In POS, add items to cart but do not place.
2. Change quantity, remove one item, update notes.

Expected outcomes:

- Cart updates immediately.
- Totals recalculate.
- No backend order is created until Place Order action.

## Scenario C: Cashier My Orders Isolation

1. Create orders as Cashier A and Cashier B in same restaurant.
2. Login as Cashier A and open My Orders.

Expected outcomes:

- Only Cashier A orders are visible.
- Search and status filters narrow only Cashier A data.

## Scenario D: Kitchen Status Progression

1. Login as KITCHEN_STAFF.
2. Open order status management view.
3. Transition one order through: `PENDING -> PREPARING -> READY -> COMPLETED`.
4. Attempt invalid jump (example: `PENDING -> READY`) on another order.

Expected outcomes:

- Valid transitions persist.
- Invalid transition is rejected with clear error.
- Completed order records `completedAt` (if implemented as planned).

## Scenario E: Admin Monitoring and Analytics

1. Login as ADMIN.
2. Open Orders Management page.
3. Apply date range, status filters, and search by order number.
4. Open analytics section/cards.

Expected outcomes:

- Orders table updates correctly with filters.
- Metrics show total revenue, total orders, pending orders.
- Top-selling items list reflects selected date range.

## API Contract Validation

Use contract reference in `contracts/orders-api.yaml` to validate:

- Request payload fields
- Query parameter behavior
- Response envelope consistency
- Role and authorization outcomes

## Regression Checks

- Categories, kitchen sections, and menu item pages still function.
- Auth refresh/logout behavior remains unchanged.
- Unauthorized users cannot access protected order routes.
