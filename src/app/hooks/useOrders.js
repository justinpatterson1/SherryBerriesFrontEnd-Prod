'use client';
import { useState, useEffect, useCallback } from 'react';
import { PAGINATION } from '@/lib/constants';

const POPULATE_QUERY = [
  'populate[0]=cart.Items',
  'populate[1]=cart.Items.jewelries.image',
  'populate[2]=cart.Items.waistbeads.image',
  'populate[3]=cart.Items.merchandises.image',
  'populate[4]=cart.Items.aftercares.image',
  'populate[5]=cart.User'
].join('&');

/**
 * Fetches orders for the authenticated user with status and pagination filters.
 * Returns { orders, loading, error, refetch, updateOrderStatus }.
 */
export function useOrders({ session, status, orderStatus, page }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchToken, setRefetchToken] = useState(0);

  const refetch = useCallback(() => {
    setRefetchToken(t => t + 1);
  }, []);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.jwt) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders?${POPULATE_QUERY}&filters[order_status][$eq]=${orderStatus}&pagination[page]=${page}&pagination[pageSize]=${PAGINATION.DEFAULT_PAGE_SIZE}`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.jwt}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        if (!res.ok) throw new Error(`Failed to load orders: ${res.status}`);

        const json = await res.json();
        setOrders(json?.data || []);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [session?.jwt, status, orderStatus, page, refetchToken]);

  const updateOrderStatus = useCallback(async (id, newStatus) => {
    if (!session?.jwt) return false;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${session.jwt}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: { order_status: newStatus } })
        }
      );

      if (res.ok) {
        setOrders(prev => prev.filter(o => o.documentId !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [session?.jwt]);

  return { orders, loading, error, refetch, updateOrderStatus };
}
