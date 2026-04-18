import { NextResponse } from "next/server";
import { createOrder } from "../../../lib/paypalClient.js";
import { requireAuth } from '@/lib/auth';
import { paypalOrderSchema, validateBody } from '@/lib/validation';

export async function POST(request) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { data: validated, error: validationError } = validateBody(body, paypalOrderSchema);
    if (validationError) return validationError;

    const { cart } = validated;

    const { jsonResponse, httpStatusCode } = await createOrder(cart);

    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
