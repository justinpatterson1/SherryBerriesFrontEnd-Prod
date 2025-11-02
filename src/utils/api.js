// utils/api.js

export const addToCart = async(userId, itemType, itemId, quantity) => {
  const response = await fetch(`${process.env.STRAP_API_URL}/api/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, itemType, itemId, quantity })
  });

  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }

  const data = await response.json();
  return data;
};
