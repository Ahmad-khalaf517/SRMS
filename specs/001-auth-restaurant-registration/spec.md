# Feature Specification: SRMS Authentication and Restaurant Registration

**Feature Branch**: `001-auth-restaurant-registration`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: "AUTH-001 Authentication and Restaurant Registration"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Register Restaurant and First Admin (Priority: P1)

A restaurant owner registers a restaurant and creates the first account so SRMS can be used immediately for operations setup.

**Why this priority**: This is the first entry point into SRMS. Without registration, no organization account or admin owner exists and no downstream workflows can start.

**Independent Test**: Can be fully tested by submitting valid restaurant and owner details once, then verifying account creation, authenticated session start, and redirect to dashboard home.

**Acceptance Scenarios**:

1. **Given** a new owner with valid restaurant and account details, **When** they submit registration, **Then** the system creates the restaurant, creates the user linked to that restaurant, assigns ADMIN role, starts an authenticated session, and redirects to dashboard home.
2. **Given** a registration request where owner email already exists, **When** they submit registration, **Then** the system rejects the request and returns a clear duplicate-email error without creating new records.
3. **Given** invalid or missing registration fields, **When** they submit registration, **Then** the system rejects the request with field-level validation errors and no data is created.

---

### User Story 2 - Login Existing User (Priority: P2)

A registered user logs in using email and password to access SRMS according to their assigned permissions.

**Why this priority**: Login is required for repeat access and daily use after initial onboarding.

**Independent Test**: Can be fully tested by logging in with valid credentials and separately with invalid/inactive credentials, then verifying session behavior and redirect outcomes.

**Acceptance Scenarios**:

1. **Given** an active user with valid credentials, **When** they submit login, **Then** the system authenticates the user, starts an authenticated session, and redirects to the correct application landing route.
2. **Given** a user with invalid credentials, **When** they submit login, **Then** the system rejects login with an authentication error and no session is created.
3. **Given** an inactive user, **When** they submit login, **Then** the system blocks access and returns an inactive-account error.

---

### User Story 3 - Protected Route Foundation (Priority: P3)

Authenticated users can access protected application areas while unauthenticated users are blocked and redirected to login.

**Why this priority**: This provides the minimum secure access boundary needed before implementing wider role-based workflows.

**Independent Test**: Can be fully tested by attempting to open protected routes with and without an active session, then verifying allowed and denied outcomes.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they request a protected route, **Then** access is granted.
2. **Given** an unauthenticated user, **When** they request a protected route, **Then** access is denied and they are redirected to login.

---

### Edge Cases

- Registration submitted twice due to network retry must not create duplicate restaurant/user records.
- Login attempts with mixed-case emails should follow a consistent email normalization rule.
- Registration with partially valid nested payloads (restaurant valid, user invalid) must fail atomically.
- Expired or invalid session tokens must be rejected and require re-authentication.
- Concurrent registration attempts using the same email must result in only one successful account creation.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow a restaurant owner to register a restaurant and a first user account in one onboarding flow.
- **FR-002**: System MUST create one restaurant record and one linked user record from a successful registration request.
- **FR-003**: System MUST assign the first registered user the ADMIN role automatically.
- **FR-004**: System MUST prevent account creation when the requested user email already exists.
- **FR-005**: System MUST validate all registration and login inputs before processing.
- **FR-006**: System MUST authenticate active users using email and password login.
- **FR-007**: System MUST reject authentication attempts for invalid credentials.
- **FR-008**: System MUST reject authentication attempts for inactive users.
- **FR-009**: System MUST establish an authenticated session after successful registration and login.
- **FR-010**: System MUST return successful authentication responses using the platform response envelope with user data and access token data.
- **FR-011**: System MUST never return plaintext or hashed passwords in API responses.
- **FR-012**: System MUST provide protected-route foundations that allow authenticated access and deny unauthenticated access.
- **FR-013**: System MUST define role-ready access behavior supporting ADMIN, CASHIER, and KITCHEN STAFF roles for future expansion.
- **FR-014**: Frontend signup flow MUST collect both restaurant details and owner account details in a single user flow.
- **FR-015**: Frontend MUST redirect users to dashboard home after successful authentication.

### Key Entities _(include if feature involves data)_

- **Restaurant**: Represents a tenant business in SRMS with identity/contact attributes and activation status.
- **User**: Represents a person account linked to one restaurant with role, credentials, and activation status.
- **Auth Session**: Represents authenticated access state for a user, including access credentials used to reach protected resources.
- **Auth Response**: Represents the standardized success payload containing authenticated user context and access token data.

## Constitution Alignment _(mandatory)_

- **Domain Ownership**: Feature is owned by `modules/auth` in both API and dashboard; auth-specific flows remain in-domain while shared concerns stay in shared packages.
- **Shared Contracts**: Add or extend shared auth and entity types under `packages/types/src/<feature>` and shared input schemas under `packages/validation`; avoid creating a separate constants package.
- **Validation Coverage**: Validate register payload (restaurant + user), login payload, and any auth middleware inputs at all API boundaries.
- **AuthN/AuthZ Impact**: Introduces registration, login, session issuance, authentication middleware, current-user context, and role-ready authorization foundations.
- **State Ownership**: TanStack Query handles auth API calls/session fetches; Zustand stores only client session/UI state derived from authenticated context.
- **API and Errors**: Use standard success/error envelopes and typed AppError variants for validation, unauthorized, forbidden, conflict, and not-found behaviors.
- **Testing Phase Declaration**: Deferred-with-plan for full automation is acceptable at this phase, but acceptance scenarios must be executable and documented for register/login/protected-route flows.
- **Future-Proofing Check**:
  1. Reuse by another frontend: Yes, contracts and API behavior are shared and frontend-agnostic.
  2. Support multi-branch: Yes, user ownership is anchored to restaurant entity and can scale by tenant data.
  3. Scales to future customer/delivery apps: Yes, auth contracts and role model are reusable.
  4. AI agents can understand/extend safely: Yes, structure stays feature-based with clear shared contracts.
  5. Avoids duplication: Yes, schemas/types/responses are defined once in shared packages and reused.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 95% of valid registration attempts complete successfully in under 2 minutes end-to-end (form submit to dashboard redirect).
- **SC-002**: 100% of duplicate-email registration attempts are rejected without creating additional user or restaurant records.
- **SC-003**: 95% of valid login attempts complete in under 10 seconds from submit to authenticated landing route.
- **SC-004**: 100% of unauthenticated protected-route requests are denied access.
- **SC-005**: 0 password values appear in successful or failed authentication response payloads during acceptance testing.

## Assumptions

- SRMS currently supports one restaurant onboarding owner flow per initial setup; invitation-based multi-user onboarding is handled later.
- Session strategy uses access + refresh token concepts aligned with current constitution and existing security conventions.
- Shared auth schemas will be maintained in `packages/validation` (not a separate `packages/schemas` package) to match current repository standards.
- Role constants and role-related shared types will be maintained under `packages/types` feature folders (not a separate constants package).
- Redirect target after successful authentication is dashboard home (`/` in dashboard app routing context).
