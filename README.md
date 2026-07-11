# SRMS

SRMS is a role-based restaurant management system built as a full-stack TypeScript monorepo. It supports restaurant setup, authentication, menu management, kitchen workflow, cashier POS ordering, admin monitoring, analytics, and user management.

Presentation-ready demo documentation is available in [PROJECT_DEMO.md](./PROJECT_DEMO.md).

## Features

- Role-based access for `ADMIN`, `CASHIER`, and `KITCHEN_STAFF`
- Restaurant signup and authentication
- Category management
- Kitchen section management
- Menu item management
- Cashier POS ordering flow
- Cashier order history
- Kitchen order status progression
- Admin order monitoring and analytics
- Admin user management with business-rule protection

## Tech Stack

### Frontend

- React 19
- Vite
- TypeScript
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- Cookie-based refresh tokens
- Pino logging

### Monorepo

- pnpm workspaces
- Shared contracts package
- Shared API client package
- Shared UI package

## Repository Structure

```text
SRMS/
├── apps/
│   ├── api/          # Express + MongoDB backend
│   └── dashboard/    # React + Vite frontend
├── packages/
│   ├── api-client/   # Shared typed API calls
│   ├── api-contracts/# Shared DTOs, schemas, route constants
│   ├── ui/           # Shared UI components
│   ├── eslint-config/
│   └── typescript-config/
├── specs/            # Feature planning and implementation specs
├── PROJECT_DEMO.md   # Presentation-ready documentation
└── README.md
```

## Prerequisites

Make sure the following are installed before starting the project:

- Node.js `20+`
- pnpm `11+`
- MongoDB running locally or a MongoDB connection string

You can verify your versions with:

```bash
node -v
pnpm -v
```

## Environment Setup

There are no committed `.env` files in the repository, so you need to create them manually.

### 1. Backend Environment

Create a file at `apps/api/.env` with the following values:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/srms
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
REFRESH_COOKIE_NAME=srms_refresh_token
API_VERSION=1
CORS_ORIGINS=http://localhost:5173
LOG_LEVEL=info
NODE_ENV=development
```

### 2. Frontend Environment

Create a file at `apps/dashboard/.env` with the following values:

```env
VITE_PORT=5173
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Installation

From the project root, install all workspace dependencies:

```bash
pnpm install
```

## How To Start The Project

You can run the project either as two separate apps or together from the root.

### Option 1: Start Backend and Frontend Separately

From the project root:

```bash
pnpm dev:backend
```

This starts the API server.

Then in another terminal:

```bash
pnpm dev:frontend
```

This starts the dashboard app.

### Option 2: Start Everything Together

From the project root:

```bash
pnpm dev
```

This runs all workspace `dev` scripts in parallel.

## Default Local URLs

- Frontend: `http://localhost:5173`
- Backend API base: `http://localhost:3000/api/v1`

## Useful Commands

From the project root:

```bash
pnpm dev              # Start all apps in parallel
pnpm dev:backend      # Start only the backend
pnpm dev:frontend     # Start only the frontend
pnpm lint             # Run lint across workspaces
pnpm format           # Format apps and packages
```

### API Commands

```bash
pnpm --filter api dev
pnpm --filter api typecheck
pnpm --filter api lint
pnpm --filter api start
```

### Dashboard Commands

```bash
pnpm --filter dashboard dev
pnpm --filter dashboard typecheck
pnpm --filter dashboard lint
pnpm --filter dashboard build
```

## How The App Works

### Admin

- logs in and accesses the admin dashboard
- manages categories, kitchen sections, menu items, and users
- monitors all restaurant orders
- views analytics such as totals and top-selling items

### Cashier

- logs in and is redirected to the POS
- creates customer orders from available menu items
- tracks personal orders in My Orders

### Kitchen Staff

- logs in and sees kitchen orders
- updates order status through the kitchen workflow

## Startup Flow Summary

If you just want the fastest way to run the project:

1. Install dependencies with `pnpm install`
2. Create `apps/api/.env`
3. Create `apps/dashboard/.env`
4. Make sure MongoDB is running
5. Start the backend with `pnpm dev:backend`
6. Start the frontend with `pnpm dev:frontend`
7. Open `http://localhost:5173`

## Development Notes

- The backend reads its configuration from `apps/api/.env`
- The frontend reads `VITE_API_BASE_URL` and `VITE_PORT`
- API contracts are shared through `packages/api-contracts`
- API requests are centralized in `packages/api-client`
- Session state is handled on the frontend with Zustand
- Server state and API caching are handled with TanStack Query

## Validation

To verify the project is healthy after setup:

```bash
pnpm --filter api typecheck
pnpm --filter dashboard typecheck
pnpm --filter api lint
pnpm --filter dashboard lint
```

## Documentation

- Project demo and presentation notes: [PROJECT_DEMO.md](./PROJECT_DEMO.md)

## License

See [LICENSE](./LICENSE).
