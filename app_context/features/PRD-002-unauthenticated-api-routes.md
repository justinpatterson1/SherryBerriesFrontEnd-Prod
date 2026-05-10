# PRD-002: Add Authentication to API Routes

## Priority: CRITICAL
## Status: Open
## Category: Security

---

## Problem Statement

Multiple API routes that perform sensitive operations (sending emails, applying coupons, managing subscriptions) have zero authentication or authorization checks. Any unauthenticated user or bot can call these endpoints directly.

## Affected Files

| File | Issue |
|------|-------|
| `src/app/api/order-confirmation/route.js` | No auth — anyone can trigger order confirmation emails |
| `src/app/api/order-confirmation-postmark/route.js` | No auth — anyone can send Postmark emails |
| `src/app/api/order-confirmation-sendgrid/route.js` | No auth — anyone can send SendGrid emails |
| `src/app/api/send-email/route.js` | No auth — open email relay |
| `src/app/api/subscribe/route.js` | No auth — potential spam vector |
| `src/app/api/apply-coupon/route.js` | No auth — coupon codes can be brute-forced |
| `src/app/api/wipay/route.js` | No auth — payment data forwarded without verification |
| `src/middleware.jsx` | Only protects 5 page routes; no API route protection |

## Current Behavior

- Anyone with the URL can POST to `/api/send-email` with arbitrary recipient addresses and content.
- Coupon codes can be enumerated by automated requests to `/api/apply-coupon`.
- No rate limiting exists on any endpoint.

## Expected Behavior

- Sensitive API routes require a valid session (JWT from NextAuth).
- Public-facing routes (subscribe) have rate limiting.
- Payment routes validate request origin and session.

## Requirements

### 1. Add Session Validation to Protected Routes
For each email/payment/coupon route, add at the top of the handler:
```javascript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

const session = await getServerSession(authOptions);
if (!session) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### 2. Update Middleware
- Extend `src/middleware.jsx` matcher to cover sensitive API routes.
- Keep public routes (e.g., `/api/subscribe`) accessible but rate-limited.

### 3. Add Rate Limiting
- Add rate limiting to `/api/subscribe`, `/api/apply-coupon`, and `/api/send-email`.
- Recommended: Use `next-rate-limit` or implement token-bucket via headers/IP.

### 4. Validate Request Origin
- For payment routes (`/api/paypal/*`, `/api/wipay`), verify the request originates from the application (check `Referer` or use CSRF tokens).

## Acceptance Criteria

- [ ] All email routes return 401 without a valid session
- [ ] `/api/apply-coupon` requires authentication
- [ ] `/api/subscribe` has rate limiting (e.g., 5 requests/minute/IP)
- [ ] Payment routes validate session and origin
- [ ] Middleware matcher updated to include API routes
- [ ] Existing authenticated flows (post-checkout email) still work

## Estimated Scope

~3-4 hours. Add auth checks to each route, configure rate limiting, update middleware, test all flows.
