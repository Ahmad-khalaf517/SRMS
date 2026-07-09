# Implementation Plan: Restaurant Category Management (CATEGORY-001)

**Branch**: `002-category-management` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-category-management/spec.md`

## Summary

Implement full CRUD category management for restaurant admins. Categories are
restaurant-scoped and will serve as menu item groupings in the next feature.
The implementation follows the existing `modules/auth` vertical-slice pattern on
the API and mirrors the `modules/auth` module layout on the dashboard.
All shared contracts land in `packages/api-contracts/src/categories/` and all
API call functions land in `packages/api-client/src/categories.ts`.

## Technical Context

**Language/Version**: TypeScript 5.9.x (API + dashboard + shared packages)

**Primary Dependencies**: Express 5, Mongoose 9, Zod 4, React 19, TanStack Query 5, React Hook Form 7, Zustand 5, shadcn/ui, Sonner

**Storage**: MongoDB via Mongoose — new `categories` collection

**Testing**: Unit/integration tests required for this domain (categories enters automated-test phase per constitution). Frontend tests cover rendering, pagination, admin visibility, form validation, delete confirmation.

**Target Platform**: Node.js server (API), modern browsers (dashboard)

**Project Type**: Monorepo web application feature slice

**Performance Goals**: List endpoint < 200 ms p95 with default pagination (10 items); write operations < 500 ms p95

**Constraints**: Constitution compliance, shared-contract reuse, restaurant-scope isolation enforced at service layer, no cross-restaurant leakage

**Scale/Scope**: Initial deployment: single-restaurant proof, built to scale via `restaurantId` tenant scoping

## Constitution Check

_GATE: Evaluated before Phase 0 research and re-checked after Phase 1 design._

- ✅ Domain boundaries: `modules/categories` in API and dashboard — no layer-first drift.
- ✅ Shared contracts: `packages/api-contracts/src/categories/` for DTOs, schemas, route constants. No app-local duplication.
- ✅ DTO naming: `CategoryDTO`, `CreateCategoryDTO`, `UpdateCategoryDTO`, `CategoryListDTO` — all follow `<Entity><Action>DTO`.
- ✅ API client: `packages/api-client/src/categories.ts` contains all 5 call functions. Dashboard imports directly.
- ✅ Validation: `CreateCategorySchema`, `UpdateCategorySchema` for body; `PaginationQuerySchema` (reused from http) for query. All validated at API boundary via existing `validate` middleware.
- ✅ AuthN/AuthZ: `authenticate` middleware on all routes; `authorize([USER_ROLE.ADMIN])` on POST/PATCH/DELETE. Frontend `/categories` in `ProtectedRoute`. Admin controls conditionally rendered from session store.
- ✅ State ownership: TanStack Query for list/mutations. Zustand not used for category data. Dialog/form state is local React state.
- ✅ Session strategy: Existing httpOnly cookie + in-memory access token — no changes needed.
- ✅ API envelope + AppError: `sendSuccess`, `ValidationError`, `ConflictError`, `NotFoundError`, `ForbiddenError` — all reused from shared infrastructure.
- ✅ Real-time: Not applicable for category CRUD v1.
- ✅ Testing: Automated tests required — unit/integration for API; component/interaction tests for dashboard.
- ✅ Future-proofing: All 5 questions answered YES in spec.
- ✅ No constitution exceptions.

### Post-Design Re-check

PASS. Generated artifacts (research, data-model, contracts, quickstart) maintain full constitution alignment.

## Project Structure

### Documentation (this feature)

```text
specs/002-category-management/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── category-api.yaml
└── tasks.md             # created by /speckit.tasks
```

### Source Code Layout

```text
packages/
├── api-contracts/src/categories/
│   ├── category.types.ts     # Category, CreateCategoryDTO, UpdateCategoryDTO, CategoryList, PaginationMeta
│   ├── schemas.ts             # CreateCategorySchema, UpdateCategorySchema (CategoryQuerySchema reuses http/PaginationQuerySchema)
│   ├── constants.ts           # CATEGORY_ENDPOINTS
│   └── index.ts               # barrel
└── api-client/src/
    └── categories.ts          # getCategories, createCategory, updateCategory, deleteCategory

