<!--
Sync Impact Report
- Version change: template (unversioned) -> 1.0.0
- Modified principles:
	- PRINCIPLE_1_NAME -> Single Source of Truth
	- PRINCIPLE_2_NAME -> Feature-Driven Domain Architecture
	- PRINCIPLE_3_NAME -> Shared Contracts and Strong Typing
	- PRINCIPLE_4_NAME -> Scalability and Future-Proofing by Default
	- PRINCIPLE_5_NAME -> AI-Ready, Predictable, Modular Codebase
- Added sections:
	- Engineering and Architecture Standards
	- Delivery and Quality Workflow
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ✅ updated: .specify/templates/commands/*.md (no files present)
- Follow-up TODOs:
	- None
-->

# Smart Restaurant Management System (SRMS) Constitution

## Core Principles

### Single Source of Truth

Business rules, domain models, validation schemas, DTOs, and shared contracts MUST
be defined once and reused everywhere. Frontend and backend MUST NOT maintain
separate definitions for the same business concept. Duplication requires explicit
architectural approval.

Rationale: A single definition prevents drift, lowers defects, and keeps behavior
consistent across all applications.

### Feature-Driven Domain Architecture

Code organization MUST follow business domains rather than technical layers whenever
possible. Domains such as auth, users, orders, menu, categories, kitchen, and
reports own their components, pages, services, API calls, validation, state, and
tests. Cross-domain coupling MUST be minimized and justified.

Rationale: Domain ownership improves maintainability, team autonomy, and long-term
evolution.

### Shared Contracts and Strong Typing

Types, schemas, enums, and constants that represent business meaning MUST live in
shared packages and MUST be consumed by all applications. TypeScript strict mode is
mandatory. The use of any, ts-ignore, duplicated business logic, and ungoverned
magic strings is prohibited.

Rationale: Contract consistency and strict typing reduce integration failures and
increase delivery confidence.

### Scalability and Future-Proofing by Default

Architecture decisions MUST assume multiple frontends, multiple branches, high order
volume, and multiple deployment environments. Every implementation MUST answer five
future-proofing questions before completion:

1. Can it be reused by another frontend?
2. Can it support multiple restaurant branches?
3. Can it scale to future delivery and customer applications?
4. Can AI agents understand and extend it safely?
5. Does it avoid duplication?

If any answer is No, the implementation MUST be reconsidered before merge.

Rationale: SRMS is a platform, not a single app; design must optimize for expansion.

### AI-Ready, Predictable, Modular Codebase

Repository structure, naming, and module boundaries MUST prioritize discoverability,
predictability, modularity, and self-documenting code. Contributors MUST produce
clear contracts and explicit boundaries to support reliable human and AI-assisted
development.

Rationale: AI effectiveness depends on clean architecture and consistent patterns.

## Engineering and Architecture Standards

### Project Vision and Scope

SRMS is a restaurant operations platform that digitizes restaurant workflows and
eliminates manual communication bottlenecks. The platform MUST support restaurant
administration, cashier operations, kitchen operations, real-time order processing,
and reporting and analytics.

Planned expansion domains include customer ordering, delivery management, customer
mobile, delivery mobile, multi-branch management, inventory, supplier management,
and loyalty programs. Extensibility MUST be prioritized over short-term convenience.

### Development Priority

Initial delivery priority MUST follow this sequence:

1. Project foundation
2. Shared packages
3. Authentication
4. User and role management
5. Restaurant configuration
6. Menu management
7. Order workflow
8. Kitchen workflow
9. Invoice generation
10. Reporting
11. Real-time communication

### Monorepo and Boundary Rules

SRMS MUST use pnpm workspaces in a monorepo layout where apps and packages are
separated. Applications MUST NOT directly depend on each other and MUST communicate
through shared packages and APIs only.

Required repository shape:

```text
srms/
	apps/
		api/
		dashboard/
		kitchen/
		customer/
		delivery/
	packages/
		ui/
		types/
		validation/
		api-client/
		constants/
		utils/
		config/
		eslint-config/
		tsconfig/
	.github/
```

### Technology Standards

Frontend baseline MUST use React, TypeScript, Vite, React Router, Tailwind CSS,
shadcn/ui, React Hook Form, TanStack Query, Zustand, and Zod.

Backend baseline MUST use Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT,
Socket.IO, and Zod.

Shared tooling MUST include TypeScript, Zod, ESLint, and Prettier.

### Package Ownership Rules

Shared package responsibilities are mandatory:

- packages/types: domain types, DTOs, and shared interfaces only; no implementation.
- packages/validation: Zod schemas for request and response validation reused by all
  apps.
- packages/ui: shared shadcn/ui components; feature-specific UI stays in feature
  modules.
- packages/api-client: axios configuration, query helpers, and shared API functions
  used by all frontend apps.
- packages/constants: route constants, query keys, storage keys, and configuration
  constants; business enums are excluded.
- packages/utils: framework-independent pure helpers and formatting/calculation
  utilities.

Business enums MUST live in packages/types/src/domain and MUST prefer const objects
with literal types over TypeScript enums.

### Frontend and Backend Structure Rules

Frontend apps MUST follow this structure:

```text
src/
	app/
	modules/
	components/
	hooks/
	layouts/
	routes/
	store/
	lib/
	styles/
```

Backend MUST follow vertical slices by module (auth, users, categories, menu,
orders, kitchen, reports). Each module MUST include controller, service,
repository, model, routes, validation, mapper, types, and tests.

### State, Validation, Security, and Data Rules

TanStack Query MUST own server state, API data, caching, and mutations. Zustand MUST
own UI and session-oriented client state only. Server data MUST NOT be stored in
Zustand.

All external input MUST be validated with Zod, including API requests, form input,
query parameters, and environment variables.

Authentication MUST use access token and refresh token patterns with JWT, secure
cookies, token rotation, and refresh-token revocation. Passwords MUST be hashed with
bcrypt.

Authorization MUST be role-based with explicit permissions on each protected route.
Implicit permissions are prohibited.

MongoDB with Mongoose is the data standard. Core collections include users,
categories, menuItems, kitchenSections, orders, payments, and auditLogs. Soft delete
SHOULD be used for business-critical entities unless legal requirements require hard
delete.

### Order Workflow, API, Errors, and Logging

The canonical order lifecycle is PENDING -> ACCEPTED -> PREPARING -> READY ->
COMPLETED, with optional CANCELLED. Status transitions MUST be validated and invalid
transitions MUST be rejected.

All service errors MUST derive from AppError with explicit typed subclasses,
including ValidationError, UnauthorizedError, ForbiddenError, NotFoundError, and
ConflictError. Controllers MUST NOT throw untyped generic errors.

API responses MUST follow consistent envelopes:

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

```json
{
  "success": false,
  "message": "",
  "errors": []
}
```

Production logging MUST use Pino with structured payloads. console.log in production
code is prohibited. Sensitive data MUST never be logged.

### Naming, Coding, and Git Workflow

Naming conventions are mandatory: folders use kebab-case, components use PascalCase,
variables use camelCase, and constants use UPPER_SNAKE_CASE.

Branching model MUST use main, develop, feature/_, and hotfix/_. Commit prefixes
MUST use conventional tags: feat, fix, refactor, test, docs, style, perf, build,
and ci.

## Delivery and Quality Workflow

### Testing Strategy and Enforcement

SRMS uses phased testing governance:

1. During early foundation phases, automated test suites MAY be deferred, but each
   feature MUST include independently testable acceptance scenarios and a documented
   testing plan.
2. Once testing infrastructure is enabled for a domain, every new feature in that
   domain MUST include unit and integration tests.
3. Critical workflows (login, create order, kitchen workflow, order completion,
   payment processing, and permission management) MUST include end-to-end coverage
   when that test layer exists.

This phased policy resolves roadmap sequencing while preserving test-readiness from
day one.

### Real-Time and Performance Workflow

Real-time communication MUST be supported using Socket.IO for new orders, kitchen
updates, ready notifications, and live dashboard metrics. Polling MUST NOT be the
primary mechanism for flows requiring immediacy.

### Documentation Requirements

Every major feature MUST ship with overview, architecture notes, API contract,
validation rules, and testing strategy. Documentation is part of the feature
definition of done.

### Compliance Review Expectations

Each pull request MUST include a constitution compliance check covering domain
ownership, contract reuse, validation, authorization, logging, and future-proofing.
Any exception MUST include explicit justification and architectural review approval
before merge.

## Governance

This constitution is the authoritative engineering standard for SRMS and takes
precedence over personal preferences, AI-generated assumptions, and temporary
shortcuts.

Amendment procedure:

1. Propose change with affected principles, migration impact, and risk assessment.
2. Review by maintainers and architecture owners.
3. Approve and update dependent templates before merge.
4. Record Sync Impact Report in this document.

Versioning policy:

- MAJOR: Backward-incompatible governance changes or principle removals/redefinitions.
- MINOR: New principle/section or materially expanded mandatory guidance.
- PATCH: Clarifications, wording improvements, typo fixes, or non-semantic edits.

Compliance policy:

- Constitution checks are mandatory in planning and review workflows.
- Non-compliant changes MUST be blocked until addressed or explicitly waived.
- Waivers MUST include owner, scope, expiration, and remediation plan.

**Version**: 1.0.0 | **Ratified**: 2026-07-07 | **Last Amended**: 2026-07-07
