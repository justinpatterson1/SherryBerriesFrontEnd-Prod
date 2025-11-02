import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Advert({ advert }) {
  return (
    <div className='h-[70vh] flex items-center justify-center my-10 px-4 py-10 mb-20'>
      <div className='container '>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-5 justify-center items-center h-full'>
          <div className='h-full flex flex-col justify-center items-center'>
            <Image
              src={advert?.image?.formats?.large?.url}
              width={advert?.image?.formats?.large?.width}
              height={advert?.image?.formats?.large?.height}
              alt='Image of Aftercare'
              className='max-w-full h-auto'
            />
          </div>
          <div className='h-full flex flex-col justify-center'>
            <h3 className='text-2xl md:text-3xl lg:text-4xl flex self-start'>
              {advert?.Title}
            </h3>
            <p className='text-lg md:text-xl leading-8 md:leading-10'>
              {advert?.description}
            </p>
            <Link href={'/product/aftercare'}>
              <div className='cursor-pointer bg-[#EA4492] mt-5 w-48 h-10 text-white text-center text-xl flex items-center justify-center'>
                Shop Now
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Advert;
