// app/api/subscribe/route.js
import { NextResponse } from 'next/server';
import { createRateLimiter } from '@/lib/rate-limit';

const limiter = createRateLimiter({ windowMs: 60_000, max: 5 });

export async function POST(req) {
  const limited = limiter(req);
  if (limited) return limited;

  try {
    // 1. parse body
    const { email } = await req.json();

    // 2. validate
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Email is not valid', status: 400 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_SHERRYBERRIES_URL;
    if (!apiUrl) {
      console.error('Missing NEXT_PUBLIC_SHERRYBERRIES_URL');
      return NextResponse.json({
        error: 'Server configuration error',
        status: 500
      });
    }

    // 3. check for existing email via Strapi filter
    const filterUrl =
      `${apiUrl}/api/email-lists?` +
      `filters[email][$eq]=${encodeURIComponent(email)}` +
      '&pagination[pageSize]=1';
    const checkRes = await fetch(filterUrl, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!checkRes.ok) {
      const err = await checkRes.json();
      console.error('Error checking existing list:', err);
      return NextResponse.json(
        { error: err.error?.message || 'Downstream error' },
        { status: checkRes.status }
      );
    }

    const { data: existing } = await checkRes.json();
    if (existing.length > 0) {
      return NextResponse.json({
        message: 'Email already exists',
        status: 200
      });
    }

    console.log(apiUrl);

    const createRes = await fetch(`${apiUrl}/api/email-lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // if you have a Strapi API token, include it here:
        // "Authorization": `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({ data: { email } })
    });

    // log status and raw body so you know what Strapi is returning
    const text = await createRes.text();
    console.error('Strapi create status:', createRes.status, 'body:', text);

    if (!createRes.ok) {
      // if it was JSON, parse it, otherwise use the raw text
      let err;
      try {
        err = JSON.parse(text);
      } catch {
        err = { message: text };
      }

      console.error('Error creating subscription:', err);
      return NextResponse.json(
        { error: err.error?.message || err.message || 'Downstream error' },
        { status: createRes.status }
      );
    }

    return NextResponse.json({
      message: 'Subscription successful',
      status: 201
    });
  } catch (err) {
    console.error('Subscribe route error:', err);
    return NextResponse.json({ error: 'Internal Servers Error', status: 500 });
  }
}
