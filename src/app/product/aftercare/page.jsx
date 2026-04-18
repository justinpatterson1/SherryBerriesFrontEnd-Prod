'use client';

import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import Hero from '../../components/homepage/Hero';
import Image from 'next/image';
import Link from 'next/link';
import Pagination from '../../components/Pagination';
import options from '../../api/auth/[...nextauth]/options.js';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { SYSTEM_ENTRYPOINTS } from 'next/dist/shared/lib/constants';

function page() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aftercare, setAftercare] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [hero, setHero] = useState({});
  const { data: session, status } = useSession();

  useEffect(() => {
    setLoading(true);

    try {
      async function fetchData() {
        try {
          const aftercareResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/aftercares?pagination[page]=${page}&pagination[pageSize]=12&populate=*`
          );
          const heroImgResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/aftercare-product?populate[0]=Hero`
          );

          const heroData = await heroImgResponse.json();
          const aftercareData = await aftercareResponse.json();


          setHero(heroData?.data.Hero.url);

          if (aftercareData?.data.length !== 0) {
            setAftercare(aftercareData?.data);
          } else {
            setAftercare([]);
          }

          //setLoading(false)
        } catch (error) {
        }
      }

      fetchData();
    } catch (error) {
    }
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
    <div className='bg-[#ffefef]'>
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
                  <div className='text-center bg-white hover:text-[#EA4492] relative shadow-md rounded-md overflow-hidden'>
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
                      <div className='w-[50px] h-[50px] rounded-full absolute top-5 right-5 bg-[#EA4492] flex justify-center items-center text-white font-bold'>
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
