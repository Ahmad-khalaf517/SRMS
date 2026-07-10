# Data Model - ORDER-001

## 1. Order

### Description

Restaurant-scoped aggregate root representing a customer transaction initiated by a cashier and progressed by kitchen workflow.

### Fields

- `_id`: ObjectId (primary key)
- `orderNumber`: string (restaurant-unique human-friendly identifier)
- `status`: `PENDING | PREPARING | READY | COMPLETED` (future optional `CANCELLED`)
- `subtotal`: number (backend-calculated, >= 0)
- `tax`: number (backend-calculated, >= 0)
- `total`: number (`subtotal + tax`)
- `restaurantId`: ObjectId (required, immutable)
- `createdBy`: ObjectId (cashier user id)
- `completedAt`: Date | null (recommended now; set when status becomes COMPLETED)
- `createdAt`: Date
- `updatedAt`: Date

### Validation Rules

- `orderNumber` required and unique within restaurant scope.
- `status` must be valid enum value.
- `subtotal`, `tax`, `total` must be non-negative and internally consistent.
- `restaurantId` and `createdBy` derived from auth/ownership context, not client input.

## 2. OrderItem

### Description

Line item belonging to an order with immutable price snapshot at ordering time.

### Fields

- `_id`: ObjectId (primary key)
- `orderId`: ObjectId (required, reference to Order)
- `menuItemId`: ObjectId (required, reference to MenuItem)
- `quantity`: number (integer, >= 1)
- `price`: number (unit price snapshot, > 0)
- `notes`: string | null (optional prep notes)
- `status`: optional line-level status if needed for future kitchen granularity
- `restaurantId`: ObjectId (required for scoping and analytics)
- `createdAt`: Date
- `updatedAt`: Date

### Validation Rules

- `menuItemId` must exist in same restaurant.
- `quantity` must be positive integer.
- `price` is sourced from backend/menu item and persisted as snapshot.
- `notes` length constrained by shared schema.

## 3. OrderMetrics (Read Model)

### Description

Aggregated analytics response scoped by restaurant and date range.

### Fields

- `totalRevenue`: number
- `totalOrders`: number
- `pendingOrders`: number (count of `PENDING` + `PREPARING`)
- `dateRange`: `{ from: ISODate, to: ISODate }`

## 4. TopSellingItem (Read Model)

### Description

Top-selling menu item summary in a period.

### Fields

- `menuItemId`: string
- `name`: string
- `quantitySold`: number
- `revenueContribution`: number (optional but recommended)

## Relationships

- Order (N) -> Restaurant (1)
- Order (N) -> User (1, createdBy)
- Order (1) -> OrderItem (N)
- OrderItem (N) -> MenuItem (1)

## State Transitions

### Order status lifecycle

- `PENDING -> PREPARING`
- `PREPARING -> READY`
- `READY -> COMPLETED`

### Rejected transitions

- Any backward transition
- Any skip transition (e.g., `PENDING -> READY`)
- Any status change after `COMPLETED` (unless future cancellation policy introduces exceptions)

## Ownership and Access Rules

- CASHIER creates orders and can read only own orders.
- KITCHEN_STAFF updates status for restaurant-scoped orders.
- ADMIN reads all restaurant orders and analytics.
- All reads/writes must include restaurant scoping in repository queries.
