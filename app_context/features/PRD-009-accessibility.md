# PRD-009: Accessibility Compliance (WCAG 2.1 AA)

## Priority: MEDIUM
## Status: Open
## Category: Accessibility / UX

---

## Problem Statement

The application would fail a WCAG 2.1 AA audit. Navigation dropdowns are keyboard-inaccessible, ARIA labels are missing from interactive elements, clickable `<div>`s replace semantic `<button>`s, and focus management is incomplete. This excludes users who rely on keyboards, screen readers, or assistive technology.

## Key Issues

### 1. Keyboard-Inaccessible Navigation Dropdowns
**File:** `src/app/components/Navigation.jsx`
- Dropdown menus open on `onMouseEnter` / `onMouseLeave` only.
- Keyboard users (Tab navigation) cannot open or navigate dropdown items.
- Mobile menu toggle lacks `aria-expanded` state.
- `window.dropdownTimeout` with `setTimeout` creates timing issues for assistive tech.

### 2. Missing ARIA Attributes
| File | Element | Missing |
|------|---------|---------|
| `Navigation.jsx` | Logo link | `aria-label="Home"` |
| `Navigation.jsx` | Mobile menu button | `aria-label`, `aria-expanded` |
| `Navigation.jsx` | Product dropdown | `aria-haspopup`, `aria-expanded`, `role="menu"` |
| `OrderCard.jsx` | Status badge | `aria-label` describing status |
| `AddJewelryModule.jsx` | Modal | `role="dialog"`, `aria-modal`, `aria-labelledby` |
| `AddJewelryModule.jsx` | File input | No associated `<label>` |

### 3. Non-Semantic HTML
| File | Current | Should Be |
|------|---------|-----------|
| `Navigation.jsx` | Dropdown container is `<div>` | `<nav>` with `<ul>`/`<li>` or `role="menu"` |
| `Orders.jsx` line ~190 | Clickable `<div>` for expand/collapse | `<button>` |
| `FeaturedProducts.jsx` line ~84 | Product cards are `<div>` | `<article>` |

### 4. Missing Focus Management
- `AddJewelryModule.jsx` modal: No focus trap — Tab can leave the modal to background elements.
- No `Escape` key handler to close modals.
- After modal close, focus doesn't return to the trigger button.
- `useFocusManagement` hook exists in `src/app/hooks/` but its usage across the app is unclear.

### 5. Form Accessibility Gaps
- Error messages are not announced to screen readers (no `aria-live` region or `role="alert"`).
- Required fields not marked with `aria-required`.
- Form validation errors from Formik/Yup not associated with fields via `aria-describedby`.

### 6. Image Alt Text
- Most product images have alt text (good).
- Some dynamic images may have empty or missing alt attributes when image data is null.

## Requirements

### 1. Fix Navigation Keyboard Access
- Add `onFocus` / `onBlur` handlers alongside mouse events for dropdown.
- Implement arrow key navigation within dropdown (`ArrowDown`, `ArrowUp`, `Escape`).
- Add `aria-haspopup="true"`, `aria-expanded`, and `role="menu"` / `role="menuitem"`.
- Add `aria-label` to logo, mobile toggle, and search input.

### 2. Add ARIA to Interactive Elements
- All modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
- All toggleable sections: `aria-expanded` reflecting state.
- Status badges: `aria-label` (e.g., `aria-label="Order status: pending"`).

### 3. Replace Non-Semantic HTML
- Clickable `<div>`s → `<button>` elements (with proper styling via `appearance: none`).
- Product cards → `<article>` elements.
- Navigation lists → `<ul>` / `<li>`.

### 4. Implement Focus Management
- Modal focus trap: focus stays within modal while open.
- Focus restore: return focus to trigger element on modal close.
- `Escape` key closes modals and dropdowns.
- Leverage existing `useFocusManagement` hook or extend it.

### 5. Form Error Announcements
- Add `aria-live="polite"` region for form error summaries.
- Associate field-level errors with inputs via `aria-describedby`.
- Mark required fields with `aria-required="true"`.

### 6. Skip Navigation Link
- Add a "Skip to main content" link as the first focusable element in `layout.jsx`.

## Acceptance Criteria

- [ ] All interactive elements reachable and operable via keyboard alone
- [ ] Dropdown opens on Enter/Space, navigates with arrow keys, closes on Escape
- [ ] Modals trap focus and restore on close
- [ ] All ARIA attributes present on interactive elements
- [ ] No clickable `<div>`s — all use `<button>` or `<a>`
- [ ] Form errors announced to screen readers
- [ ] "Skip to content" link present
- [ ] Pass automated audit (axe-core / Lighthouse Accessibility score > 90)

## Estimated Scope

~6-8 hours. Navigation keyboard rework, ARIA additions, modal focus trap, form announcements, semantic HTML replacements.
