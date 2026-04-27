'use client';

/**
 * Skip navigation link — visually hidden until focused, then displayed.
 * Anchor-based navigation works reliably across all pages without
 * needing JavaScript to handle focus.
 */
export default function SkipNavigation() {
  return (
    <a
      href='#main-content'
      className='sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-white'
    >
      Skip to main content
    </a>
  );
}
