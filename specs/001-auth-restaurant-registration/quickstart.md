# Quickstart Validation: SRMS Authentication and Restaurant Registration

## Prerequisites

- Node and pnpm installed.
- MongoDB available and configured in API environment variables.
- Workspace dependencies installed.

## Setup

1. Install dependencies:
   - `pnpm install`
2. Confirm API typecheck:
   - `pnpm --filter api typecheck`
3. Start API:
   - `pnpm --filter api dev` (or `pnpm --filter api start`)
4. Start dashboard:
   - `pnpm --filter dashboard dev`

## Scenario A: Register Restaurant Owner (P1)

1. Open signup page in dashboard.
2. Enter restaurant fields and owner account fields.
3. Submit form.
4. Validate outcomes:
   - Restaurant record created.
   - User record created with `ADMIN` role.
   - Auth session established.
   - Redirect lands on dashboard home.

## Scenario B: Prevent Duplicate Email Registration (P1 edge)

1. Register once with an email.
2. Re-submit registration with the same email.
3. Validate outcomes:
   - Request rejected with conflict/duplicate-email error.
   - No second user created.
   - No orphan restaurant record created.

## Scenario C: Login Existing Active User (P2)

1. Open login page.
2. Submit valid email/password.
3. Validate outcomes:
   - Auth success envelope returned.
   - Session established.
   - Redirect to authorized landing route.

## Scenario D: Reject Invalid Credentials (P2)

1. Submit login with wrong password.
2. Validate outcomes:
   - Unauthorized/auth error response.
   - No authenticated session created.

## Scenario E: Protected Route Foundation (P3)

1. Attempt protected route without session.
2. Validate redirect or denied access behavior.
3. Authenticate successfully, then retry.
4. Validate access is granted.

## Verification Commands

- API typecheck: `pnpm --filter api typecheck`
- Dashboard typecheck: `pnpm --filter dashboard typecheck`
- Shared types typecheck: `pnpm --filter @srms/types typecheck`
- Shared validation typecheck: `pnpm --filter @srms/validation typecheck`

## References

- Specification: `specs/001-auth-restaurant-registration/spec.md`
- Plan: `specs/001-auth-restaurant-registration/plan.md`
- Data model: `specs/001-auth-restaurant-registration/data-model.md`
- API contracts: `specs/001-auth-restaurant-registration/contracts/auth-api.yaml`
