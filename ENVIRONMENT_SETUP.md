# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root of your Next.js project with the following variables:

```bash
# Frontend URL for the application
NEXT_PUBLIC_SHERRYBERRIES_FRONTEND_URL=http://localhost:3000

# Strapi API URL
NEXT_PUBLIC_SHERRYBERRIES_URL=http://localhost:1337

# Email Configuration (Choose one service)
# Current Mailgun setup
NEXT_PUBLIC_MAILGUN_API_KEY=your_mailgun_api_key
NEXT_PUBLIC_MAILGUN_DOMAIN=your_verified_domain.mailgun.org
NEXT_PUBLIC_EMAIL=your_email@domain.com

# Alternative: Postmark (Recommended for transactional emails)
POSTMARK_SERVER_TOKEN=your_postmark_server_token

# Alternative: SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# Alternative: Resend
RESEND_API_KEY=your_resend_api_key

# Your verified sending domain
VERIFIED_DOMAIN=sherryberries.com
```

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
