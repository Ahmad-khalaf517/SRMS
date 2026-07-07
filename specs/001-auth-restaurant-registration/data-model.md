# Phase 1 Data Model: SRMS Authentication and Restaurant Registration

## Entity: Restaurant

- Description: Tenant-level business record that owns users and operational data.
- Collection: `restaurants`
- Fields:
  - `_id`: ObjectId, primary key.
  - `name`: string, required, trimmed.
  - `address`: string, required, trimmed.
  - `phone`: string, required, normalized.
  - `email`: string, required, normalized lowercase.
  - `isActive`: boolean, default `true`.
  - `createdAt`: date, auto.
  - `updatedAt`: date, auto.
- Validation rules:
  - Name/address non-empty after trim.
  - Email valid format.
  - Phone follows accepted restaurant contact format policy.
- Indexes:
  - `email` index (non-unique, search-oriented).

## Entity: User

- Description: Authenticated account scoped to one restaurant with role-based permissions.
- Collection: `users`
- Fields:
  - `_id`: ObjectId, primary key.
  - `restaurantId`: ObjectId, required, references `restaurants._id`.
  - `name`: string, required, trimmed.
  - `email`: string, required, normalized lowercase, unique.
  - `password`: string, required, bcrypt hash only.
  - `role`: enum (`ADMIN`, `CASHIER`, `KITCHEN_STAFF`), required.
  - `isActive`: boolean, default `true`.
  - `createdAt`: date, auto.
  - `updatedAt`: date, auto.
- Validation rules:
  - Email uniqueness enforced by unique index.
  - Password never persisted unhashed.
  - Role must be within approved set.
- Indexes:
  - Unique index on `email`.
  - Index on `restaurantId`.
  - Optional compound index `(restaurantId, role)` for role-based queries.

## Entity: AuthSessionPayload (contract entity)

- Description: Auth response contract used by clients after register/login.
- Storage: Not a database collection in v1.
- Fields:
  - `user`: auth-safe user profile (no password).
  - `accessToken`: JWT access token string.
  - `refreshToken`: refresh token string or secure-cookie-managed token reference (implementation decision in tasks).

## Relationships

- Restaurant 1 -> N Users.
- User belongs to exactly one Restaurant.

## State Transitions

### User Authentication Lifecycle

1. `UNAUTHENTICATED` -> `AUTHENTICATED`
   - Trigger: successful register/login.
2. `AUTHENTICATED` -> `UNAUTHENTICATED`
   - Trigger: logout, token expiry without refresh, invalid/revoked credentials.

### User Active State

1. `isActive=true` users may authenticate.
2. `isActive=false` users are denied login.

## Transaction Boundaries

- Register flow (`restaurant` + first `user`) must execute in one Mongo transaction.
- If either write fails, rollback all writes.

## Data Integrity Rules

- Registration request must be atomic and idempotency-safe for duplicate submission paths.
- Password values must never appear in API response, logs, or client state payloads.
- All inbound auth payloads must pass Zod validation before database or crypto operations.
