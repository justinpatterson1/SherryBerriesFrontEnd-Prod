export async function POST(req) {
  try {
    const rawBody = await req.text(); // Reads the raw body as string
    const params = new URLSearchParams(rawBody).toString();

    // const parsedBody = {};
    // for (const [key, value] of params.entries()) {
    //     if(key==='data'){
    //         parsedBody[key] = JSON.stringify(value);
    //     } else {
    //         parsedBody[key] = value;
    //     }

    // }

    const response = await fetch(
      'https://tt.wipayfinancial.com/plugins/payments/request',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      }
    );

    const data = await response.json();

    console.log('Get Data: ' + data);

    if (data) {
      return new Response(
        JSON.stringify({
          message: 'Successfully received body',
          data,
          status: 200
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'WiPay Payment Failed: ',
        details: error.message
      })
    );
  }
}
