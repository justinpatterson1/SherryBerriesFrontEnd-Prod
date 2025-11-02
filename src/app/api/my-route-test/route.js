export async function GET(request) {
  try {
    const res = await fetch(
      'https://official-joke-api.appspot.com/random_joke'
    );
    const data = await res.json(); // Convert response to JSON

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching joke:', error);

    return new Response(JSON.stringify({ error: 'Failed to fetch joke' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
