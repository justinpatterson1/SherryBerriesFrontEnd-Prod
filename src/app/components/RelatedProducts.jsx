'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api-client';

export default function RelatedProducts({ 
  currentProductId, 
  productType, 
  limit = 4 
}) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const path = getApiPath(productType);
        if (!path) throw new Error('Failed to fetch related products');
        const json = await api.get(`${path}?populate=*&pagination[limit]=${limit + 1}`);
        const products = json.data || [];

        const filtered = products
          .filter(product => product.documentId !== currentProductId)
          .slice(0, limit);

        setRelatedProducts(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId && productType) {
      fetchRelatedProducts();
    }
  }, [currentProductId, productType, limit]);

  const getApiPath = (type) => {
    switch (type) {
      case 'jewelry':
        return '/api/jewelries';
      case 'clothing':
        return '/api/merchandises';
      case 'waistbead':
        return '/api/waistbeads';
      case 'aftercare':
        return '/api/aftercares';
      default:
        return '';
    }
  };

  const getProductRoute = (type, id) => {
    switch (type) {
      case 'jewelry':
        return `/product/jewelry/${id}`;
      case 'clothing':
        return `/product/clothing/${id}`;
      case 'waistbead':
        return `/product/waistbeads/${id}`;
      case 'aftercare':
        return `/product/aftercare/${id}`;
      default:
        return '#';
    }
  };

  const formatPrice = (price, discount) => {
    if (discount && discount > 0) {
      return ((1 + discount / 100) * price).toFixed(2);
    }
    return price.toFixed(2);
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || relatedProducts.length === 0) {
    return null; // Don't show section if there are no related products or error
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          You might also like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <Link
              key={product.documentId}
              href={getProductRoute(productType, product.documentId)}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={product.image?.url || product.image?.[0]?.url || '/placeholder-image.jpg'}
                  alt={product.name || product.Name || 'Product image'}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {product.discount < 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{product.discount}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.name || product.Name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-pink-500">
                    ${formatPrice(product.price, product.discount)}
                  </span>
                  { product.discount < 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
