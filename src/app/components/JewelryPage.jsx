'use client';

import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import Hero from '../components/homepage/Hero';
import Image from 'next/image';
import Link from 'next/link';
import Pagination from '../components/Pagination';
import options from '../api/auth/[...nextauth]/options.js';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';

function page() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [jewelry, setJewelry] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [hero, setHero] = useState({});
  const { data: session, status } = useSession();

  useEffect(() => {
    setLoading(true);
    // fetch(`http://localhost:1337/api/blogs?pagination[page]=${page}&pagination[pageSize]=12&sort[date]=${order}&populate=*`)
    //   .then((res) => res.json())
    //   .then(json => {
    //     if(json.data.length !== 0){
    //     setBlog(json.data);
    //     setLoading(false);
    //     } else {
    //       setPage((prev) => prev - 1)
    //     }
    //     console.log(json.data);
    //   });

    async function fetchData() {
      try {
        const jewelryResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/jewelries?pagination[page]=${page}&pagination[pageSize]=12&populate=*`
        );
        const heroImgResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/jewelry-product?populate[0]=Hero.image`
        );

        const heroData = await heroImgResponse.json();
        const jewelryData = await jewelryResponse.json();

        setHero(heroData?.data);

        if (jewelryData?.data.length !== 0) {
          setJewelry(jewelryData?.data);
        } else {
          setJewelry([]);
        }

        //setLoading(false)
        console.log(jewelryData?.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [page]);

  useEffect(() => {
    console.log(imagesLoaded);
    if (jewelry) {
      setLoading(false);
    }
  }, [imagesLoaded, jewelry]);

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

  console.log(JSON.stringify(session));

  if (loading) return <Loader />;

  return (
    <div className='bg-[#ffefef]'>
      <Hero img={hero?.Hero?.image?.url} />

      <div className='container mx-auto py-10 px-4 sm:px-6 lg:px-8'>
        {jewelry.length > 0 ? (
          <>
            {/* Grid for Jewelry Products */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {jewelry.map(jewels => (
                <Link
                  href={`/product/jewelry/${jewels?.documentId}`}
                  key={jewels?.id}
                >
                  <div className='text-center bg-white hover:text-[#EA4492] relative shadow-md rounded-md overflow-hidden'>
                    <Image
                      src={
                        jewels?.image?.formats?.small?.url || jewels?.image?.url
                      }
                      width={jewels?.image?.formats?.small?.width}
                      height={jewels?.image?.formats?.small?.height}
                      alt={jewels?.name || 'Jewelry Image'}
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                      onLoad={handleImageLoad}
                    />
                    <div className='py-5 px-4'>
                      <h3 className='truncate text-base py-2 font-bold text-lg'>
                        {jewels?.name}
                      </h3>
                      <p className='text-lg font-medium'>${jewels?.price}</p>
                    </div>
                    {jewels.discount != 0 && (
                      <div className='w-[50px] h-[50px] rounded-full absolute top-5 right-5 bg-[#EA4492] flex justify-center items-center text-white font-bold'>
                        {jewels.discount}%
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
            No jewelry available at the moment.
          </p>
        )}{' '}
        <div className='mt-10'>
          <Pagination page={page} setPage={setPage} length={jewelry.length} />
        </div>
      </div>
    </div>
  );
}

export default page;
