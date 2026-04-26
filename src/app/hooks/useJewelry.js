'use client';
import { useState, useEffect, useCallback } from 'react';
import { PAGINATION } from '@/lib/constants';

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

        const url = `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/jewelries?populate[0]=image&populate[1]=sizes&pagination[page]=${page}&pagination[pageSize]=${PAGINATION.DEFAULT_PAGE_SIZE}`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) throw new Error(`Failed to load jewelry: ${res.status}`);

        const json = await res.json();
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
