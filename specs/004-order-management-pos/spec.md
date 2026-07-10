# Feature Specification: Order Management & POS

**Feature Branch**: `004-order-management-pos`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "Implement ordering feature, cashier creates and edits orders, admin monitors orders and analytics, with ingredient customization/order type/table management out of scope for now."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Create and Place POS Order (Priority: P1)

A cashier creates a new order from the POS by searching and browsing menu items, adding items to a cart, adjusting quantities, adding item notes, reviewing totals, and placing the order for kitchen execution.

**Why this priority**: This is the core revenue path; without order creation and placement, the ordering domain provides no business value.

**Independent Test**: Can be fully tested by logging in as a cashier, creating an order with at least one item, placing it, and confirming the order is persisted with generated order number and Pending status.

**Acceptance Scenarios**:

1. **Given** a cashier is on the POS screen and menu items are available, **When** the cashier adds items and places the order, **Then** the system validates the order, creates order and order-item records, assigns an order number, and sets status to Pending.
2. **Given** a cashier modifies quantities or notes in the cart, **When** values change, **Then** subtotal, tax, and total are recalculated and displayed before placement.
3. **Given** the cashier attempts to place an empty cart, **When** submission occurs, **Then** the system rejects the request with a clear validation message.

---

### User Story 2 - Edit Draft Before Submission (Priority: P1)

A cashier updates an unsubmitted order to correct mistakes before sending work to the kitchen.

**Why this priority**: Fast correction before submission prevents operational errors and kitchen rework.

**Independent Test**: Can be fully tested by creating a draft order, editing items/quantity/notes, and confirming totals and saved draft state update correctly.

**Acceptance Scenarios**:

1. **Given** an order is in draft state and not yet submitted, **When** the cashier adds/removes items or changes quantity/notes, **Then** the order is updated and totals are recalculated.
2. **Given** an order has already been placed, **When** the cashier attempts draft-edit actions, **Then** the system prevents draft-only edits.

---

### User Story 3 - Cashier Tracks Own Orders (Priority: P2)

A cashier views only the orders they created, with search and status filtering, to monitor progress from Pending through completion.

**Why this priority**: Visibility for cashier-owned work reduces confusion and improves handoff clarity.

**Independent Test**: Can be fully tested by creating orders with two different cashier accounts and verifying each cashier sees only their own orders with working search and status filters.

**Acceptance Scenarios**:

1. **Given** multiple cashiers have orders in the same restaurant, **When** one cashier opens My Orders, **Then** only their own orders are listed.
2. **Given** a cashier applies status or search filters, **When** results are returned, **Then** matching orders and current status are shown correctly.

---

### User Story 4 - Kitchen Updates Order Progress (Priority: P2)

Kitchen staff receives placed orders and advances their status through the allowed lifecycle to reflect preparation progress.

**Why this priority**: Order lifecycle tracking is required to coordinate cashier, kitchen, and reporting workflows.

**Independent Test**: Can be fully tested by placing an order, updating status in sequence (Pending -> Preparing -> Ready -> Completed), and verifying invalid transitions are rejected.

**Acceptance Scenarios**:

1. **Given** an order is Pending, **When** kitchen staff updates it to Preparing, Ready, then Completed, **Then** each transition is accepted and persisted.
2. **Given** an invalid status jump is requested, **When** update is submitted, **Then** the system rejects the transition and leaves status unchanged.

---

### User Story 5 - Admin Monitors Orders and Analytics (Priority: P3)

An admin views operational order tables and analytics metrics to monitor performance over a selected date range.

**Why this priority**: Managerial reporting is critical but depends on core ordering flow already producing data.

**Independent Test**: Can be fully tested by loading the admin orders dashboard, filtering by date and status, and validating revenue, order counts, pending counts, and top-selling items for the selected period.

**Acceptance Scenarios**:

1. **Given** an admin opens the orders dashboard, **When** date and status filters are applied, **Then** table data updates with order number, status, total, creator, and created date.
2. **Given** completed and in-progress orders exist, **When** analytics is requested for a date range, **Then** total revenue, total orders, pending/preparing counts, and top-selling items are displayed.

---

### Edge Cases

