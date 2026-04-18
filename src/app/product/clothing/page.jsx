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
  const [product, setProduct] = useState([]);
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
    //   });

    try {
      async function fetchData() {
        try {
          const merchandiseResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/merchandises?pagination[page]=${page}&pagination[pageSize]=12&populate=*`
          );
          const heroImgResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/clothing-product?populate[0]=Hero`
          );

          const heroData = await heroImgResponse.json();
          const merchandiseData = await merchandiseResponse.json();


          setHero(heroData?.data.Hero[0].url);

          if (merchandiseData?.data.length !== 0) {
            setProduct(merchandiseData?.data || []);
          } else {
            setProduct([]);
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


  if (loading && !product) return <Loader />;

  return (
    <div className='bg-[#ffefef]'>
      <Hero img={hero} />

      <div className='container mx-auto py-10 px-4 sm:px-6 lg:px-8'>
        {product.length > 0 ? (
          <>
            {/* Grid for Clothing Products */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {product.map(item => (
                <Link
                  href={`/product/clothing/${item?.documentId}`}
                  key={item?.id}
                >
                  <div className='text-center bg-white hover:text-[#EA4492] relative shadow-md rounded-md overflow-hidden'>
                    <Image
                      src={
                        item?.image[0]?.formats?.small?.url ||
                        item?.image[0]?.url
                      }
                      width={item?.image[0]?.formats?.small?.width || 500}
                      height={item?.image[0]?.formats?.small?.height || 500}
                      alt={item?.name || 'Clothing Image'}
                      className='w-full object-cover'
                      onLoad={handleImageLoad}
                    />
                    <div className='py-5 px-4'>
                      <h3 className='truncate text-base py-2 font-bold text-lg'>
                        {item?.name}
                      </h3>
                      <p className='text-lg font-medium'>${item?.price}</p>
                    </div>
                    {item?.discount != 0 && (
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

export default page;