apps/
├── api/src/modules/categories/
│   ├── controller/
│   │   └── category.controller.ts
│   ├── service/
│   │   └── category.service.ts
│   ├── repository/
│   │   └── category.repository.ts
│   └── routes/
│       └── category.routes.ts
└── dashboard/src/modules/categories/
    ├── api/
    │   └── index.ts            # calls getCategories / createCategory / etc. from @srms/api-client
    ├── hooks/
    │   ├── use-categories.ts
    │   ├── use-create-category.ts
    │   ├── use-update-category.ts
    │   └── use-delete-category.ts
    ├── components/
    │   ├── category-form.tsx         # shared create/edit form (React Hook Form + Zod)
    │   └── delete-category-dialog.tsx
    ├── schemas/
    │   └── category-form.schema.ts   # wraps CreateCategorySchema / UpdateCategorySchema for form use
    └── pages/
        └── categories-page.tsx
```

**Structure Decision**: Follow the `modules/auth` vertical-slice pattern exactly. No new shared infrastructure needed — all auth, middleware, error, and response utilities are already in place.

## 1. Current State Analysis

### Repository and Architecture

- Monorepo with pnpm workspaces; `apps/api`, `apps/dashboard`, shared `packages/`.
- `apps/api` has `modules/auth` as the only existing feature module. All shared HTTP infrastructure (`response`, `middleware`, `AppError`, `logger`, `validate`) is already in place.
- `apps/dashboard` has `modules/auth` and `modules/dashboard` (read-only). Auth session, ProtectedRoute, RoleGuard, GuestRoute, and the `modules/auth/api/index.ts` pattern are all established.
- `packages/api-contracts` has `auth`, `user`, `restaurant`, `orders`, `payments`, `http`, `health` domains. No `categories` domain yet.
- `packages/api-client` has only `auth.ts`. No `categories.ts` yet.

### Dependencies Already Available

- API: `express`, `mongoose`, `zod`, `pino`, all auth utilities — all present. No new runtime dependencies needed.
- Dashboard: `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zustand`, `sonner`, `@srms/api-contracts`, `@srms/api-client` — all present. No new dashboard dependencies needed.

## 2. Architecture Impact

### Affected Applications

- `apps/api`: new `modules/categories` vertical slice. Register routes in `apps/api/src/app.ts`.
- `apps/dashboard`: new `modules/categories` module. Add `/categories` route in `app-routes.tsx`.

### Affected Shared Packages

- `packages/api-contracts`: add `categories` domain (types, schemas, constants, index).
- `packages/api-client`: add `categories.ts` and export from `index.ts`.

### No Breaking Changes

- No existing modules, routes, or types are modified.
- Adding the categories domain to `packages/api-contracts/src/index.ts` is additive.

## 3. Backend Implementation Plan

### Module Structure

```
apps/api/src/modules/categories/
├── controller/category.controller.ts   — 5 handlers: list, create, update, delete (+ optional getById)
├── service/category.service.ts         — business logic: scope, uniqueness, CRUD
├── repository/category.repository.ts   — Mongoose model + DB queries
└── routes/category.routes.ts           — Express Router wiring + middleware
```

### Database

**Mongoose Schema** (`category.repository.ts`):

```ts
const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  },
  { timestamps: true },
);

