'use client';

import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import Hero from '../../components/homepage/Hero';
import Image from 'next/image';
import Link from 'next/link';
import Pagination from '../../components/Pagination';
import { useSession } from 'next-auth/react';
import { getAftercareList } from '@/lib/api/products';
import { getAftercareProductHero } from '@/lib/api/content';

function page() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aftercare, setAftercare] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [hero, setHero] = useState({});
  const { data: session, status } = useSession();

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      try {
        const [aftercareData, heroData] = await Promise.all([
          getAftercareList({ page, pageSize: 12 }),
          getAftercareProductHero()
        ]);

        setHero(heroData?.data.Hero.url);
        setAftercare(aftercareData?.data?.length ? aftercareData.data : []);
      } catch (error) {
      }
    }

    fetchData();
  }, [page]);

  //   useEffect(() => {
  //     if (jewelry) {
  //       setLoading(false);
  //     }
  //   }, [imagesLoaded, jewelry]);

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };


  if (loading && !aftercare) return <Loader />;

  return (
    <div className='bg-brand-light'>
      <Hero img={hero} />

      <div className='container mx-auto py-10 px-4 sm:px-6 lg:px-8'>
        {aftercare?.length > 0 ? (
          <>
            {/* Grid for Aftercare Products */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {aftercare.map(item => (
                <Link
                  href={`/product/aftercare/${item?.documentId}`}
                  key={item?.id}
                >
                  <div className='text-center bg-white hover:text-brand relative shadow-md rounded-md overflow-hidden'>
                    <Image
                      src={item?.image?.formats?.small?.url || item?.image?.url}
                      width={item?.image?.formats?.small?.width || 500}
                      height={item?.image?.formats?.small?.height || 500}
                      alt={item?.name || 'Aftercare Image'}
                      className='w-full object-cover'
                      onLoad={handleImageLoad}
                    />
                    <div className='py-5 px-4'>
                      <h3 className='truncate text-base py-2 font-bold text-lg'>
                        {item?.name}
                      </h3>
                      <p className='text-lg font-medium'>${item?.price}</p>
                    </div>
                    {item?.discount && (
                      <div className='w-[50px] h-[50px] rounded-full absolute top-5 right-5 bg-brand flex justify-center items-center text-white font-bold'>
                        {item.discount}%
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
          </>
        ) : (
          <p className='text-center text-gray-600 py-20'>
            No aftercare items available at the moment.
          </p>
        )}
        <div className='mt-10'>
          <Pagination page={page} setPage={setPage} length={aftercare.length} />
        </div>
      </div>
    </div>
  );
}

export default page;
