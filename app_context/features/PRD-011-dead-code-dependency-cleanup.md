# PRD-011: Dead Code & Dependency Cleanup

## Priority: LOW
## Status: Open
## Category: Code Quality / Performance

---

## Problem Statement

Dead code, unused dependencies, and abandoned files add confusion and increase bundle size. Multiple context providers and utility files exist that are never consumed.

## Dead Code

| File | Issue |
|------|-------|
| `context/AppContext.jsx` | Empty context provider — created but never consumed by any component |
| `context/CartContext.jsx` | `useCart` hook is commented out; provider exists but consumer is disabled |
| `src/utils/generateEmail.js` | Mailgen-based email generator — routes use raw HTML templates instead |
| `src/utils/api.js` | Single `addToCart` function — not used by `useCart` hook or any component |
| `src/app/components/DebugComponent.jsx` | Debug-only component (also covered in PRD-006) |
| `src/app/api/my-route-test/route.js` | Test route returning jokes — not part of the app |
| `src/app/layout.jsx` | Commented-out CartProvider and ClerkProvider imports |
| `src/app/components/cart/cartList.jsx` | Placeholder component — body is just `"hi"` |

## Duplicate State Management

Two cart systems exist in parallel:
1. `context/CartContext.jsx` — context-based cart with `cartId` state
2. `src/app/hooks/useCart.js` — hook-based cart with its own state

This creates confusion about the source of truth. Pick one approach and remove the other.

## Dependency Issues

| Package | Issue |
|---------|-------|
| `moment` + `dayjs` | Both installed — moment is 300KB, dayjs is 2KB. Remove moment. |
| `react@19.0.0-rc` / `react-dom@19.0.0-rc` | Using release candidate — upgrade to stable React 19. |
| Root `package.json` | Contains only `react-icons` — stale/orphan file from project restructuring |
| `@clerk/nextjs` | Clerk imports commented out in layout — remove if not using Clerk |

## Config Issues

| File | Issue |
|------|-------|
| `tailwind.config.js` | Includes `./src/pages/**` content path — this is App Router only, no `pages/` dir exists |
| `tsconfig.json` | `strict: false` — provides minimal type safety benefit |
| `.eslintrc.js` | `ecmaVersion: 12` — should be `2022` for modern syntax |
| `next.config.mjs` | Missing `poweredByHeader: false` (leaks Next.js version in response headers) |

## Requirements

### 1. Remove Dead Files
- Delete `context/AppContext.jsx`
- Delete `src/utils/generateEmail.js`
- Delete `src/utils/api.js`
- Delete `src/app/components/DebugComponent.jsx`
- Delete `src/app/api/my-route-test/route.js`
- Delete or implement `src/app/components/cart/cartList.jsx`

### 2. Consolidate Cart State
- Decide: use `CartContext` or `useCart` hook (not both).
- Remove the unused approach and its file.
- If keeping `useCart` hook, delete `context/CartContext.jsx`.

### 3. Clean Dependencies
```bash
npm uninstall moment
npm uninstall @clerk/nextjs  # if Clerk is not in use
npm install react@latest react-dom@latest  # upgrade from RC
```
- Remove or repurpose root `package.json`.

### 4. Fix Configs
- Remove `./src/pages/**` from tailwind content paths.
- Set `ecmaVersion: 2022` in ESLint config.
- Add `poweredByHeader: false` to `next.config.mjs`.
- Remove commented-out imports from `layout.jsx`.

## Acceptance Criteria

- [ ] All listed dead files deleted
- [ ] No imports reference deleted files
- [ ] Single cart state management approach (context or hook, not both)
- [ ] `moment` removed; all date formatting uses `dayjs`
- [ ] React upgraded to stable 19
- [ ] Unused Clerk dependency removed (if confirmed unused)
- [ ] Tailwind, ESLint, and Next.js configs cleaned up
- [ ] `npm run build` succeeds with no warnings about missing modules

## Estimated Scope

~3-4 hours. File deletion, dependency updates, config fixes, verify build.