// Indexes
categorySchema.index({ restaurantId: 1 });
categorySchema.index({ restaurantId: 1, createdAt: -1 });
categorySchema.index({ name: 1, restaurantId: 1 }, { unique: true });
```

**Repository functions** (thin DB layer):

- `findCategoriesByRestaurant(restaurantId, page, limit)` → `{ docs, total }`
- `findCategoryById(id, restaurantId)` → document or null
- `findCategoryByName(name, restaurantId, excludeId?)` → document or null (duplicate check)
- `createCategory(payload)` → created document
- `updateCategoryById(id, restaurantId, payload)` → updated document or null
- `deleteCategoryById(id, restaurantId)` → deleted document or null

### API Routes

| Method | Path                     | Middleware                                                                       | Handler                    |
| ------ | ------------------------ | -------------------------------------------------------------------------------- | -------------------------- |
| GET    | `/api/v1/categories`     | `authenticate`, `validate({ query: PaginationQuerySchema })`                     | `listCategoriesController` |
| POST   | `/api/v1/categories`     | `authenticate`, `authorize([ADMIN])`, `validate({ body: CreateCategorySchema })` | `createCategoryController` |
| PATCH  | `/api/v1/categories/:id` | `authenticate`, `authorize([ADMIN])`, `validate({ body: UpdateCategorySchema })` | `updateCategoryController` |
| DELETE | `/api/v1/categories/:id` | `authenticate`, `authorize([ADMIN])`                                             | `deleteCategoryController` |

### Service Layer

**`category.service.ts`** responsibilities:

- `listCategories(restaurantId, page, limit)`: query repository, build `CategoryListDTO` with pagination meta.
- `createCategory(restaurantId, dto)`: trim name, check duplicate, create, return `CategoryDTO`.
- `updateCategory(restaurantId, id, dto)`: find by id+restaurantId (throw `NotFoundError` if missing), check duplicate excluding self, update, return `CategoryDTO`.
- `deleteCategory(restaurantId, id)`: find by id+restaurantId (throw `NotFoundError` if missing), delete.

### Controller Layer

Each controller:

1. Extracts `auth.restaurantId` from `req.auth` (set by `authenticate` middleware).
2. Calls service.
3. Calls `sendSuccess(res, data, message, statusCode)`.
4. Delegates errors to `next(error)`.

### Security

- `restaurantId` is **never** read from `req.body` or `req.params`. Always from `req.auth.restaurantId`.
- `authenticate` middleware verifies JWT and sets `req.auth`. Requests without valid token get 401.
- `authorize([USER_ROLE.ADMIN])` checks `req.auth.role`. Non-admin gets 403.
- `findCategoryById(id, restaurantId)` always filters by both fields — prevents cross-restaurant access even for valid IDs.

### App Registration

In `apps/api/src/app.ts`:

```ts
import categoryRoutes from '@/modules/categories/routes/category.routes';
// ...
app.use(BASE_URL, categoryRoutes);
```

## 4. Shared Packages Plan

### `packages/api-contracts/src/categories/`

**`category.types.ts`**:

```ts
export type Category = { id; name; description?; restaurantId; createdAt; updatedAt };
export type CreateCategoryDTO = { name: string; description?: string };
export type UpdateCategoryDTO = { name?: string; description?: string };
export type PaginationMeta = { page; limit; total; totalPages };
export type CategoryList = { data: Category[]; pagination: PaginationMeta };
export type CategoryResponse = { success: true; message: string; data: Category };
export type CategoryListResponse = { success: true; message: string; data: CategoryList };
```

**`schemas.ts`**:

- `CreateCategorySchema`: `name` (trim, min 2, max 100), `description` (trim, max 500, optional).
- `UpdateCategorySchema`: same fields but both optional, `.refine` at least one field present.
- `CategoryQuerySchema`: re-export or alias `PaginationQuerySchema` from `@srms/api-contracts/http`.

**`constants.ts`**:

```ts
export const CATEGORY_ENDPOINTS = {
  BASE: '/categories',
  BY_ID: (id: string) => `/categories/${id}`,
} as const;
```

**`index.ts`**: `export * from './category.types'; export * from './schemas'; export * from './constants';`

Update `packages/api-contracts/src/index.ts` to add `export * from './categories';`.
Update `packages/api-contracts/package.json` exports to add `./categories` entry.

### `packages/api-client/src/categories.ts`

```ts
export const getCategories = (client, params) => ...GET CATEGORY_ENDPOINTS.BASE...
export const createCategory = (client, payload) => ...POST...
export const updateCategory = (client, id, payload) => ...PATCH...
export const deleteCategory = (client, id) => ...DELETE...
```

Update `packages/api-client/src/index.ts` to add `export * from './categories.js';`.

## 5. Frontend Implementation Plan

### Module Structure

```
apps/dashboard/src/modules/categories/
├── api/index.ts                   — calls api-client functions using authApiClient
├── hooks/
│   ├── use-categories.ts          — useQuery(['categories', page, limit])
│   ├── use-create-category.ts     — useMutation + invalidate
│   ├── use-update-category.ts     — useMutation + invalidate
│   └── use-delete-category.ts     — useMutation + invalidate
├── components/
│   ├── category-form.tsx          — React Hook Form + Zod; used for both create and edit
│   └── delete-category-dialog.tsx — confirmation dialog wrapping shadcn AlertDialog
└── pages/
    └── categories-page.tsx        — list page with table, pagination, dialogs
