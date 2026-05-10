# PRD-001: Fix Exposed Server Tokens & Debug Mode

## Priority: CRITICAL
## Status: Open
## Category: Security

---

## Problem Statement

Sensitive server-side API tokens are exposed to the browser due to incorrect `NEXT_PUBLIC_` prefixing. Additionally, NextAuth debug mode is enabled in production, logging sensitive session data.

## Affected Files

| File | Line(s) | Issue |
|------|---------|-------|
| `src/app/api/order-confirmation-postmark/route.js` | 8 | Uses `NEXT_PUBLIC_POSTMARK_SERVER_TOKEN` — exposed to client |
| `src/app/api/send-email/route.js` | 7 | Same exposed Postmark token |
| `src/app/api/auth/[...nextauth]/options.js` | 71 | `debug: true` in production authOptions |

## Current Behavior

- `NEXT_PUBLIC_POSTMARK_SERVER_TOKEN` is bundled into client-side JavaScript, visible in browser devtools and network requests.
- NextAuth debug mode logs full session objects (including JWTs) to server logs.

## Expected Behavior

- Server tokens are only accessible in server-side code (API routes, Server Components).
- Debug mode is disabled in production; enabled only via environment flag in development.

## Requirements

### 1. Rename Environment Variables
- Rename `NEXT_PUBLIC_POSTMARK_SERVER_TOKEN` to `POSTMARK_SERVER_TOKEN` in `.env.local` and all references.
- Audit all `NEXT_PUBLIC_` prefixed variables — only values that genuinely need client access should have this prefix.
- Update `ENVIRONMENT_SETUP.md` to reflect the change.

### 2. Disable Debug Mode
- Change `debug: true` to `debug: process.env.NODE_ENV === 'development'` in NextAuth options.

### 3. Audit Other Secrets
- Verify `NEXT_PUBLIC_PAYPAL_CLIENT_SECRET` is not exposed (client secrets must never be public).
- Verify `NEXT_PUBLIC_MAILGUN_API_KEY` usage — Mailgun API keys are server-side secrets.

## Acceptance Criteria

- [ ] No server tokens appear in client-side JavaScript bundles (verify with `next build` + inspect `.next/static/`)
- [ ] NextAuth debug mode is off in production
- [ ] All email API routes still function correctly with renamed env vars
- [ ] `ENVIRONMENT_SETUP.md` updated with correct variable names

## Estimated Scope

~1 hour. Rename variables, update references, test email flows.
