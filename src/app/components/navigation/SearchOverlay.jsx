'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { useProductSearch } from '../../hooks/useProductSearch';

const GROUP_ORDER = [
  { key: 'jewelry', label: 'Jewelry' },
  { key: 'merchandise', label: 'Clothing' },
  { key: 'waistbeads', label: 'Waistbeads' },
  { key: 'aftercare', label: 'Aftercare' }
];

export default function SearchOverlay({ open, onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const { query, setQuery, results, loading, error } = useProductSearch();

  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open, setQuery]);

  const submit = e => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleResultClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className='fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm'
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='absolute top-0 left-0 right-0 bg-white shadow-2xl max-h-[90vh] overflow-y-auto'
            onClick={e => e.stopPropagation()}
            role='dialog'
            aria-modal='true'
            aria-label='Search products'
          >
            <div className='container mx-auto px-4 py-5'>
              <form onSubmit={submit} className='flex items-center gap-3'>
                <FiSearch className='w-6 h-6 text-gray-400 shrink-0' />
                <input
                  ref={inputRef}
                  type='search'
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder='Search products...'
                  className='flex-1 text-lg py-2 outline-none border-b border-gray-200 focus:border-brand transition-colors'
                  aria-label='Search'
                />
                <button
                  type='button'
                  onClick={onClose}
                  className='p-2 text-gray-500 hover:text-brand transition-colors'
                  aria-label='Close search'
                >
                  <FiX className='w-6 h-6' />
                </button>
              </form>

              <div className='mt-6'>
                {error && (
                  <p className='text-center text-red-600 py-6'>Search failed: {error}</p>
                )}

                {!error && query.trim() && loading && (
                  <p className='text-center text-gray-500 py-6'>Searching...</p>
                )}

                {!error && !loading && query.trim() && results.total === 0 && (
                  <p className='text-center text-gray-600 py-6'>
                    No products matched &ldquo;{query.trim()}&rdquo;.
                  </p>
                )}

                {!error && results.total > 0 && (
                  <div className='space-y-6'>
                    {GROUP_ORDER.map(({ key, label }) => {
                      const items = results[key];
                      if (!items || items.length === 0) return null;
                      return (
                        <section key={key}>
                          <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3'>
                            {label}
                          </h3>
                          <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                            {items.map(item => (
                              <li key={`${item._type}-${item.id}`}>
                                <Link
                                  href={item._href}
                                  onClick={handleResultClick}
                                  className='flex items-center gap-3 p-2 rounded-md hover:bg-pink-50 transition-colors'
                                >
                                  {item.image?.url && (
                                    <Image
                                      src={item.image?.formats?.thumbnail?.url || item.image?.url}
                                      width={56}
                                      height={56}
                                      alt={item._name}
                                      className='w-14 h-14 object-cover rounded'
                                    />
                                  )}
                                  <div className='min-w-0 flex-1'>
                                    <p className='font-medium truncate'>{item._name}</p>
                                    <p className='text-sm text-gray-600'>${item.price}</p>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </section>
                      );
                    })}

                    <div className='pt-4 border-t border-gray-100'>
                      <button
                        type='button'
                        onClick={submit}
                        className='w-full text-center py-3 font-medium text-brand hover:bg-pink-50 rounded-md transition-colors'
                      >
                        View all results for &ldquo;{query.trim()}&rdquo; &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
