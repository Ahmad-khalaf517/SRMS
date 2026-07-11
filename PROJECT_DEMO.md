# SRMS Project Demo

## 1. Project Overview

SRMS is a role-based restaurant management system built to support the day-to-day workflow of a restaurant team from a single web platform.

The project covers:

- restaurant and user onboarding
- authentication and role-based access
- category and menu item management
- kitchen section management
- cashier POS order creation
- cashier order tracking
- kitchen order progress updates
- admin order monitoring and analytics
- admin user management

The core idea behind SRMS is to separate the workflow by role so each user sees only the tools they need:

- Admin manages setup, users, menu structure, and analytics
- Cashier creates orders and tracks their own work
- Kitchen Staff processes incoming orders and updates status

## 2. Problem It Solves

In a restaurant, operations usually break when order creation, kitchen coordination, and reporting are handled in disconnected tools or manually.

SRMS solves that by providing one system where:

- orders are created in a fast POS flow
- kitchen receives clear status-based work
- admins can monitor sales and operational activity
- access is controlled by role and restaurant scope

## 3. Tech Stack

### Frontend

- React 19
- Vite
- TypeScript
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Tailwind CSS via shared UI package

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Cookie-based refresh token flow
- Zod validation
- Pino logging

### Monorepo and Shared Packages

- pnpm workspaces
- shared API contracts package
- shared API client package
- shared UI package
- shared ESLint and TypeScript config packages

## 4. Why These Technologies Were Chosen

### TypeScript

I chose TypeScript to keep the project safer as it grows. Since this system has multiple roles, many DTOs, shared contracts, and several business flows, type safety reduces bugs and makes refactoring easier.

### React

React is a strong choice for dashboard-style applications because the UI is built from reusable components and stateful screens such as POS, tables, forms, filters, and analytics cards.

### Vite

Vite gives very fast startup and hot reload during development, which is helpful when iterating on multiple dashboard pages and shared UI components.

### Express 5

Express is simple, mature, and flexible. It made it easy to organize the backend into vertical modules such as auth, categories, menu items, kitchen sections, users, and orders.

### MongoDB and Mongoose

MongoDB fits well for restaurant operations because entities like orders and order items evolve quickly and benefit from flexible document modeling. Mongoose adds schema structure, validation support, and better developer ergonomics.

### Zod

Zod was chosen because it allows me to define validation once and reuse it across the backend and frontend through shared contracts. This avoids duplicated validation logic and keeps request payloads consistent.

### TanStack Query

TanStack Query is ideal for server-state-heavy applications like this one. Lists, analytics, mutations, and refresh flows are easier to manage, and cache invalidation keeps the UI synchronized after create, update, and delete actions.

### Zustand

Zustand is lightweight and fits small but important client state well. In this project it is useful for authentication session state and POS-related client interactions without overcomplicating the app.

### React Hook Form

This was chosen because the project has many forms such as signup, login, categories, menu items, kitchen sections, and users. It gives good performance and works cleanly with Zod.

### pnpm Workspaces

pnpm workspaces were chosen to keep the frontend, backend, and shared packages in one monorepo. This is especially useful because both apps depend on the same contracts and shared utilities.

## 5. Main Dependencies and Their Role

| Dependency      | Where It Is Used       | Why It Matters                                          |
| --------------- | ---------------------- | ------------------------------------------------------- |
| React           | Dashboard              | Builds the UI as reusable components                    |
| Vite            | Dashboard              | Fast development server and frontend build tool         |
| React Router    | Dashboard              | Handles route protection and role-based navigation      |
| TanStack Query  | Dashboard              | Fetching, caching, mutation handling, and sync with API |
| Zustand         | Dashboard              | Lightweight session state management                    |
| React Hook Form | Dashboard              | Efficient form management                               |
| Zod             | Frontend + Backend     | Shared schema validation and typed DTOs                 |
| Express         | API                    | REST API routing and middleware composition             |
| Mongoose        | API                    | Data modeling and MongoDB access                        |
| jsonwebtoken    | API                    | Access token and refresh token flow                     |
| bcryptjs        | API                    | Password hashing                                        |
| Axios           | API client + Dashboard | Typed HTTP communication                                |
| Pino            | API                    | Structured backend logging                              |
| Sonner          | Dashboard              | Clean user feedback for mutations and errors            |
| Recharts        | Dashboard              | Analytics visualization                                 |

## 6. Architecture Overview

The project uses a monorepo structure with separate applications and shared packages.

### Applications

- apps/api: backend REST API
- apps/dashboard: frontend dashboard and POS interface

### Shared Packages

- packages/api-contracts: shared DTOs, schemas, and route constants
- packages/api-client: reusable typed client for calling backend endpoints
- packages/ui: shared UI components and styles
- packages/eslint-config: shared linting rules
- packages/typescript-config: shared TypeScript configuration

### Backend Design Pattern

The backend follows a vertical-slice module structure:

- repository
- service
- controller
- routes

This was chosen because it keeps each business domain isolated and easier to reason about. For example, orders logic stays inside the orders module instead of being scattered across the application.

### Frontend Design Pattern

The dashboard also follows module-based organization:

- api
- hooks
- components
- pages
- store when needed

This keeps each feature self-contained and makes the codebase easier to scale.

## 7. Security and Access Control

One of the important parts of this project is role-based access control.

The system currently supports:

- Admin
- Cashier
- Kitchen Staff

