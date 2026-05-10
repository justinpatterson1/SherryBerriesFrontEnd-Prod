# PRD-007: Extract Hardcoded Values & Eliminate Code Duplication

## Priority: MEDIUM
## Status: Open
## Category: Code Quality / Maintainability

---

## Problem Statement

Hardcoded colors, magic numbers, status strings, and product categories are scattered across 20+ files. The same fetch patterns and utility functions are copy-pasted rather than shared. This makes updates error-prone (e.g., two different Postmark sender domains already exist) and increases maintenance burden.

## Issues

### Hardcoded Colors
- `#EA4492` (primary pink) appears **50+ times** inline in components instead of using a Tailwind theme token or CSS variable.
- `#ffefef`, `#c83778` (hover), and other brand colors are hardcoded throughout.
- `globals.css` lines ~149, ~157 have debug colors (`background-color: red`, `background-color: blue`) on carousel controls.

### Magic Numbers
- Pagination sizes: `10` in Orders.jsx, `12` in Jewelry.jsx — no shared constant.
- Size arrays: `[14, 16, 18, 20, 22]` hardcoded in AddJewelryModule.jsx.
- `visibleCount` starts at `8`, increments by `4` in FeaturedProducts.jsx.

### Hardcoded Strings
- Order statuses: `'open'`, `'closed'`, `'cancelled'`, `'pending'` repeated in Orders.jsx and OrderCard.jsx.
- Product categories: `'Jewelry'`, `'Waistbeads'`, `'Clothing'`, `'Aftercare'` scattered throughout.
- Sender email inconsistency: `orders@sherryberries.com` vs `orders@sherry-berries.com` in different routes.

### Duplicated Code
- **`getCartItem()`** — identical function in `cart/page.jsx`, `checkout/page.jsx`, `orders/page.jsx`.
- **Fetch-with-auth pattern** — `fetch(URL, { headers: { Authorization: \`Bearer ${session?.jwt}\` } })` repeated in 10+ files.
- **Status-to-color mapping** — duplicated in Orders.jsx and OrderCard.jsx with different implementations.
- **Image URL resolution** — `item?.image?.formats?.thumbnail?.url || item?.image?.url` in 3+ files.

## Requirements

### 1. Create Constants File
Create `src/lib/constants.js`:
```javascript
export const ORDER_STATUSES = { OPEN: 'open', CLOSED: 'closed', CANCELLED: 'cancelled', PENDING: 'pending' };
export const PRODUCT_CATEGORIES = ['Jewelry', 'Waistbeads', 'Clothing', 'Aftercare'];
export const JEWELRY_SIZES = [14, 16, 18, 20, 22];
export const PAGINATION = { DEFAULT_PAGE_SIZE: 12 };
export const SENDER_EMAIL = 'orders@sherryberries.com';
```

### 2. Add Brand Colors to Tailwind Theme
Update `tailwind.config.js` to include brand colors:
```javascript
theme: {
  extend: {
    colors: {
      brand: { DEFAULT: '#EA4492', hover: '#c83778', light: '#ffefef' },
    },
  },
}
```
Then replace all inline `#EA4492` references with `text-brand`, `bg-brand`, etc.

### 3. Extract Shared Utilities
- Move `getCartItem()` to `src/lib/cart.js` and import in cart, checkout, and orders pages.
- Extract image URL resolution to `src/lib/image.js`: `getImageUrl(item)`.
- Extract status-to-color mapping to `src/lib/status.js`: `getStatusColor(status)`.

### 4. Remove Debug CSS
- Remove `background-color: red` and `background-color: blue` from `globals.css`.

### 5. Fix Sender Email Inconsistency
- Standardize to one sender email, pulled from environment variable `SENDER_EMAIL`.

## Acceptance Criteria

- [ ] No hardcoded `#EA4492` in any component file (all use Tailwind `brand` token)
- [ ] Order statuses, categories, and sizes imported from constants file
- [ ] `getCartItem()` exists in one place and is imported by 3 pages
- [ ] Image URL resolution is a shared utility
- [ ] Debug colors removed from globals.css
- [ ] Sender email consistent across all routes (from env var)
- [ ] No duplicate status-to-color mapping

## Estimated Scope

~5-6 hours. Create constants/utils, update 20+ file imports, refactor Tailwind config, verify all pages still render correctly.
