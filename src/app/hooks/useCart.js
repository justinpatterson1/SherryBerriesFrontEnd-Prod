'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

export function useCart() {
  const [cartId, setCartId] = useState('');
  const [currentCart, setCurrentCart] = useState([]);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.documentId) {
      fetchCart();
    }
  }, [session]);

  const fetchCart = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/cart-items?filters[User][documentId][$eq]=${session?.user?.documentId}&filters[isCompleted][$eq]=false&filters[active][$eq]=true&populate[Items][populate][jewelries][populate][image]=true&populate[Items][populate][merchandises][populate][image]=true&populate[Items][populate][waistbeads][populate][image]=true&populate[Items][populate][aftercares][populate][image]=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.jwt}`
          }
        }
      );

      if (response.ok) {
        const json = await response.json();

        if (json.data && json.data.length > 0 && json.data[0].active) {
          setCartId(json.data[0].documentId);
          setCurrentCart(json.data[0].Items || []);
          setActive(true);
        } else {
          // No active cart found
          setCurrentCart([]);
          setActive(false);
        }
      }
    } catch (error) {
    }
  };

  const addToCart = async (productData) => {
    if (!session) {
      throw new Error('Please sign in to add items to cart');
    }


    setLoading(true);
    try {
      if (active) {
        await updateExistingCart(productData);
      } else {
        await createNewCart(productData);
      }
      toast.success('Item added to cart!');
      // Refresh cart data
      await fetchCart();
      // Dispatch event to notify other components of cart update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingCart = async (productData) => {
    const updatedItems = currentCart.map(item => ({
      ItemType: item.ItemType,
      ...(item.ItemType === 'Jewelry' && item.jewelries?.length > 0
        ? { jewelries: [item.jewelries[0]?.documentId] }
        : {}),
      ...(item.ItemType === 'Merchandise' && item.merchandises?.length > 0
        ? { merchandises: [item.merchandises[0]?.documentId] }
        : {}),
      ...(item.ItemType === 'Waistbead' && item.waistbeads?.length > 0
        ? { waistbeads: [item.waistbeads[0]?.documentId] }
        : {}),
      ...(item.ItemType === 'Aftercare' && item.aftercares?.length > 0
        ? { aftercares: [item.aftercares[0]?.documentId] }
        : {}),
      quantity: item.quantity,
      ...(item.ItemType === 'Jewelry'
        ? { size: item.size }
        : item.ItemType === 'Merchandise'
          ? { clothingSize: item.clothingSize }
          : item.ItemType === 'Waistbead'
            ? { waistbeadSize: item.waistbeadSize }
            : {}),
      color: item.color
    }));

    // Check if item already exists and update quantity or add new
    const existingItemIndex = updatedItems.findIndex(item => 
      item.ItemType === productData.ItemType && 
      (item.jewelries?.[0] === productData.jewelries?.[0] ||
       item.merchandises?.[0] === productData.merchandises?.[0] ||
       item.waistbeads?.[0] === productData.waistbeads?.[0] ||
       item.aftercares?.[0] === productData.aftercares?.[0])
    );

    if (existingItemIndex !== -1) {
      updatedItems[existingItemIndex].quantity += productData.quantity;
    } else {
      updatedItems.push(productData);
    }

    const payload = {
      data: {
        Items: updatedItems,
        TotalPrice: 0, // Will be calculated server-side
        User: session.user.documentId,
        active: true
      }
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/cart-items/${cartId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.jwt}`
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update cart');
    }
  };

  const createNewCart = async (productData) => {
    const payload = {
      data: {
        Items: [productData],
        TotalPrice: 0, // Will be calculated server-side
        User: session.user.documentId,
        active: true
      }
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/cart-items`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.jwt}`
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create cart');
    }
  };

  const refreshCart = async () => {
    if (session?.user?.documentId) {
      await fetchCart();
    }
  };

  return {
    cartId,
    currentCart,
    active,
    loading,
    addToCart,
    fetchCart,
    refreshCart
  };
}
