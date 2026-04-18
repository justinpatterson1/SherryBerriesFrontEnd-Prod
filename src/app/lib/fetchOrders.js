export const fetchOrders = async status => {
  const response = await fetch(
    '/api/order',
    {
      method: 'GET',
      credentials: 'include', // ✅ Ensures cookies are sent with the request
      cache: 'no-store'
    } // Prevent caching to always get fresh data
  );

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
};
