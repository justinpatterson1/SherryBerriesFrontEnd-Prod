# Advert Section Update

## Status: Done

## Goal

Update the Advert component for a cleaner look and aesthetic

## Requirements

- Use the image from the component in the update
- Use screenshot D:\Development Files\React Development\nextjs-project\my-next-app\app_context\screenshots\AdvertSection.png
- Ensure the top and down padding and margins of the component is proportional.

## Implementation

Implemented in [src/app/components/homepage/Advert.jsx](../../src/app/components/homepage/Advert.jsx):

- Two-column responsive layout (image left, copy right) with `md:grid-cols-2` and `gap-12 lg:gap-16`.
- Decorative `bg-brand-light` shadow card offset behind the product image (`-translate-x-4 translate-y-4` on mobile, `-translate-x-6 translate-y-6` on md+) for the layered look in the screenshot.
- Top/bottom padding set to `py-20` on the outer `<section>` so the component breathes evenly between adjacent homepage sections (rhythm preserved with the alternating tinted backgrounds added in PRD-013/related homepage tweaks).
- Display heading uses `font-display` at `text-4xl md:text-5xl lg:text-6xl`; body copy at `text-base md:text-lg` with muted `text-gray-600`.
- "Shop Now" CTA uses brand pink (`bg-brand` → `hover:bg-brand-hover`) with uppercase tracked-out type, matching the brand button system used elsewhere on the homepage.
- Image rendered with Next/Image using the populated `image.formats.large` URL/dimensions from the Strapi `Advert` component on the homepage payload.

## Notes

- This component is rendered from the async Server Component at [src/app/page.jsx](../../src/app/page.jsx) — data is fetched via `getHomepage()` server-side and passed as props. The component itself contains no client-only behavior, so it remains a Server Component (no `'use client'`).
