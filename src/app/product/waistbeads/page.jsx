'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Loader from '../../components/Loader';
import Hero from '../../components/homepage/Hero';
import Image from 'next/image';
import Link from 'next/link';
import Pagination from '../../components/Pagination';
import { useSession } from 'next-auth/react';

export default function Page() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const [hero, setHero] = useState('');

  const { data: session, status } = useSession();

  /**
   * 🚀 Optimize API Calls
   * - Use useMemo to avoid re-fetching on every render.
   * - Cache results if data hasn't changed.
   */

  async function fetchData() {
    try {
      const waistbeadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/waistbeads?pagination[page]=${page}&pagination[pageSize]=12&populate=*`
      );
      const heroImgResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/waistbead-product?populate[0]=Hero`
      );

      const heroData = await heroImgResponse.json();
      const waistbeadData = await waistbeadResponse.json();


      setHero(heroData?.data.Hero[0].url);

      if (waistbeadData?.data.length !== 0) {
        setProduct(waistbeadData?.data);
      } else {
        setProduct([]);
      }

      //setLoading(false)
    } catch (error) {
    }
  }

  // const fetchProducts = async() => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/waistbead-product?populate[0]=Hero&populate[1]=waistbeads.image`,
  //       { cache: "no-store" } // Ensures fresh data
  //     );
  //     const json = await res.json();

  //     setProduct(json.data || null);
  //     setHero(json.data?.Hero?.[0]?.url || "");
  //   } catch (error) {
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // ✅ Fetch Data Only When Needed
  useEffect(() => {
    fetchData();
  }, [page]);

  // ✅ Optimize Conditional Rendering
  if (loading && !product) return <Loader />;

  return (
    <div className='bg-brand-light'>
      <Hero img={hero} />

      <div className='container mx-auto py-10 px-4 sm:px-6 lg:px-8'>
        {product?.length > 0 ? (
          <>
            {/* Grid for Waistbeads Products */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {product.map(item => (
                <Link
                  href={`/product/waistbeads/${item?.documentId}`}
                  key={item?.id}
                >
                  <div className='text-center bg-white hover:text-brand relative shadow-md rounded-md overflow-hidden'>
                    <Image
                      src={item?.image?.formats?.small?.url || item?.image?.url}
                      width={item?.image?.formats?.small?.width || 500}
                      height={item?.image?.formats?.small?.height || 500}
                      alt={item?.name || 'Waistbeads Image'}
                      className='w-full object-cover'
                      //onLoad={handleImageLoad}
                    />
                    <div className='py-5 px-4'>
                      <h3 className='truncate text-base py-2 font-bold text-lg'>
                        {item?.name}
                      </h3>
                      <p className='text-lg font-medium'>${item?.price}</p>
                    </div>
                    {item?.discount > 0 && (
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
            No waistbeads items available at the moment.
          </p>
        )}
        <div className='mt-10'>
          <Pagination page={page} setPage={setPage} length={product.length} />
        </div>
      </div>
    </div>
  );
}
