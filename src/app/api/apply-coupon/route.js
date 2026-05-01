import { requireAuth } from '@/lib/auth';
import { couponSchema, validateBody } from '@/lib/validation';
import { api, ApiError } from '@/lib/api-client';

export async function POST(req) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const { data: validated, error: validationError } = validateBody(body, couponSchema);
  if (validationError) return validationError;

  const { code } = validated;

  try {
    const data = await api.post('/api/coupons/validate', { code });
    return Response.json({ discount: data });
  } catch (err) {
    if (err instanceof ApiError) {
      return Response.json(
        { error: err.message || 'Failed to validate coupon.' },
        { status: err.status }
      );
    }
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
