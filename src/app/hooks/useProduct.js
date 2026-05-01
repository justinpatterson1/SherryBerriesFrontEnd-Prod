'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  getJewelryById,
  getMerchandiseById,
  getWaistbeadsById,
  getAftercareById
} from '@/lib/api/products';

function fetchByType(type, id, opts) {
  switch (type) {
    case 'jewelry':
      return getJewelryById(id, opts);
    case 'clothing':
      return getMerchandiseById(id, opts);
    case 'waistbead':
      return getWaistbeadsById(id, opts);
    case 'aftercare':
      return getAftercareById(id, opts);
    default:
      throw new Error(`Unknown product type: ${type}`);
  }
}

export function useProduct(productId, productType) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [refetchToken, setRefetchToken] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !productId) return;

    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const json = await fetchByType(productType, productId, { signal: controller.signal });

        if (json.data) {
          setProduct(json.data);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [productId, productType, isClient, refetchToken]);

  const refetch = useCallback(() => {
    setRefetchToken(t => t + 1);
  }, []);

  return {
    product,
    loading,
    error,
    refetch,
    isClient
  };
}
