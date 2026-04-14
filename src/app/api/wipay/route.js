import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  const { session, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    // Read the raw incoming body exactly as client sent it
    const rawBody = await req.text();

    // Pass body EXACTLY as received to WiPay
    const response = await fetch(
      "https://tt.wipayfinancial.com/plugins/payments/request",
      {
        method: "POST",
        headers: {
          Accept: "application/json", // forces JSON response from WiPay
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: rawBody
      }
    );

    // WiPay might return non JSON on error, so we guard against parsing failure
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      const fallbackText = await response.text();
      return new Response(
        JSON.stringify({
          error: "WiPay returned non JSON response",
          raw: fallbackText
        }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "WiPay Payment Failed",
        details: error.message
      }),
      { status: 500 }
    );
  }
}
