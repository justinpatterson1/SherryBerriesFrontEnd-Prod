import { requireAuth } from '@/lib/auth';

const REQUIRED_WIPAY_PARAMS = [
  'account_number', 'country_code', 'currency', 'environment',
  'fee_structure', 'method', 'order_id', 'origin', 'response_url', 'total'
];

export async function POST(req) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    // Read the raw incoming body exactly as client sent it
    const rawBody = await req.text();

    // Validate required WiPay params are present
    const params = new URLSearchParams(rawBody);
    const missing = REQUIRED_WIPAY_PARAMS.filter(p => !params.get(p));
    if (missing.length > 0) {
      return Response.json(
        { error: 'Invalid request', details: `Missing required parameters: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

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
