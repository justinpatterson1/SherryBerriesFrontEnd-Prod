import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(null);

  console.log(process.env.STRAPI_URL);
  useEffect(() => {
    const fetchCartId = async () => {
      try {
        // Fetch cartId from Strapi API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/cart`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include' // Include cookies if necessary
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCartId(data.cartId); // Assuming Strapi's response includes { cartId }
        } else {
          console.error('Failed to fetch cartId');
        }
      } catch (error) {
        console.error('Error fetching cartId:', error);
      }
    };

    fetchCartId();
  }, []);

  return (
    <CartContext.Provider value={{ cartId, setCartId }}>
      {children}
    </CartContext.Provider>
  );
};

//export const useCart = () => useContext(CartContext);
