# PRD-016: Server-First Rendering Refactor

## Priority: HIGH
## Status: Done
## Category: Performance / Architecture

---

## Problem Statement

Listing pages (`/blogs`, `/product/jewelry`, `/product/clothing`, `/product/waistbeads`, `/product/aftercare`) and product detail pages (`/product/<type>/[id]`) were marked `'use client'` and fetched their data in `useEffect`. This pushed all data fetching to the client: the initial HTML response was an empty shell, the JS bundle had to ship and hydrate before any API call fired, and only then did content paint. Same anti-pattern in `Footer.jsx`, which forced the entire footer subtree onto the client because of a single newsletter form.

## Goal

Push the `'use client'` boundary to the leaves: Server Components own the tree and fetch data, Client Components are leaves that receive props and only handle interactivity (state, event handlers, browser APIs, animations, carousels). Outcome: smaller initial JS, content in the first HTML payload, targeted hydration only where users actually interact.

## Approach

Three buckets:

1. **Convert page → async Server Component, isolate interactivity** — the page becomes `async`, fetches initial data server-side, and passes it to a thin client wrapper that owns only pagination state / "load more" behavior.
2. **Drop unneeded `'use client'`** — for components marked client defensively but using no hooks/state/event handlers/browser APIs.
3. **Leave as-is** — components that legitimately need client AND are already leaf components rendered by server parents (e.g. homepage children using framer-motion).

## Steps Taken

### Phase A — Listing pages (5 routes)

For each listing page: extracted the existing client logic into a sibling `XxxListClient.jsx`, converted `page.jsx` to an `async` Server Component that reads `searchParams.page` and calls the existing fetcher server-side, then passes `initialProducts` / `initialPage` / `heroImg` as props to the client wrapper. The client wrapper seeds local state from the server-fetched data and uses a `useRef` flag to skip the initial mount fetch (preventing a duplicate API call on hydration).

Files:
- [src/app/blogs/page.jsx](src/app/blogs/page.jsx) + new [src/app/blogs/BlogsClient.jsx](src/app/blogs/BlogsClient.jsx) — also handles search/sort/category filters client-side
- [src/app/product/jewelry/page.jsx](src/app/product/jewelry/page.jsx) + new [src/app/product/jewelry/JewelryListClient.jsx](src/app/product/jewelry/JewelryListClient.jsx)
- [src/app/product/clothing/page.jsx](src/app/product/clothing/page.jsx) + new [src/app/product/clothing/ClothingListClient.jsx](src/app/product/clothing/ClothingListClient.jsx)
- [src/app/product/waistbeads/page.jsx](src/app/product/waistbeads/page.jsx) + new [src/app/product/waistbeads/WaistbeadsListClient.jsx](src/app/product/waistbeads/WaistbeadsListClient.jsx)
- [src/app/product/aftercare/page.jsx](src/app/product/aftercare/page.jsx) + new [src/app/product/aftercare/AftercareListClient.jsx](src/app/product/aftercare/AftercareListClient.jsx)

Reused existing fetchers from [src/lib/api/products.js](src/lib/api/products.js), [src/lib/api/blogs.js](src/lib/api/blogs.js), and [src/lib/api/content.js](src/lib/api/content.js) — they wrap native `fetch` and are server-safe.

### Phase B — Product detail pages (4 routes)

Modified [src/app/components/ProductLayout.jsx](src/app/components/ProductLayout.jsx) to accept a `product` prop directly instead of calling `useProduct(id)` internally. Each `[id]/page.jsx` became an `async` Server Component that reads `params.id`, calls `getXxxById()`, and passes the resolved product to `ProductLayout`. The cart-interaction logic (size/quantity reducer, `useSession`, `addToCart`) remains client-side inside `ProductLayout` — only the data fetch moved.

Files:
- [src/app/product/jewelry/[id]/page.jsx](src/app/product/jewelry/[id]/page.jsx)
- [src/app/product/clothing/[id]/page.jsx](src/app/product/clothing/[id]/page.jsx)
- [src/app/product/waistbeads/[id]/page.jsx](src/app/product/waistbeads/[id]/page.jsx)
- [src/app/product/aftercare/[id]/page.jsx](src/app/product/aftercare/[id]/page.jsx)
- [src/app/components/ProductLayout.jsx](src/app/components/ProductLayout.jsx) — dropped `useProduct` hook usage and the loading/error/refetch UI it powered (404s now handled by the server fetch returning `null`).

### Phase C — Static component cleanup

- Split [src/app/components/Footer.jsx](src/app/components/Footer.jsx) — newsletter form (state + toast + `ToastContainer`) extracted into new client leaf [src/app/components/NewsletterForm.jsx](src/app/components/NewsletterForm.jsx); rest of Footer is now a Server Component.
- [src/app/components/SkipNavigation.jsx](src/app/components/SkipNavigation.jsx) — removed `'use client'` (purely static anchor link).
- Verified [src/app/components/Breadcrumbs.jsx](src/app/components/Breadcrumbs.jsx) (uses `usePathname`) and [src/app/components/ProductImage.jsx](src/app/components/ProductImage.jsx) (uses `useState` + load/error events) legitimately need client — left as-is.

### Dead code removed

- `src/app/hooks/useProduct.js` — no remaining callers after Phase B
- `src/app/components/JewelryPage.jsx` — superseded by the new server page + `JewelryListClient`

## Out of Scope (intentionally left as Client Components)

Pages that legitimately need client because of session, mutation flows, or admin interaction — already leaf-shaped, no perf benefit from refactoring:

- `src/app/cart/page.jsx`, `src/app/checkout/page.jsx`, `src/app/checkout/thank-you/page.jsx`
- `src/app/dashboard/page.jsx` and `src/app/components/dashboard/*`
- `src/app/sign-in/[[...sign-in]]/page.jsx`, `src/app/reset-password/page.jsx`
- `src/app/orders/page.jsx`
- `src/app/contact/page.jsx`
- `src/app/components/Providers.jsx`, `Navigation.jsx`, `ErrorBoundary.jsx`, `TimeOut.jsx`, `FadeInSection.jsx`, all `error.jsx` files
- Homepage children (`Hero`, `PopularCategories`, `FeaturedProducts`, `Advert`, `Blogs`, `Reviews`) — already correctly rendered by the async [src/app/page.jsx](src/app/page.jsx); their `'use client'` is for framer-motion / simple state, and they are already leaves.

## Verification

- `npm run build` — passes. The 5 listing pages and 4 detail pages now appear as `ƒ` (server-rendered on demand) in the route table. Detail page route bundles dropped to ~149–151 B per route (the rest moved into shared chunks).
- `npm run lint` — only pre-existing errors remain (switch-case indentation, unused vars in unrelated files); no new errors introduced by this refactor.
- Manual smoke test recommended: `npm run dev`, then view-source on `/blogs`, `/product/jewelry`, `/product/jewelry/<id>` — initial HTML now contains the rendered content (titles, prices, images), not an empty shell. Pagination, sort (blogs), add-to-cart, size selectors all still work.
