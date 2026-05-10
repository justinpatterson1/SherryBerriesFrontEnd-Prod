'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../../components/Loader';
import SectionHero from '../../components/SectionHero';
import Pagination from '../../components/Pagination';
import { getMerchandiseList } from '@/lib/api/products';

export default function ClothingListClient({ initialProducts, initialPage }) {
  const [page, setPage] = useState(initialPage);
  const [product, setProduct] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  const isInitialFetch = useRef(true);

  useEffect(() => {
    if (isInitialFetch.current) {
      isInitialFetch.current = false;
      return;
    }
    setLoading(true);
    getMerchandiseList({ page, pageSize: 12 })
      .then(json => {
        setProduct(json?.data?.length ? json.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  if (loading && !product) return <Loader />;

  return (
    <div className='bg-brand-light'>
      <SectionHero title='Clothing' subtitle='Curated styles for every moment' />

      <div className='container mx-auto py-10 px-4 sm:px-6 lg:px-8'>
        {product.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {product.map(item => (
              <Link
                href={`/product/clothing/${item?.documentId}`}
                key={item?.id}
              >
                <div className='text-center bg-white hover:text-brand relative shadow-md rounded-md overflow-hidden'>
                  <Image
                    src={
                      item?.image[0]?.formats?.small?.url ||
                      item?.image[0]?.url
                    }
                    width={item?.image[0]?.formats?.small?.width || 500}
                    height={item?.image[0]?.formats?.small?.height || 500}
                    alt={item?.name || 'Clothing Image'}
                    className='w-full object-cover'
                  />
                  <div className='py-5 px-4'>
                    <h3 className='truncate text-base py-2 font-bold text-lg'>
                      {item?.name}
                    </h3>
                    <p className='text-lg font-medium'>${item?.price}</p>
                  </div>
                  {item?.discount != 0 && (
                    <div className='w-[50px] h-[50px] rounded-full absolute top-5 right-5 bg-brand flex justify-center items-center text-white font-bold'>
                      {item.discount}%
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className='text-center text-gray-600 py-20'>
            No clothing items available at the moment.
          </p>
        )}
        <div className='mt-10'>
          <Pagination page={page} setPage={setPage} length={product.length} />
        </div>
      </div>
    </div>
  );
}
