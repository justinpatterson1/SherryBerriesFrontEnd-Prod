# PRD-010: Establish Testing Infrastructure

## Priority: MEDIUM
## Status: Open
## Category: Quality Assurance

---

## Problem Statement

The application has zero tests — no test framework, no test files, no CI test step. There is no automated way to verify that changes don't break existing functionality. This is especially risky given the payment, authentication, and email flows.

## Current State

- No testing framework installed (no Jest, Vitest, Playwright, Cypress).
- No `test` script in `package.json`.
- No `__tests__/` directories or `*.test.js` files anywhere.
- No CI/CD pipeline configured.

## Requirements

### 1. Install Testing Framework

**Unit/Integration testing:** Vitest (faster than Jest, native ESM support, works well with Next.js).

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

**E2E testing:** Playwright (recommended for Next.js apps).

```bash
npm install -D @playwright/test
```

### 2. Configure Vitest

Create `vitest.config.js`:
```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
});
```

### 3. Add Package Scripts

```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test"
}
```

### 4. Write Priority Tests (ordered by risk)

**Tier 1 — Critical paths (write first):**
| Test | Type | What to verify |
|------|------|---------------|
| PayPal order creation | Unit | `/api/paypal/orders` validates cart, returns order ID |
| PayPal capture | Unit | `/api/paypal/orders/[id]/capture` handles success and failure |
| Auth flow | Integration | NextAuth login → session → JWT in session |
| Apply coupon | Unit | `/api/apply-coupon` validates code, returns discount |
| Email route | Unit | `/api/order-confirmation-postmark` validates input, calls Postmark |

**Tier 2 — UI components:**
| Test | Type | What to verify |
|------|------|---------------|
| Navigation | Component | Renders links, mobile toggle works, dropdown opens |
| Cart page | Component | Displays items, updates quantities, removes items |
| Checkout form | Component | Validates fields, submits, shows errors |
| OrderCard | Component | Renders order data, status badge correct |

**Tier 3 — E2E flows:**
| Test | Type | What to verify |
|------|------|---------------|
| Browse → Add to cart → Checkout | E2E | Full purchase flow works |
| Sign in → View orders | E2E | Auth-protected routes accessible after login |
| Admin dashboard | E2E | CRUD operations on jewelry items |

### 5. Test File Organization

```
src/
├── test/
│   ├── setup.js              # Test setup (testing-library matchers)
│   └── mocks/
│       ├── session.js         # Mock NextAuth session
│       └── strapi.js          # Mock Strapi API responses
├── app/
│   ├── api/
│   │   ├── paypal/orders/__tests__/route.test.js
│   │   ├── apply-coupon/__tests__/route.test.js
│   │   └── order-confirmation-postmark/__tests__/route.test.js
│   ├── components/
│   │   ├── __tests__/Navigation.test.jsx
│   │   ├── cart/__tests__/CartList.test.jsx
│   │   └── orders/__tests__/OrderCard.test.jsx
│   └── cart/__tests__/page.test.jsx
tests/
└── e2e/
    ├── purchase-flow.spec.js
    └── auth-flow.spec.js
```

## Acceptance Criteria

- [ ] Vitest installed and configured
- [ ] `npm test` runs and passes
- [ ] Tier 1 tests written and passing (5 API route tests)
- [ ] Tier 2 tests written and passing (4 component tests)
- [ ] Playwright installed with at least 1 E2E test
- [ ] Test mocks created for NextAuth session and Strapi API
- [ ] Coverage report generated with `npm run test:coverage`

## Estimated Scope

~10-12 hours. Framework setup (~1h), Tier 1 tests (~4h), Tier 2 tests (~4h), E2E setup + 1 flow (~3h).
