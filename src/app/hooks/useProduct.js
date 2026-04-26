'use client';
import { useState, useEffect, useCallback } from 'react';

function getApiEndpoint(type, id) {
  const baseUrl = process.env.NEXT_PUBLIC_SHERRYBERRIES_URL;
  switch (type) {
    case 'jewelry':
      return `${baseUrl}/api/jewelries/${id}?populate=*`;
    case 'clothing':
      return `${baseUrl}/api/merchandises/${id}?populate=*`;
    case 'waistbead':
      return `${baseUrl}/api/waistbeads/${id}?populate=*`;
    case 'aftercare':
      return `${baseUrl}/api/aftercares/${id}?populate=*`;
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

        const apiEndpoint = getApiEndpoint(productType, productId);
        const response = await fetch(apiEndpoint, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const json = await response.json();

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
