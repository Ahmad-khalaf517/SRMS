# Phase 0 Research - ORDER-001

## Decision 1: Reuse vertical-slice module architecture used by categories/kitchen-section/menu-item

- Decision: Implement `orders` in API with `repository`, `service`, `controller`, `routes`; implement dashboard orders module with `api`, `hooks`, `components`, `pages`, and `store`.
- Rationale: Existing SRMS modules already follow this pattern and it aligns with constitution requirements for feature-driven boundaries.
- Alternatives considered:
  - Shared generic CRUD engine: rejected because order lifecycle and analytics rules are domain-specific.
  - Controller-heavy implementation: rejected because current codebase keeps business logic in services.

## Decision 2: Keep shared contracts in `packages/api-contracts`, not legacy `packages/types` or `packages/schemas`

- Decision: Add all order DTOs, schemas, and route constants under `packages/api-contracts/src/orders` and consume via `@srms/api-client`.
- Rationale: Constitution v1.1.0 retires legacy shared packages and enforces single source of truth in `api-contracts`.
- Alternatives considered:
  - Reintroduce `packages/types` and `packages/schemas`: rejected as unconstitutional and duplication-prone.

## Decision 3: Use client-side draft cart for v1 pre-submit editing

- Decision: Represent unsubmitted order editing as an in-memory POS cart (Zustand) and persist only on placement.
- Rationale: Requirement focuses on edit-before-submit speed; this approach minimizes API complexity and preserves lifecycle statuses (`PENDING -> PREPARING -> READY -> COMPLETED`).
- Alternatives considered:
  - Persisted server-side draft status: rejected for v1 due to added lifecycle/state complexity and not mandatory in spec.

## Decision 4: Backend-authoritative totals with price snapshot on order item

- Decision: Service computes subtotal/tax/total and stores order-item unit price at ordering time.
- Rationale: Required by spec and prevents historical drift when menu prices change.
- Alternatives considered:
  - Frontend-authoritative totals: rejected due to trust and consistency risks.
  - Recompute historical totals from current menu price: rejected as inaccurate for reporting.

## Decision 5: Keep strict status transition logic in service layer

- Decision: Allow only adjacent transitions (`PENDING -> PREPARING -> READY -> COMPLETED`) with role checks.
- Rationale: Consistent with existing service responsibility and prevents invalid state jumps.
- Alternatives considered:
  - DB-level transition logic: rejected as less explicit and harder to test with business rules.
  - Controller-level transition checks: rejected due to layering concerns.

## Decision 6: Analytics implemented using MongoDB aggregations

- Decision: Use aggregate pipelines for metrics and top-selling items, matched first by `restaurantId` and date range.
- Rationale: Efficient server-side computation for dashboard KPIs without loading large datasets into app memory.
- Alternatives considered:
  - Precomputed materialized summaries: rejected for v1 complexity.
  - Client-side analytics calculations: rejected for scalability and security.

## Decision 7: Introduce `completedAt` now; defer `orderType` and `paymentStatus`

- Decision: Add `completedAt` to Order model now for reliable revenue window analytics; defer `orderType` and `paymentStatus` to future related domains.
- Rationale: `completedAt` provides immediate value to reporting with low complexity; other fields belong to out-of-scope feature sets.
- Alternatives considered:
  - Add all future fields now: rejected due to premature complexity and unclear behavior.
  - Add none now: rejected because `completedAt` materially improves analytics correctness.

## Decision 8: Real-time kitchen integration is deferred-compatible

- Decision: Initial implementation supports polling-based status refresh; contracts/service design remain compatible with future Socket.IO event emission.
- Rationale: Delivers required functionality now while preserving expansion path for kitchen app and real-time dashboards.
- Alternatives considered:
  - Require Socket.IO in v1: rejected as unnecessary for initial scope and higher delivery risk.
