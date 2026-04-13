import { NextResponse } from "next/server";
import { createOrder } from "../../../lib/paypalClient.js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { cart } = body;

    const { jsonResponse, httpStatusCode } = await createOrder(cart);

    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
