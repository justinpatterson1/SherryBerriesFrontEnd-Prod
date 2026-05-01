'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import {
  getActiveCart,
  createCart as apiCreateCart,
  updateCart as apiUpdateCart
} from '@/lib/api/cart';

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
      const json = await getActiveCart(session?.user?.documentId, session?.jwt);

      if (json?.data && json.data.length > 0 && json.data[0].active) {
        setCartId(json.data[0].documentId);
        setCurrentCart(json.data[0].Items || []);
        setActive(true);
      } else {
        setCurrentCart([]);
        setActive(false);
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
      await fetchCart();
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
        TotalPrice: 0,
        User: session.user.documentId,
        active: true
      }
    };

    await apiUpdateCart(cartId, payload, session.jwt);
  };

  const createNewCart = async (productData) => {
    const payload = {
      data: {
        Items: [productData],
        TotalPrice: 0,
        User: session.user.documentId,
        active: true
      }
    };

    await apiCreateCart(payload, session.jwt);
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
