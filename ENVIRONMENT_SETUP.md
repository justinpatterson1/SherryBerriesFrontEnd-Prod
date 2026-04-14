# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root of your Next.js project with the following variables:

```bash
# Frontend URL for the application
NEXT_PUBLIC_SHERRYBERRIES_FRONTEND_URL=http://localhost:3000

# Strapi API URL
NEXT_PUBLIC_SHERRYBERRIES_URL=http://localhost:1337

# Email Configuration (Choose one service)
# Mailgun (server-side only — API key must NOT be exposed to the client)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_verified_domain.mailgun.org
NEXT_PUBLIC_EMAIL=your_email@domain.com

# Postmark (Recommended for transactional emails — server-side only)
POSTMARK_SERVER_TOKEN=your_postmark_server_token

# Alternative: SendGrid (server-side only)
SENDGRID_API_KEY=your_sendgrid_api_key

# Alternative: Resend (server-side only)
RESEND_API_KEY=your_resend_api_key

# Your verified sending domain
VERIFIED_DOMAIN=sherryberries.com

# PayPal
# Client ID is public (used by the frontend PayPal button)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
# Client secret must NEVER be public — server-side only
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# WiPay
NEXT_PUBLIC_WIPAY_ACCOUNT_NUMBER=your_wipay_account_number
# API Key from WiPay Developer portal — server-side only, used for hash verification
# Sandbox API Key is 123
WIPAY_API_KEY=your_wipay_api_key
```

## Important: NEXT_PUBLIC_ Prefix

Any environment variable prefixed with `NEXT_PUBLIC_` is bundled into the
client-side JavaScript and is visible to anyone inspecting your site. Only
use this prefix for values that are safe to expose publicly (URLs, public
keys, feature flags). Server-side secrets (API tokens, private keys,
database credentials, email service tokens) must never use this prefix.

## Production Environment

For production, update these URLs to your actual domain:

```bash
NEXT_PUBLIC_SHERRYBERRIES_FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_SHERRYBERRIES_URL=https://your-api-domain.com
```

## Phase 1 Fixes Applied

✅ Removed hardcoded localhost URLs
✅ Replaced with environment variables
✅ Removed console.log statements from critical files
✅ Fixed component naming conventions
✅ Removed dead/commented code
✅ Fixed spacing and formatting issues
