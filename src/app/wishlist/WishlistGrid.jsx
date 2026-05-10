'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CATEGORY_META = {
  jewelry: {
    label: 'Jewelry',
    urlPrefix: '/product/jewelry',
    fallbackEmoji: '💎',
    fallbackGradient: 'bg-gradient-to-br from-pink-200 via-rose-200 to-pink-300'
  },
  clothing: {
    label: 'Clothing',
    urlPrefix: '/product/clothing',
    fallbackEmoji: '👗',
    fallbackGradient: 'bg-gradient-to-br from-purple-200 via-fuchsia-200 to-pink-200'
  },
  aftercare: {
    label: 'Aftercare',
    urlPrefix: '/product/aftercare',
    fallbackEmoji: '🧴',
    fallbackGradient: 'bg-gradient-to-br from-teal-100 via-cyan-200 to-sky-200'
  }
};

function getFirstImage(item) {
  const img = Array.isArray(item.image) ? item.image[0] : item.image;
  return img?.formats?.small?.url || img?.url || null;
}

function itemKey(item) {
  return `${item.category}-${item.id}`;
}

export default function WishlistGrid({ initialItems }) {
  const [items, setItems] = useState(initialItems ?? []);
  const [pendingKey, setPendingKey] = useState(null);

  const handleRemove = async item => {
    const key = itemKey(item);
    if (pendingKey === key) return;

    setPendingKey(key);
    const previous = items;
    setItems(prev => prev.filter(i => itemKey(i) !== key));

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType: item.category,
          productId: item.documentId
        })
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      // If the toggle ended up adding (shouldn't happen on the wishlist page,
      // but handle defensively), restore the previous list.
      if (data.inWishlist) {
        setItems(previous);
        toast.error('Could not remove item');
        return;
      }
      toast.success(`Removed ${item.name || 'item'} from wishlist`);
    } catch (err) {
      setItems(previous);
      toast.error('Could not remove item');
    } finally {
      setPendingKey(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className='text-center py-20'>
        <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 text-brand mb-6'>
          <FaHeart className='w-8 h-8' />
        </div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          Your wishlist is empty
        </h2>
        <p className='text-gray-600 mb-6'>
          Start adding pieces you love and they will show up here.
        </p>
        <Link
          href='/product/jewelry'
          className='inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-full font-semibold transition-colors'
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {items.map(item => {
        const meta = CATEGORY_META[item.category];
        const imageUrl = getFirstImage(item);
        const productHref = `${meta.urlPrefix}/${item.documentId}`;
        const key = itemKey(item);
        const isPending = pendingKey === key;
        return (
          <article
            key={key}
            className='group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 flex flex-col'
          >
            <div
              className={`relative aspect-square overflow-hidden ${imageUrl ? '' : meta.fallbackGradient}`}
            >
              <Link href={productHref} className='block w-full h-full relative'>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.name || meta.label}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                ) : (
                  <span
                    className='absolute inset-0 flex items-center justify-center text-7xl select-none'
                    aria-hidden='true'
                  >
                    {meta.fallbackEmoji}
                  </span>
                )}
              </Link>

              <span className='absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full pointer-events-none'>
                {meta.label}
              </span>

              <button
                type='button'
                onClick={() => handleRemove(item)}
                disabled={isPending}
                aria-label={`Remove ${item.name || 'item'} from wishlist`}
                className='absolute top-3 right-3 w-9 h-9 bg-brand text-white rounded-full shadow-md flex items-center justify-center hover:bg-brand-hover transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {isPending ? (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                ) : (
                  <FaHeart className='w-4 h-4' />
                )}
              </button>
            </div>

            <div className='p-5 flex flex-col flex-1'>
              <Link href={productHref} className='block'>
                <h3 className='font-bold text-lg text-gray-900 mb-1 truncate group-hover:text-brand transition-colors'>
                  {item.name}
                </h3>
              </Link>
              <p className='text-sm text-gray-500 mb-4'>{meta.label}</p>

              <div className='mt-auto flex items-center justify-between'>
                <span className='text-xl font-bold text-brand'>
                  ${Number(item.price ?? 0).toFixed(2)}
                </span>
                <button
                  type='button'
                  className='inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-full text-sm font-medium transition-colors'
                  aria-label={`Add ${item.name || 'item'} to cart`}
                >
                  <FaShoppingCart className='w-3.5 h-3.5' />
                  Add
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
