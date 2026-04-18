'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useProduct(productId, productType) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!isClient || !productId) return;

      try {
        setLoading(true);
        setError(null);

        const apiEndpoint = getApiEndpoint(productType, productId);
        const response = await fetch(apiEndpoint);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, productType, isClient]);

  const getApiEndpoint = (type, id) => {
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
  };

  const refetch = () => {
    if (productId && productType) {
      setLoading(true);
      setError(null);
      // Trigger refetch by updating dependencies
    }
  };

  return {
    product,
    loading,
    error,
    refetch,
    isClient
  };
}