Security decisions in the project:

- protected routes on the frontend
- role guards for screen-level access
- backend authorization middleware for API protection
- restaurant-level data scoping
- JWT access token handling
- refresh token flow for better session continuity

This matters because a cashier should not access admin analytics, and a kitchen user should not manage menu setup or users.

## 8. User Flow

### A. Onboarding Flow

1. A restaurant signs up.
2. The initial user is created as an admin.
3. The admin logs in and enters the admin dashboard.

### B. Admin Flow

1. Admin creates categories.
2. Admin creates kitchen sections.
3. Admin creates menu items and links them to categories and kitchen sections.
4. Admin creates additional users and assigns roles.
5. Admin monitors orders and analytics.

### C. Cashier Flow

1. Cashier logs in.
2. Cashier is redirected to the POS screen.
3. Cashier browses or searches menu items.
4. Cashier adds items to cart and adjusts quantities.
5. Cashier places the order.
6. Cashier tracks their own orders from My Orders.

### D. Kitchen Staff Flow

1. Kitchen staff logs in.
2. Kitchen staff is redirected to kitchen orders.
3. They view restaurant orders assigned to kitchen workflow.
4. They update status in sequence:
   Pending -> Preparing -> Ready -> Completed

### E. Admin Monitoring Flow

1. Admin opens the orders dashboard.
2. Admin filters by date range or status.
3. Admin reviews metrics such as revenue, total orders, pending orders, and top-selling items.
4. Admin checks who created each order.

## 9. Main Features Implemented

### Authentication and Session Management

- signup and login flows
- JWT-based authentication
- refresh token support
- protected frontend routes
- role-based redirects

### User and Role Management

- admin can create users
- admin can assign roles
- admin can activate or deactivate users
- admin can delete users
- admin cannot delete self
- admin cannot deactivate self
- system protects against removing the last active admin of a restaurant
- admin does not manage their own account through the admin users list

### Category Management

- create categories
- edit categories
- delete categories
- paginated listing

### Kitchen Section Management

- create kitchen sections
- edit kitchen sections
- delete kitchen sections
- paginated listing

### Menu Item Management

- create menu items
- edit menu items
- delete menu items
- search and filter support
- category and kitchen-section linkage
- availability management

### Order Management and POS

- cashier POS interface
- add menu items to cart
- quantity updates
- item notes
- backend-authoritative order totals
- order placement with generated order number
- cashier-only order history
- kitchen status progression
- admin order table
- admin analytics and top-selling items

## 10. What Makes This Project Strong Technically

### Shared Contracts

The frontend and backend both use the same contract package. This reduces mismatch bugs and makes the system easier to maintain.

### Clear Separation of Concerns

Routes, controllers, services, repositories, UI pages, and hooks are separated cleanly. This improves readability and maintainability.

### Scalable Monorepo Structure

The project is organized in a way that can scale to more modules, more apps, or additional client interfaces later.

### Business Rules in the Right Layer

Important business rules such as order status progression, restaurant isolation, and user-management constraints are enforced in the backend service layer instead of only in the frontend.

## 11. Demo Script for Presentation

If I were presenting this project live, I would demo it in this order:

### Step 1: Introduce the Goal

"This project is a role-based restaurant management system designed to support admins, cashiers, and kitchen staff in one platform."

### Step 2: Show Architecture

- explain the monorepo
- show apps/api and apps/dashboard
- show shared packages for contracts, client, and UI

### Step 3: Show Admin Side

- login as admin
- open dashboard
- show categories
- show kitchen sections
- show menu items
- show users management
- show orders analytics

### Step 4: Show Cashier Side

- login as cashier
- show POS page
- add items to cart
- place an order
- open My Orders

### Step 5: Show Kitchen Side

- login as kitchen staff
- open kitchen orders
- update order from Pending to Preparing to Ready to Completed

### Step 6: Return to Admin Analytics

- show that the order appears in admin monitoring
- explain metrics and top-selling items

## 12. Why This Project Is Valuable as a University Project

This project demonstrates more than CRUD.

It includes:

- real business workflows
- multiple user roles
- protected routes and authorization
- shared contracts across frontend and backend
- state management decisions
- analytics aggregation
- scalable architecture choices
- production-style monorepo organization

That makes it a stronger academic project because it shows both software engineering structure and domain thinking.

## 13. Limitations and Future Improvements

Current out-of-scope or future enhancements include:

- payments and payment status
- receipts and invoice generation
- table management
- customer-facing ordering
- delivery workflow
- inventory deduction
- real-time socket updates for kitchen screens
- automated test coverage expansion

## 14. Short Conclusion for Presentation

SRMS is a full-stack restaurant operations platform that combines role-based access, POS ordering, kitchen workflow, admin analytics, and user management in one structured monorepo.

The main strength of the project is not only the number of features, but the way the system is designed: shared contracts, clear module boundaries, reusable UI, secure access control, and workflows that reflect real restaurant operations.

## 15. Quick Speaking Version

Shorter :

"SRMS is a role-based restaurant management system built with React, Express, TypeScript, and MongoDB. I used a monorepo with shared contracts so both frontend and backend stay synchronized. Admins can manage users, categories, kitchen sections, menu items, and analytics. Cashiers can create and track orders through a POS flow, while kitchen staff updates order progress. The project demonstrates full-stack architecture, role-based security, reusable shared packages, and business-focused workflow design."
