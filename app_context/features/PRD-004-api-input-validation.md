# PRD-004: Add Input Validation & Consistent Error Handling to API Routes

## Priority: HIGH
## Status: Open
## Category: Security / Reliability

---

## Problem Statement

Every API route blindly trusts incoming request bodies with no validation. This creates risk of crashes from malformed data, potential injection attacks in email templates, and inconsistent error responses that make client-side error handling unreliable.

## Affected Files

| File | Issue |
|------|-------|
| `src/app/api/order-confirmation/route.js` | No validation of email, order, orderId |
| `src/app/api/order-confirmation-postmark/route.js` | No validation; crashes if `order.cart` is undefined |
| `src/app/api/order-confirmation-sendgrid/route.js` | No validation of request body fields |
| `src/app/api/send-email/route.js` | No email format validation; missing method guard fallthrough |
| `src/app/api/subscribe/route.js` | No email validation; typo: `'Internal Servers Error'` |
| `src/app/api/apply-coupon/route.js` | No coupon code format validation |
| `src/app/api/paypal/orders/route.js` | No validation that `cart` exists or is array |
| `src/app/api/paypal/orders/[OrderID]/capture/route.js` | No OrderID format validation |
| `src/app/api/wipay/route.js` | Raw body forwarded without validation |
| `src/utils/emailTemplates.js` | User data interpolated into HTML without sanitization (XSS risk) |

## Current Behavior

- Sending `{}` to `/api/order-confirmation-postmark` causes `TypeError: Cannot read properties of undefined (reading 'map')` when `order.cart` is undefined.
- Email templates interpolate `order.firstName`, `order.address` directly into HTML — a name like `<script>alert('xss')</script>` would be injected.
- Error responses vary: some return `{ error, status }` in body, others use HTTP status headers, some return `{ details: error.message }`.
- Subscribe route returns `'Internal Servers Error'` (typo).

## Requirements

### 1. Install Zod for Schema Validation
Add `zod` as a dependency. Define schemas for each route's expected input.

### 2. Create Shared Validation Helpers
Create `src/lib/validation.js` with reusable schemas:
```javascript
import { z } from 'zod';

export const emailSchema = z.string().email();

export const orderConfirmationSchema = z.object({
  email: z.string().email(),
  orderId: z.string().min(1),
  order: z.object({
    firstName: z.string().optional(),
    cart: z.array(z.object({
      item: z.object({ name: z.string() }),
      quantity: z.number(),
    })),
  }),
});

export const couponSchema = z.object({
  code: z.string().min(1).max(50),
});
```

### 3. Apply Validation to Each Route
Validate at the top of each handler:
```javascript
const body = await request.json();
const result = schema.safeParse(body);
if (!result.success) {
  return Response.json({ error: 'Invalid request', details: result.error.flatten() }, { status: 400 });
}
```

### 4. Standardize Error Response Format
All API routes must use a consistent error shape:
```javascript
// Success
Response.json({ data: ... }, { status: 200 })

// Client error
Response.json({ error: 'Description', details: ... }, { status: 400|401|404 })

// Server error
Response.json({ error: 'Internal server error' }, { status: 500 })
```

### 5. Sanitize HTML in Email Templates
- Escape user-provided fields (firstName, lastName, address) before interpolating into HTML.
- Create a `sanitizeHtml()` utility that escapes `<`, `>`, `&`, `"`, `'`.

### 6. Fix Typo
- Fix `'Internal Servers Error'` → `'Internal Server Error'` in subscribe route.

## Acceptance Criteria

- [ ] Every API route validates input before processing
- [ ] Malformed requests return 400 with descriptive error
- [ ] All routes use the same error response format
- [ ] Email templates escape user-provided strings
- [ ] No route crashes on missing/undefined fields
- [ ] Typo in subscribe route fixed
- [ ] Zod schemas documented in validation file

## Estimated Scope

~4-5 hours. Install Zod, create schemas, add validation to ~10 routes, sanitize email templates, standardize responses.
