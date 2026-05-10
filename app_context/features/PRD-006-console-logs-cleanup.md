# PRD-006: Remove Console Logs & Debug Code from Production

## Priority: HIGH
## Status: Open
## Category: Security / Code Quality

---

## Problem Statement

15+ `console.log`/`console.error` statements exist throughout the codebase, many logging sensitive data (JWTs, email addresses, cart contents, PayPal responses). A full `DebugComponent.jsx` is also present. This leaks information to anyone with browser devtools open and clutters server logs.

## Affected Files

| File | Line(s) | What's Logged |
|------|---------|---------------|
| `src/app/components/Navigation.jsx` | ~30 | Full cart JSON |
| `src/app/components/dashboard/Orders.jsx` | ~46, ~111 | Error details, order status |
| `src/app/components/dashboard/Jewelry.jsx` | ~20, ~94-95, ~139 | Session JWT, form data, image formats |
| `src/app/components/paypalButtons/PayPalButton.jsx` | ~68, ~76-77, ~114-118 | PayPal response data, capture results |
| `src/app/components/dashboard/AddJewelryModule.jsx` | ~98 | Payload data |
| `src/app/components/orders/OrdersWrapper.jsx` | ~9 | Full session object |
| `src/app/components/ErrorBoundary.jsx` | ~16 | Error + error info |
| `src/app/cart/page.jsx` | ~24, ~64, ~71 | Session, cart data, items |
| `src/app/checkout/page.jsx` | ~29 | Debug data |
| `src/app/api/subscribe/route.js` | ~8 | User email addresses |
| `src/app/api/send-email/route.js` | ~23, ~64-65 | Email addresses |
| `src/app/hooks/useCart.js` | ~35, ~56, ~82, ~150 | Order details |
| `src/app/components/DebugComponent.jsx` | entire file | Debug-only component |

## Requirements

### 1. Remove All Console Statements
- Remove every `console.log`, `console.error`, `console.warn`, and `console.debug` from the files listed above.
- For legitimate error logging in catch blocks, replace with proper error handling (set error state, show toast, etc.) — do not simply delete the catch body.

### 2. Delete Debug Files
- Delete `src/app/components/DebugComponent.jsx`.
- Delete `src/app/api/my-route-test/route.js` (test joke API route).
- Remove any imports of these files.

### 3. Add ESLint Enforcement
- Upgrade the `no-console` rule in `.eslintrc.js` from `'warn'` to `'error'` to prevent future console statements from being committed.
- Optionally allow `console.warn` and `console.error` in development only via an ESLint override.

### 4. (Optional) Add Structured Logging
For server-side API routes where error logging is valuable, consider a lightweight logger that:
- Logs in development only, or
- Logs to an external service (Sentry, LogRocket) in production.

## Acceptance Criteria

- [ ] Zero `console.log` statements in `src/` directory (verified via `grep -r "console.log" src/`)
- [ ] `DebugComponent.jsx` and `my-route-test/route.js` deleted
- [ ] No imports reference deleted files
- [ ] Catch blocks that previously only logged now set error state or show user feedback
- [ ] ESLint `no-console` set to `'error'`
- [ ] `npm run lint` passes with no console violations

## Estimated Scope

~2-3 hours. Systematic removal, replacing error logging with proper handling, ESLint update.
