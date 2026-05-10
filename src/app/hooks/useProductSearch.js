'use client';
import { useState, useEffect } from 'react';
import { searchProducts } from '@/lib/api/products';

const EMPTY = { jewelry: [], merchandise: [], waistbeads: [], aftercare: [], total: 0 };

export function useProductSearch({ debounceMs = 300, pageSize = 8 } = {}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(EMPTY);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchProducts(trimmed, { pageSize, signal: controller.signal });
        setResults(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setResults(EMPTY);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, debounceMs, pageSize]);

  return { query, setQuery, results, loading, error };
}
