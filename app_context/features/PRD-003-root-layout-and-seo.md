# PRD-003: Convert Root Layout to Server Component & Add SEO Metadata

## Priority: CRITICAL
## Status: Open
## Category: Architecture / SEO

---

## Problem Statement

Two related issues severely impact performance and discoverability:

1. The root `layout.jsx` is marked `'use client'`, forcing the entire app tree to hydrate client-side. This increases JavaScript bundle size, slows First Contentful Paint, and prevents Server Component optimizations.
2. No page in the application exports `metadata` or `generateMetadata()` — there are no page titles, descriptions, or Open Graph tags anywhere.

## Affected Files

| File | Issue |
|------|-------|
| `src/app/layout.jsx` | Line 1: `'use client'` — should be Server Component |
| `src/app/page.jsx` | No metadata export |
| `src/app/about/page.jsx` | No metadata export |
| `src/app/contact/page.jsx` | No metadata export |
| `src/app/cart/page.jsx` | No metadata export |
| `src/app/checkout/page.jsx` | No metadata export |
| `src/app/blogs/page.jsx` | No metadata export |
| `src/app/blogs/[id]/page.jsx` | No generateMetadata |
| `src/app/orders/page.jsx` | No metadata export |
| `src/app/dashboard/page.jsx` | No metadata export |
| `src/app/product/jewelry/[id]/page.jsx` | No generateMetadata |
| `src/app/product/clothing/[id]/page.jsx` | No generateMetadata |
| `src/app/product/waistbeads/[id]/page.jsx` | No generateMetadata |
| `src/app/product/aftercare/[id]/page.jsx` | No generateMetadata |
| `src/app/sign-in/[[...sign-in]]/page.jsx` | No metadata export |
| `src/app/sign-up/[[...sign-up]]/page.jsx` | No metadata export |

## Requirements

### 1. Extract Client Providers into Wrapper Component
Create `src/app/components/Providers.jsx`:
```jsx
'use client';
import { SessionProvider } from 'next-auth/react';
import ErrorBoundary from './ErrorBoundary';

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </SessionProvider>
  );
}
```

### 2. Convert layout.jsx to Server Component
- Remove `'use client'` from `layout.jsx`.
- Import and use the `Providers` wrapper.
- Remove commented-out CartProvider/ClerkProvider code.
- Export root `metadata` object with site-wide defaults.

### 3. Add Static Metadata to All Pages
Every page.jsx should export a `metadata` object:
```javascript
export const metadata = {
  title: 'Page Title | SherryBerries',
  description: 'Page description for search engines',
};
```

### 4. Add Dynamic Metadata to Product/Blog Pages
Dynamic routes should use `generateMetadata()` to fetch product/blog data and return title, description, and Open Graph tags:
```javascript
export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.id);
  return {
    title: `${product.name} | SherryBerries`,
    description: product.description,
    openGraph: { images: [product.image] },
  };
}
```

### 5. Fix Product Pages Using `window.location`
- `src/app/product/jewelry/[id]/page.jsx` uses `window.location.pathname` to extract the ID.
- Refactor to use `params.id` from the page props (works in both Server and Client Components).

## Acceptance Criteria

- [ ] Root layout.jsx has no `'use client'` directive
- [ ] Providers wrapped in dedicated client component
- [ ] Every page has a unique `<title>` and `<meta name="description">`
- [ ] Dynamic product/blog pages generate metadata from fetched data
- [ ] Open Graph tags present on product and blog pages
- [ ] No `window.location` usage for extracting route params
- [ ] Commented-out provider code removed from layout
- [ ] `next build` completes without errors

## Estimated Scope

~4-5 hours. Provider extraction, layout refactor, metadata additions across ~15 pages, product page param fix.