- Menu item becomes unavailable after being added to cart but before placement.
- Menu item price changes after being added to cart; placement must use backend rules for final stored price snapshot.
- Cashier session expires while editing or placing an order.
- Two updates target the same draft order concurrently.
- A status update is requested for an order outside the requestor's restaurant.
- Date-range filters return no data for analytics.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a POS screen for CASHIER users to browse and search menu items.
- **FR-002**: System MUST allow cashiers to add, remove, and modify items in an in-progress order cart.
- **FR-003**: System MUST allow cashiers to set per-item quantity and optional preparation notes.
- **FR-004**: System MUST compute and display informational subtotal, tax, and total in the POS before submission.
- **FR-005**: System MUST validate that an order contains at least one item before placement.
- **FR-006**: System MUST calculate authoritative subtotal, tax, and total on the backend when saving or placing an order.
- **FR-007**: System MUST generate a unique order number when an order is placed.
- **FR-008**: System MUST set newly placed orders to Pending status and persist associated order items.
- **FR-009**: System MUST support draft editing only for orders not yet submitted.
- **FR-010**: System MUST expose cashier order listing restricted to orders created by the authenticated cashier.
- **FR-011**: System MUST support cashier order search and status filtering in My Orders.
- **FR-012**: System MUST allow KITCHEN_STAFF to transition statuses only through valid lifecycle steps (Pending -> Preparing -> Ready -> Completed).
- **FR-013**: System MUST reject invalid status transitions and keep existing status unchanged.
- **FR-014**: System MUST provide ADMIN order monitoring with table columns: order number, status, total, created by, and created at.
- **FR-015**: System MUST support ADMIN order filtering by date range and status, and search by order number.
- **FR-016**: System MUST provide analytics metrics filtered by date range: total revenue, total orders, pending orders, and top selling items.
- **FR-017**: System MUST scope all queries and mutations by restaurantId and deny cross-restaurant access.
- **FR-018**: System MUST enforce role permissions: CASHIER for POS and own-order views, KITCHEN_STAFF for preparation status updates, ADMIN for full monitoring and analytics.
- **FR-019**: System MUST keep out-of-scope features excluded from this release: ingredient customization, order type, table management, payments, invoicing, discounts, coupons, delivery, customer ordering, and inventory deduction.

### Key Entities _(include if feature involves data)_

- **Order**: A restaurant-scoped sales transaction with order number, lifecycle status, financial totals, creator identity, and timestamps.
- **OrderItem**: A line item linked to an order containing menu item reference, quantity, captured unit price, notes, and item status.
- **OrderStatus**: Lifecycle state values governing operational progress (Pending, Preparing, Ready, Completed).
- **OrderMetrics**: Aggregated analytics output for a date range, including total revenue, total orders, pending orders, and top-selling items.
- **TopSellingItem**: Ranked item summary with menu item identity, display name, and quantity sold in the selected period.

## Constitution Alignment _(mandatory)_

- **Domain Ownership**: Ordering is owned by the orders domain as a vertical slice spanning POS creation, lifecycle progression, and analytics outputs.
- **Shared Contracts**: Shared order and metrics DTOs, schemas, and route constants are defined in packages/api-contracts/orders and consumed by backend and dashboard via packages/api-client order methods.
- **Validation Coverage**: All external inputs (create/edit payloads, status changes, query filters, and date ranges) are validated with shared Zod schemas.
- **AuthN/AuthZ Impact**: Authenticated access is required. CASHIER is limited to own orders and creation/edit before submit, KITCHEN_STAFF can progress kitchen states, ADMIN can view all restaurant orders and analytics.
- **State Ownership**: TanStack Query owns server-backed order lists/details/metrics; Zustand is limited to client session and ephemeral UI interaction state.
- **API and Errors**: API uses the standard SRMS response envelope and typed app errors for validation, unauthorized, forbidden, not found, and conflict outcomes.
- **Testing Phase Declaration**: Deferred-with-plan for this specification; implementation must include independently testable acceptance scenarios and add automated tests when test infrastructure for this domain is active.
- **Future-Proofing Check**:
  1. Yes, contracts can be reused by future kitchen/customer/delivery frontends.
  2. Yes, restaurant isolation supports multi-branch scaling.
  3. Yes, lifecycle and metrics form a base for future delivery/customer channels.
  4. Yes, explicit domain boundaries and shared contracts make extension predictable.
  5. Yes, no duplicated business rules across frontend/backend contracts.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Cashiers can create and place a standard order (at least 1 item) in under 60 seconds median time during usability testing.
- **SC-002**: 95% of order placement attempts with valid data complete successfully on first submission without manual retry.
- **SC-003**: 100% of cashier My Orders results contain only orders created by the authenticated cashier for the current restaurant.
- **SC-004**: 100% of attempted invalid status transitions are rejected and logged without changing the persisted order status.
- **SC-005**: Admin dashboard metrics for a selected date range match backend aggregation results within the same request window for total revenue, total orders, pending orders, and top-selling items.

## Assumptions

- Existing authentication, session refresh, and role assignment flows are reused as-is.
- A draft order exists implicitly as an unsubmitted in-progress order state for cashier editing.
- Restaurant tax calculation configuration already exists or has a default policy available for backend computation.
- Kitchen display/handling UI beyond status transitions is out of scope for this feature slice.
- Currency formatting and localization follow current dashboard defaults.