```

### `api/index.ts` Pattern

```ts
import { getCategories, createCategory, updateCategory, deleteCategory } from '@srms/api-client';
import { authApiClient } from '@/modules/auth/api/client';
// thin wrappers that bind authApiClient
export const getCategoriesRequest = (params) => getCategories(authApiClient, params);
export const createCategoryRequest = (payload) => createCategory(authApiClient, payload);
export const updateCategoryRequest = (id, payload) => updateCategory(authApiClient, id, payload);
export const deleteCategoryRequest = (id) => deleteCategory(authApiClient, id);
```

### Hooks

- **`use-categories.ts`**: `useQuery({ queryKey: ['categories', { page, limit }], queryFn: () => getCategoriesRequest({ page, limit }) })`.
- **`use-create-category.ts`**: `useMutation` → on success: `toast.success`, invalidate `['categories']`.
- **`use-update-category.ts`**: `useMutation` → same pattern.
- **`use-delete-category.ts`**: `useMutation` → same pattern.

All mutation error handlers: `toast.error(getErrorMessage(error))`.

### `categories-page.tsx`

States handled:

- **Loading**: skeleton rows in table.
- **Empty**: friendly empty state message; "New Category" button visible for admin only.
- **Error**: error message with retry button.
- **Data**: `<DataTable>` (reuse existing `@/components/data-table`) or a simple `<Table>` from `@srms/ui` with columns: Name, Description, Created Date, Actions.

Admin detection: `const isAdmin = authUser?.role === USER_ROLE.ADMIN` from `useAuthSessionStore`.

Pagination: controlled state `[page, setPage]` passed to `use-categories` hook.

Dialog state: `const [createOpen, setCreateOpen] = useState(false)` etc. — no Zustand.

### `category-form.tsx`

- Accepts `defaultValues` prop (undefined = create mode, filled = edit mode).
- Uses `useForm` with `zodResolver(CreateCategorySchema)` or `zodResolver(UpdateCategorySchema)`.
- Fields: `name` (required), `description` (optional textarea).
- Shows inline field errors below inputs.
- Submit button disabled and shows "Saving..." while mutation is pending.
- On error that is not a field-level error: `toast.error(getErrorMessage(error))`.

### `delete-category-dialog.tsx`

- Uses shadcn `AlertDialog` for confirmation.
- Shows category name in confirmation message.
- Delete button disabled while mutation is pending, shows "Deleting...".

### Route Registration

In `apps/dashboard/src/app/routes/app-routes.tsx`:

```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/categories" element={<CategoriesPage />} />
  {/* existing ADMIN-only dashboard route */}
  <Route element={<RoleGuard allowedRoles={[USER_ROLE.ADMIN]} />}>
    <Route path="/" element={<DashboardPage />} />
  </Route>
  <Route path="/403" element={<ForbiddenPage />} />
