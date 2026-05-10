# PRD-005: Add Missing Next.js Convention Files (loading, error, not-found)

## Priority: HIGH
## Status: Open
## Category: UX / Architecture

---

## Problem Statement

The application has no `loading.jsx`, `error.jsx`, or `not-found.jsx` files. Users see blank screens while data loads, unhandled crashes with no recovery path, and the default Next.js 404 for missing routes.

## Current Behavior

- **Loading**: Pages that fetch data (home, products, orders, cart) show nothing until the fetch completes. No skeleton, spinner, or placeholder.
- **Errors**: If a Server Component fetch fails, the entire page crashes with an unrecoverable error. Client-side errors in components propagate up with no fallback UI.
- **404**: Missing routes show the default Next.js 404 page with no branding or navigation back to the site.

## Requirements

### 1. Root-Level Convention Files

Create in `src/app/`:

**`loading.jsx`** — Global loading fallback (used by any route without its own loading file):
- Display a centered loading spinner or skeleton matching the site's branding.
- Should use the existing `Loader` component from `src/app/components/Loader.jsx` or a refined version.

**`error.jsx`** — Global error boundary:
- Must be a Client Component (`'use client'`).
- Display a user-friendly error message with a "Try Again" button that calls `reset()`.
- Include a link back to the home page.
- Do NOT display raw error messages to users.

**`not-found.jsx`** — Custom 404 page:
- Branded 404 page with navigation.
- Suggest links to popular pages (Home, Products, Contact).
- Include search or navigation to help users find what they were looking for.

### 2. Route-Specific Loading States

Create `loading.jsx` for data-heavy routes:

| Route | Loading UI |
|-------|-----------|
| `src/app/product/jewelry/[id]/` | Product detail skeleton (image placeholder + text lines) |
| `src/app/product/clothing/[id]/` | Same product skeleton |
| `src/app/product/waistbeads/[id]/` | Same product skeleton |
| `src/app/product/aftercare/[id]/` | Same product skeleton |
| `src/app/orders/` | Order list skeleton (card placeholders) |
| `src/app/cart/` | Cart item skeleton |
| `src/app/blogs/` | Blog card grid skeleton |
| `src/app/dashboard/` | Dashboard table skeleton |

### 3. Route-Specific Error Boundaries

Create `error.jsx` for routes where granular error recovery matters:

| Route | Error Behavior |
|-------|---------------|
| `src/app/product/[category]/[id]/` | "Product not found or unavailable" with link to category page |
| `src/app/orders/` | "Couldn't load orders" with retry button |
| `src/app/checkout/` | "Something went wrong" — preserve cart state, offer retry |

### 4. Create Reusable Skeleton Components

Create `src/app/components/ui/Skeleton.jsx`:
- A base `Skeleton` component (animated pulse placeholder).
- Composable: `SkeletonText`, `SkeletonImage`, `SkeletonCard`.
- Used by all `loading.jsx` files for consistency.

## Acceptance Criteria

- [ ] Root `loading.jsx` shows branded loading state for all routes
- [ ] Root `error.jsx` catches unhandled errors with retry and home link
- [ ] Root `not-found.jsx` shows branded 404 with navigation
- [ ] Product, orders, cart, blogs, and dashboard have route-specific loading skeletons
- [ ] Product and orders have route-specific error boundaries with contextual messages
- [ ] Skeleton components are reusable and match site styling
- [ ] Existing `Loader.jsx` component is integrated or replaced (no duplication)

## Estimated Scope

~4-5 hours. Create skeleton component system, add ~10 loading/error/not-found files, style to match brand.
