'use client';
import { useState, useEffect, useCallback } from 'react';
import { getJewelryList } from '@/lib/api/products';

/**
 * Fetches paginated jewelry items.
 * Returns { items, loading, error, totalPages, refetch }.
 */
export function useJewelry({ page = 1 } = {}) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchToken, setRefetchToken] = useState(0);

  const refetch = useCallback(() => {
    setRefetchToken(t => t + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const json = await getJewelryList({ page, signal: controller.signal });
        setItems(json?.data || []);
        setTotalPages(json?.meta?.pagination?.pageCount || 1);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [page, refetchToken]);

  return { items, loading, error, totalPages, refetch };
}