</Route>
```

Note: `/categories` is inside `ProtectedRoute` but NOT inside `RoleGuard` because all authenticated users can view. Admin-only actions are hidden at component level and enforced server-side.

### Permission Handling Summary

| Action    | Frontend enforcement              | Backend enforcement       |
| --------- | --------------------------------- | ------------------------- |
| View list | ProtectedRoute (auth required)    | `authenticate` middleware |
| Create    | Button hidden if non-admin        | `authorize([ADMIN])`      |
| Edit      | Edit button hidden if non-admin   | `authorize([ADMIN])`      |
| Delete    | Delete button hidden if non-admin | `authorize([ADMIN])`      |

## 6. Implementation Order

1. **Shared contracts** (`packages/api-contracts/src/categories/`) — blocks all other work.
2. **API client** (`packages/api-client/src/categories.ts`) — blocks dashboard.
3. **Category repository** — blocks service; no dependencies outside Mongoose.
4. **Category service** — blocks controller; depends on repository.
5. **Category controller + routes** — depends on service; register in `app.ts`.
6. **Dashboard API module** (`modules/categories/api/`) — depends on api-client.
7. **Dashboard hooks** — depends on dashboard API module.
8. **`category-form.tsx` + `delete-category-dialog.tsx`** — can start in parallel with hooks.
9. **`categories-page.tsx`** — depends on hooks + components.
10. **Route registration** (`app-routes.tsx`) — depends on page component.
11. **Tests** — backend unit/integration; dashboard component tests.
12. **Acceptance validation** per quickstart.md scenarios.

## 7. Risks and Technical Decisions

### Risks

| Risk                                                  | Likelihood | Impact | Mitigation                                                  |
| ----------------------------------------------------- | ---------- | ------ | ----------------------------------------------------------- |
| Unique compound index conflict on concurrent create   | Low        | Medium | Application-layer duplicate check; DB index as backup       |
| Cross-restaurant data leak via direct ID manipulation | Low        | High   | `findCategoryById(id, restaurantId)` always filters on both |
| Self-update false conflict                            | Low        | Low    | Exclude `_id` in duplicate name query                       |
| TanStack Query cache stale after mutation             | Low        | Low    | Invalidate `['categories']` on every mutation success       |
| `restaurantId` injected from request body             | Low        | High   | Service layer only reads `restaurantId` from auth context   |

### No New Dependencies Required

- API: all existing utilities cover this feature.
- Dashboard: all required packages (`@tanstack/react-query`, `react-hook-form`, `sonner`, `@srms/api-contracts`, `@srms/api-client`) are already in `apps/dashboard/package.json`.

### Migration Considerations

- No existing data migration needed (new collection).
- MongoDB indexes created automatically on first write; no manual migration scripts required for development.
- Unique compound index `{ name, restaurantId }` is safe to add to a new empty collection.

## 8. Definition of Completion

Feature implementation is complete when:

1. `GET /categories`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id` pass all acceptance scenarios A–K in quickstart.md.
2. Restaurant isolation is verified (Scenario C).
3. Role enforcement returns 403 for non-admin write attempts (Scenario F).
4. Dashboard renders list with loading/empty/error states, pagination, and admin-only controls.
5. Create, edit, and delete dialogs function end-to-end with success/error feedback.
6. All typechecks pass: `pnpm --filter @srms/api-contracts typecheck && pnpm --filter @srms/api-client typecheck && pnpm --filter api typecheck && pnpm --filter dashboard typecheck`.
7. Backend unit/integration tests cover create, duplicate, isolation, admin authz, non-admin forbidden, pagination.
8. Frontend component tests cover list rendering, pagination, admin visibility, form validation, delete confirmation.
9. Constitution compliance check passes with no exceptions.

## Complexity Tracking

No constitution violations identified. No exception tracking required.
