# PayPal Removal — Follow-ups

Recorded 2026-04-30, after PayPal was removed from the codebase. These items were noticed during the removal but were out of scope. Deal with them when ready.

---

## 1. Remaining `NEXT_PUBLIC_*` secret leaks

`NEXT_PUBLIC_PAYPAL_CLIENT_SECRET` is gone, but two other server-only secrets are still bundled into the client:

| Variable | Location | Risk |
|---|---|---|
| `NEXT_PUBLIC_POSTMARK_SERVER_TOKEN` | `.env.local:13` | Anyone can send email from your Postmark account |
| `NEXT_PUBLIC_MAILGUN_API_KEY` | `.env.local:6` | Mailgun account compromise |

Mailgun isn't actually used (the `mailgun.js` and `@strapi/provider-email-mailgun` packages are dead deps per the code review), so the simplest fix for that one is removing it entirely.

For Postmark: rename to `POSTMARK_SERVER_TOKEN` (no prefix), update references in `src/app/api/order-confirmation-postmark/route.js` and `src/app/api/send-email/route.js`, **then rotate the token** since the old value is presumed leaked.

This was originally scoped under `app_context/features/PRD-001-exposed-server-tokens.md` — partially completed (Postmark renamed in some places, debug mode gated), audit step never finished.

---

## 2. `npm audit` reports 35 vulnerabilities

After running `npm install --legacy-peer-deps`:

> 35 vulnerabilities (2 low, 20 moderate, 11 high, 2 critical)

These existed before the PayPal removal — the removal didn't cause them. Run `npm audit` to see specifics. Likely candidates:
- `react@19.0.0-rc-...` and `react-dom@19.0.0-rc-...` (release candidate, not stable) — PRD-011 already calls for upgrading to stable React 19
- `axios@1.7.9` — only used in `next-auth` options; whole dep could be dropped per the code review
- Unused mailgun/strapi-email deps may carry transitive vulns

Don't blindly run `npm audit fix --force` on a Next.js 15 + React 19 RC project — it can downgrade core packages and break the build. Triage first.

---

## 3. Orphan 'CC' payment-type branch in checkout

`src/app/checkout/page.jsx` still has this around line 800:

```jsx
<div className={
    state.address.paymentType === 'CC'
      ? 'mt-8 p-4 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 shadow-sm'
      : 'hidden'
  }>
</div>
```

The PayPal button used to live inside that `<div>`. Two options:

- **Remove the 'CC' option** from the payment-type selector (and delete this empty `<div>`) if WiPay covers all card payments now
- **Wire WiPay into this branch** if you want a separate "credit card" path distinct from the existing WiPay flow

Pick whichever matches the actual checkout UX you want.

---

## Notes I did not change

- `app_context/current_feature.md` and PRDs 001/002/004/006/010/012 still reference PayPal in their historical text. Left untouched on purpose — they describe past work, not current state. If you want them annotated with a "REMOVED 2026-04-30" note, that's a separate pass.
