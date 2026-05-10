'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import SectionHero from '../components/SectionHero';
import Loader from '../components/Loader';
import { searchProducts } from '@/lib/api/products';

const GROUPS = [
  { key: 'jewelry', label: 'Jewelry' },
  { key: 'merchandise', label: 'Clothing' },
  { key: 'waistbeads', label: 'Waistbeads' },
  { key: 'aftercare', label: 'Aftercare' }
];

const EMPTY = { jewelry: [], merchandise: [], waistbeads: [], aftercare: [], total: 0 };

export default function SearchClient({ initialQuery }) {
  const [query, setQuery] = useState(initialQuery || '');
  const [submitted, setSubmitted] = useState(initialQuery || '');
  const [results, setResults] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(initialQuery));
  const [error, setError] = useState(null);

  useEffect(() => {
    const trimmed = submitted.trim();
    if (!trimmed) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchProducts(trimmed, { pageSize: 24, signal: controller.signal })
      .then(setResults)
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setResults(EMPTY);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [submitted]);

  const onSubmit = e => {
    e.preventDefault();
    setSubmitted(query);
    const url = new URL(window.location.href);
    if (query.trim()) {
      url.searchParams.set('q', query.trim());
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className='bg-brand-light min-h-screen'>
      <SectionHero
        title='Search'
        subtitle={submitted ? `Results for “${submitted}”` : 'Find products across the catalog'}
      />

      <div className='container mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        <form onSubmit={onSubmit} className='flex items-center gap-3 max-w-2xl mx-auto mb-10 bg-white rounded-full shadow-md px-5 py-3'>
          <FiSearch className='w-5 h-5 text-gray-400 shrink-0' />
          <input
            type='search'
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Search products...'
            className='flex-1 outline-none text-base'
            aria-label='Search'
          />
          <button
            type='submit'
            className='px-4 py-1 bg-brand text-white rounded-full text-sm font-medium hover:bg-pink-600 transition-colors'
          >
            Search
          </button>
        </form>

        {loading && <Loader />}

        {!loading && error && (
          <p className='text-center text-red-600 py-10'>Search failed: {error}</p>
        )}

        {!loading && !error && submitted.trim() && results.total === 0 && (
          <div className='text-center py-20'>
            <p className='text-gray-700 text-lg mb-3'>
              No products matched &ldquo;{submitted.trim()}&rdquo;.
            </p>
            <Link href='/' className='text-brand hover:underline'>
              Back to home
            </Link>
          </div>
        )}

        {!loading && !error && results.total > 0 && (
          <div className='space-y-12'>
            {GROUPS.map(({ key, label }) => {
              const items = results[key];
              if (!items || items.length === 0) return null;
              return (
                <section key={key}>
                  <h2 className='text-2xl font-bold mb-5'>{label}</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {items.map(item => (
                      <Link href={item._href} key={`${item._type}-${item.id}`}>
                        <div className='text-center bg-white hover:text-brand relative shadow-md rounded-md overflow-hidden'>
                          {item.image?.url && (
                            <Image
                              src={item.image?.formats?.small?.url || item.image?.url}
                              width={item.image?.formats?.small?.width || 500}
                              height={item.image?.formats?.small?.height || 500}
                              alt={item._name || 'Product Image'}
                              style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
                            />
                          )}
                          <div className='py-5 px-4'>
                            <h3 className='truncate text-base py-2 font-bold text-lg'>
                              {item._name}
                            </h3>
                            <p className='text-lg font-medium'>${item.price}</p>
                          </div>
                          {item.discount != 0 && item.discount != null && (
                            <div className='w-[50px] h-[50px] rounded-full absolute top-5 right-5 bg-brand flex justify-center items-center text-white font-bold'>
                              {item.discount}%
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
