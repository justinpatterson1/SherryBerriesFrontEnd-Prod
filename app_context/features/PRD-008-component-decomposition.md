# PRD-008: Component Decomposition & React Anti-Pattern Fixes

## Priority: MEDIUM
## Status: Open
## Category: Code Quality / Performance

---

## Problem Statement

Several components exceed 400+ lines, mixing data fetching, state management, and rendering. React anti-patterns (missing useEffect dependencies, missing memoization, index keys) create subtle bugs and unnecessary re-renders.

## Oversized Components

### Navigation.jsx — 525 lines
Currently handles: routing, cart state, search, dropdown menus, mobile menu, event listeners.

**Decompose into:**
- `Navigation.jsx` — Shell layout, mobile toggle
- `NavLinks.jsx` — Desktop navigation links
- `NavDropdown.jsx` — Product category dropdown (with keyboard support)
- `NavSearch.jsx` — Search input and logic
- `CartBadge.jsx` — Cart icon with count
- `MobileMenu.jsx` — Mobile slide-out menu

### Orders.jsx (Dashboard) — 469 lines
Currently handles: data fetching, pagination, status filtering, order completion/cancellation, 4 product type renderers.

**Decompose into:**
- `OrdersDashboard.jsx` — Container with data fetching (or custom hook)
- `OrderFilters.jsx` — Status tabs and pagination
- `OrderRow.jsx` — Single order expandable row
- `OrderItemList.jsx` — Renders items for an order (replaces 4 duplicated product type blocks)
- `useOrders.js` hook — Fetching, pagination, status filter state

### AddJewelryModule.jsx — 324 lines
Currently handles: image upload, form state, API submission, modal UI.

**Decompose into:**
- `AddJewelryModal.jsx` — Modal wrapper
- `JewelryForm.jsx` — Form fields with Formik/Yup
- `ImageUploader.jsx` — Reusable image upload with preview

## React Anti-Patterns to Fix

### 1. Missing useEffect Dependencies
| File | Issue |
|------|-------|
| `Orders.jsx` | Uses `session` inside effect but dependency array is `[orderStatus, page]` — stale closure |
| `Navigation.jsx` | `refreshCart` used in effect but not stable (recreated each render) |
| `Jewelry.jsx` | `fetchJewelries` called in effect with only `[page]` dependency |

**Fix:** Add missing deps or stabilize functions with `useCallback`.

### 2. Missing Memoization
| File | Issue |
|------|-------|
| `Navigation.jsx` | `cartCount` recalculated from `currentCart` in every effect — should be `useMemo` |
| `Navigation.jsx` | `handleSearch` recreated every render — should be `useCallback` |
| `OrderCard.jsx` | `statusConfig` computed every render — should be `useMemo` |
| `Orders.jsx` | `completeOrder` and `cancelOrder` recreated every render — should be `useCallback` |

### 3. Array Index as Key
| File | Issue |
|------|-------|
| `OrderCard.jsx` line ~202 | `key={index}` for order items — use `item.id` or `item.documentId` |

### 4. setTimeout Race Conditions
| File | Issue |
|------|-------|
| `Navigation.jsx` lines ~144-177 | `window.dropdownTimeout` with setTimeout for hover delay — replace with CSS `transition-delay` or a proper `useHover` hook |

### 5. Broken Hook: useProduct
| File | Issue |
|------|-------|
| `src/app/hooks/useProduct.js` lines ~65-70 | `refetch()` sets loading state but never actually re-fetches data |

### 6. Duplicate Hook Methods: useErrorHandler
| File | Issue |
|------|-------|
| `src/app/hooks/useErrorHandler.js` | `clearError` and `resetError` are identical — remove one |

## Requirements

### 1. Decompose the three oversized components as outlined above.

### 2. Fix all listed anti-patterns:
- Add missing dependencies to useEffect arrays (or stabilize with useCallback).
- Add useMemo/useCallback where computation is non-trivial or passed as props.
- Replace index keys with stable IDs.
- Replace setTimeout dropdown logic.
- Fix useProduct refetch to actually fetch.
- Remove duplicate method from useErrorHandler.

### 3. Extract data-fetching from components into custom hooks:
- `useOrders(session, filters)` — returns `{ orders, loading, error, refetch }`
- `useJewelry(session, page)` — returns `{ items, loading, error, totalPages }`

## Acceptance Criteria

- [ ] No component exceeds 250 lines
- [ ] Navigation, Orders, AddJewelryModule decomposed into sub-components
- [ ] All useEffect dependency arrays are complete (ESLint `react-hooks/exhaustive-deps` passes)
- [ ] No `key={index}` on list items that have stable IDs
- [ ] No `window.dropdownTimeout` or setTimeout for UI state
- [ ] `useProduct.refetch()` triggers a real re-fetch
- [ ] `useErrorHandler` has one method for clearing errors, not two
- [ ] Data fetching hooks created for orders and jewelry

## Estimated Scope

~8-10 hours. Component decomposition, hook extraction, anti-pattern fixes, testing all affected pages.
