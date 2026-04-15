import { requireAuth } from '@/lib/auth';
import { couponSchema, validateBody } from '@/lib/validation';

export async function POST(req) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const { data: validated, error: validationError } = validateBody(body, couponSchema);
  if (validationError) return validationError;

  const { code } = validated;

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
