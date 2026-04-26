'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';

export default function CartBadge({ className = '' }) {
  const { data: session, status } = useSession();
  const { currentCart, refreshCart } = useCart();

  const cartCount = useMemo(
    () => currentCart?.reduce((total, item) => total + (item.quantity || 0), 0) || 0,
    [currentCart]
  );

  useEffect(() => {
    if (!session?.user?.documentId) return;

    const handleFocus = () => refreshCart();
    const handleCartUpdate = () => refreshCart();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [session?.user?.documentId, refreshCart]);

  if (status !== 'authenticated' || session?.user?.role_type !== 'customer') {
    return null;
  }

  return (
    <Link
      href='/cart'
      className={`relative p-2 text-gray-600 hover:text-brand transition-colors duration-300 ${className}`}
      aria-label={`Cart with ${cartCount} items`}
    >
      <FaShoppingCart className='w-5 h-5' />
      {cartCount > 0 && (
        <span className='absolute -top-1 -right-1 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
          {cartCount}
        </span>
      )}
    </Link>
  );
}
