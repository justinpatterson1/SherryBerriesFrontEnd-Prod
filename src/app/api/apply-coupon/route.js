import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  const { session, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { code } = await req.json().catch(() => ({}));
  if (!code) {
    return Response.json({ error: 'Coupon code is required.' }, { status: 400 });
  }

  try {
    const strapiRes = await fetch(
      `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/coupons/validate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      }
    );

    const data = await strapiRes.json();
    if (!strapiRes.ok) {
      return Response.json(
        { error: data.message || 'Failed to validate coupon.' },
        { status: strapiRes.status }
      );
    }

    return Response.json({ discount: data });
  } catch (err) {
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
