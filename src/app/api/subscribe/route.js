// app/api/subscribe/route.js
import { NextResponse } from 'next/server';
import { createRateLimiter } from '@/lib/rate-limit';
import { subscribeSchema, validateBody } from '@/lib/validation';
import { api, ApiError } from '@/lib/api-client';

const limiter = createRateLimiter({ windowMs: 60_000, max: 5 });

export async function POST(req) {
  const limited = limiter(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { data: validated, error: validationError } = validateBody(body, subscribeSchema);
    if (validationError) return validationError;

    const { email } = validated;

    let existing;
    try {
      const filterPath =
        '/api/email-lists' +
        `?filters[email][$eq]=${encodeURIComponent(email)}` +
        '&pagination[pageSize]=1';
      const result = await api.get(filterPath);
      existing = result?.data || [];
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { error: err.message || 'Downstream error' },
          { status: err.status }
        );
      }
      throw err;
    }

    if (existing.length > 0) {
      return NextResponse.json({
        message: 'Email already exists',
        status: 200
      });
    }

    try {
      await api.post('/api/email-lists', { data: { email } });
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { error: err.message || 'Downstream error' },
          { status: err.status }
        );
      }
      throw err;
    }

    return NextResponse.json({
      message: 'Subscription successful',
      status: 201
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
