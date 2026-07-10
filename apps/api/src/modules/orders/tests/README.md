# Orders Domain Test Scaffolding

This folder reserves the ORDER-001 backend test surface for future automation.

## Planned Coverage

- Repository tests
  - create order with items
  - list/filter orders
  - my-orders creator scoping
  - metrics and top-selling aggregations
- Service tests
  - totals and order-number generation
  - status transition validation
  - not-found and validation error paths
- Controller/route tests
  - role access control per endpoint
  - request validation schemas
  - envelope response shape

## Suggested Structure

- unit/
  - orders.service.test.ts
  - orders.repository.test.ts
- integration/
  - orders.routes.test.ts

## Notes

- Keep fixtures restaurant-scoped to verify tenant isolation.
- Include transition matrix assertions for status lifecycle behavior.
