'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  getOrdersByStatus,
  updateOrderStatus as apiUpdateOrderStatus
} from '@/lib/api/orders';

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

        const json = await getOrdersByStatus({
          token: session.jwt,
          orderStatus,
          page,
          signal: controller.signal
        });
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
      await apiUpdateOrderStatus(id, newStatus, session.jwt);
      setOrders(prev => prev.filter(o => o.documentId !== id));
      return true;
    } catch {
      return false;
    }
  }, [session?.jwt]);

  return { orders, loading, error, refetch, updateOrderStatus };
}
