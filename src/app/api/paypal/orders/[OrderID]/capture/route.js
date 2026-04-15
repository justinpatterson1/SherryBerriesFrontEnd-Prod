import { NextResponse } from "next/server";
import { captureOrder } from "../../../../../lib/paypalClient";
import { requireAuth } from '@/lib/auth';
import { paypalCaptureParamsSchema, validateBody } from '@/lib/validation';

export async function POST(request, { params }) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { data: validatedParams, error: validationError } = validateBody(params, paypalCaptureParamsSchema);
  if (validationError) return validationError;

  const { OrderID: orderID } = validatedParams;

  try {
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);

    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    console.error("Failed to capture order:", error);
    return NextResponse.json(
      { error: "Failed to capture order" },
      { status: 500 }
    );
  }
}
