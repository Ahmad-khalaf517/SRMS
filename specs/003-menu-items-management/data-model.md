# Phase 1 Data Model: Menu Items Management (MENU-001)

## Entity: Menu Item

- **Description**: An orderable product offered by a restaurant. It belongs to exactly one Category and one Kitchen Section and has a current availability state.
- **Collection**: `menu_items`
- **Fields**:
  - `_id`: ObjectId, primary key.
  - `name`: string, required, trimmed.
  - `description`: string, optional, trimmed.
  - `price`: number, required, positive.
  - `categoryId`: ObjectId, required, references `categories._id`.
  - `kitchenSectionId`: ObjectId, required, references `kitchen_sections._id`.
  - `restaurantId`: ObjectId, required, references `restaurants._id`.
  - `isAvailable`: boolean, required, default `true`.
  - `createdAt`: date, auto-generated.
  - `updatedAt`: date, auto-generated.

## Validation Rules

- `name`
  - required
  - trimmed
  - min length 2
  - max length 120
- `description`
  - optional
  - trimmed
  - max length 500
- `price`
  - required
  - number
  - must be greater than 0
- `categoryId`
  - required
  - must exist
  - must belong to the same restaurant as the authenticated user
- `kitchenSectionId`
  - required
  - must exist
  - must belong to the same restaurant as the authenticated user
- `restaurantId`
  - required
  - derived from authenticated request context, not client input
- `isAvailable`
  - defaults to `true`

## Relationships

- Menu Item belongs to Category (many-to-one)
- Menu Item belongs to Kitchen Section (many-to-one)
- Menu Item belongs to Restaurant (many-to-one)

## Index Strategy

Recommended indexes:

1. `{ restaurantId: 1, createdAt: -1 }`
   - supports default paginated listing

2. `{ restaurantId: 1, name: 1 }`
   - supports fast search by name inside a restaurant scope

3. `{ restaurantId: 1, categoryId: 1 }`
   - supports category filter

4. `{ restaurantId: 1, kitchenSectionId: 1 }`
   - supports kitchen section filter

5. `{ restaurantId: 1, isAvailable: 1 }`
   - supports availability filter

6. Optional compound multi-filter index:
   - `{ restaurantId: 1, categoryId: 1, kitchenSectionId: 1, isAvailable: 1 }`
   - only if query profiling later proves it necessary

## Query Model

List queries should support these inputs:

- `page`: default 1
- `limit`: default 10, max 100
- `search`: optional partial name match, trimmed
- `categoryId`: optional exact match
- `kitchenSectionId`: optional exact match
- `isAvailable`: optional boolean

The base query is always scoped by `restaurantId`.

## Shared DTO Contracts

### `MenuItem`

Read model returned to clients:

- `id`
- `name`
- `description`
- `price`
- `categoryId`
- `kitchenSectionId`
- `restaurantId`
- `isAvailable`
- `createdAt`
- `updatedAt`

### `MenuItemListItem`

List row projection for the dashboard:

- `id`
- `name`
- `price`
- `categoryId`
- `categoryName`
- `kitchenSectionId`
- `kitchenSectionName`
- `isAvailable`
- `createdAt`

### `CreateMenuItemDTO`

- `name`
- `description?`
- `price`
- `categoryId`
- `kitchenSectionId`
- `isAvailable?`

### `UpdateMenuItemDTO`

- `name?`
- `description?`
- `price?`
- `categoryId?`
- `kitchenSectionId?`
- `isAvailable?`

### `MenuItemFiltersDTO`

- `page`
- `limit`
- `search?`
- `categoryId?`
- `kitchenSectionId?`
- `isAvailable?`

## State Transitions

### Availability lifecycle

- `AVAILABLE` → `UNAVAILABLE`
- `UNAVAILABLE` → `AVAILABLE`

Availability toggle is the only state transition in this feature.

### Existence lifecycle

- `CREATED`
- `UPDATED`
- `DELETED`

## Referential Integrity Rules

Because MongoDB/Mongoose does not enforce foreign keys:

- Create and update services must verify that `categoryId` exists for the same restaurant.
- Create and update services must verify that `kitchenSectionId` exists for the same restaurant.
- Cross-restaurant references must be rejected before insert/update.

## Future Order-System Considerations

The following design choices avoid future breaking changes:

- `isAvailable` is first-class instead of derived.
- `categoryId` and `kitchenSectionId` are explicit stable references.
- `price` is numeric and suitable for calculations.
- `restaurantId` is stored on the document for tenant isolation and faster list queries.
