'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../../components/Loader';
import SectionHero from '../../components/SectionHero';
import Pagination from '../../components/Pagination';
import { getJewelryListPopulated } from '@/lib/api/products';

export default function JewelryListClient({ initialProducts, initialPage }) {
  const [page, setPage] = useState(initialPage);
  const [jewelry, setJewelry] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  const isInitialFetch = useRef(true);

  useEffect(() => {
    if (isInitialFetch.current) {
      isInitialFetch.current = false;
      return;
    }
    setLoading(true);
    getJewelryListPopulated({ page, pageSize: 12 })
      .then(json => {
        setJewelry(json?.data?.length ? json.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <Loader />;

  return (
    <div className='bg-brand-light'>
      <SectionHero title='Jewelry' subtitle='Handcrafted pieces to make you sparkle' />

      <div className='container mx-auto py-10 px-4 sm:px-6 lg:px-8'>
        {jewelry.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {jewelry.map(jewels => (
              <Link
                href={`/product/jewelry/${jewels?.documentId}`}
                key={jewels?.id}
              >
                <div className='text-center bg-white hover:text-brand relative shadow-md rounded-md overflow-hidden'>
                  <Image
                    src={jewels?.image?.formats?.small?.url || jewels?.image?.url}
                    width={jewels?.image?.formats?.small?.width || 500}
                    height={jewels?.image?.formats?.small?.height || 500}
                    alt={jewels?.name || 'Jewelry Image'}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                  <div className='py-5 px-4'>
                    <h3 className='truncate text-base py-2 font-bold text-lg'>
                      {jewels?.name}
                    </h3>
                    <p className='text-lg font-medium'>${jewels?.price}</p>
                  </div>
                  {jewels.discount != 0 && (
                    <div className='w-[50px] h-[50px] rounded-full absolute top-5 right-5 bg-brand flex justify-center items-center text-white font-bold'>
                      {jewels.discount}%
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className='text-center text-gray-600 py-20'>
            No jewelry available at the moment.
          </p>
        )}
        <div className='mt-10'>
          <Pagination page={page} setPage={setPage} length={jewelry.length} />
        </div>
      </div>
    </div>
  );
}
