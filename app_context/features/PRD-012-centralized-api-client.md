# PRD-012: Create Centralized API Client

## Priority: MEDIUM
## Status: Open
## Category: Architecture / Code Quality

---

## Problem Statement

API calls to the Strapi backend are made ad-hoc across 10+ files using raw `fetch()` with manually constructed URLs, headers, and error handling. This leads to ~30% code duplication, inconsistent error handling, and hardcoded `process.env.NEXT_PUBLIC_SHERRYBERRIES_URL` references everywhere.

## Current Pattern (repeated 10+ times)

```javascript
const res = await fetch(
  `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/some-endpoint?populate[0]=field`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.jwt}`,
      'Content-Type': 'application/json',
    },
  }
);
const data = await res.json();
// No error check on res.ok
// No retry logic
// Error handling: console.log(err) and nothing else
```

## Files Using This Pattern

| File | Approximate Occurrences |
|------|------------------------|
| `src/app/components/dashboard/Orders.jsx` | 3 (fetch, complete, cancel) |
| `src/app/components/dashboard/Jewelry.jsx` | 2 (fetch, update) |
| `src/app/components/dashboard/AddJewelryModule.jsx` | 2 (upload image, create item) |
| `src/app/components/dashboard/OrderItem.jsx` | 1 (update status) |
| `src/app/components/paypalButtons/PayPalButton.jsx` | 2 (create, capture) |
| `src/app/hooks/useCart.js` | 4 (fetch, add, update, delete) |
| `src/app/cart/page.jsx` | 1 (getCartItem) |
| `src/app/checkout/page.jsx` | 1 (getCartItem duplicate) |
| `src/app/orders/page.jsx` | 1 (getCartItem duplicate) |
| `src/utils/fetchOrders.js` | 1 (server-side fetch) |

## Requirements

### 1. Create API Client Module

Create `src/lib/api-client.js`:

```javascript
const BASE_URL = process.env.NEXT_PUBLIC_SHERRYBERRIES_URL;

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, { method = 'GET', body, token, params } = {}) {
  const url = new URL(`/api${endpoint}`, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, val]) => url.searchParams.set(key, val));
  }

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new ApiError(data.error?.message || 'Request failed', res.status, data);
  return data;
}

export const api = {
  get: (endpoint, opts) => request(endpoint, { ...opts, method: 'GET' }),
  post: (endpoint, body, opts) => request(endpoint, { ...opts, method: 'POST', body }),
  put: (endpoint, body, opts) => request(endpoint, { ...opts, method: 'PUT', body }),
  delete: (endpoint, opts) => request(endpoint, { ...opts, method: 'DELETE' }),
};
```

### 2. Create Domain-Specific API Functions

Create `src/lib/api/cart.js`, `src/lib/api/orders.js`, `src/lib/api/products.js`:

```javascript
// src/lib/api/cart.js
import { api } from '../api-client';

export async function getCartItems(token) {
  return api.get('/cart-items', {
    token,
    params: { 'populate[0]': 'item.image' },
  });
}

export async function addToCart(token, itemData) {
  return api.post('/cart-items', { data: itemData }, { token });
}
```

### 3. Migrate All Direct Fetch Calls
Replace every raw `fetch()` to the Strapi backend with the appropriate `api.*` call. This includes:
- All dashboard components (Orders, Jewelry, AddJewelryModule, OrderItem)
- useCart hook
- Cart, checkout, and orders pages
- fetchOrders utility
- PayPal button component (for Strapi calls, not PayPal API calls)

### 4. Centralize Error Handling
The `ApiError` class allows callers to:
- Check `error.status` for specific handling (401 → redirect to login, 404 → show not found)
- Display `error.message` to users via toast
- Avoid raw `.catch(err => console.log(err))` patterns

### 5. Server-Side Variant
For Server Components and API routes, create `src/lib/api-server.js` that uses `getServerSession()` internally:

```javascript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { api } from './api-client';

export async function serverApi(endpoint, opts = {}) {
  const session = await getServerSession(authOptions);
  return api.get(endpoint, { ...opts, token: session?.jwt });
}
```

## Acceptance Criteria

- [ ] `src/lib/api-client.js` created with `get`, `post`, `put`, `delete` methods
- [ ] Domain API files created for cart, orders, and products
- [ ] All Strapi fetch calls migrated to use the API client
- [ ] No raw `process.env.NEXT_PUBLIC_SHERRYBERRIES_URL` in component files
- [ ] No raw `Authorization: Bearer...` header construction in components
- [ ] `ApiError` class used for structured error handling
- [ ] Server-side variant available for RSC and API routes
- [ ] All pages/components function identically after migration

## Estimated Scope

~6-8 hours. Create API client, domain functions, migrate ~20 fetch calls, test all flows.
