'use client';

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
//import EmblaCarousel from '../../components/carousel/EmblaCarousel.jsx'
function Reviews({ reviews }) {
  const settings = {
    className: 'mx-auto',
    centerMode: false,
    infinite: true,
    centerPadding: '80px',
    slidesToShow: 3,
    speed: 500,
    swipe: true,
    draggable: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: '40px'
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: '20px',
          dots: true
        }
      }
    ]
  };

  //   const OPTIONS = { align: 'start' }
  // const SLIDE_COUNT = 6
  // const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

  return (
    <div className='h-[60vh] flex items-center justify-center my-10 px-4 py-10 mb-20'>
      <div className=' container'>
        <h1 className='text-center text-[3rem]'>{reviews?.Title}</h1>
        <div className='mt-10'>
          <Slider {...settings}>
            {reviews?.reviews?.map((review, index) => (
              <div
                key={index}
                className='bg-slate-200 px-10 py-10 w-full md:max-w-sm max-w-xs mx-auto'
              >
                <Image
                  src={review?.Image?.formats?.thumbnail?.url}
                  width={review?.Image?.formats?.thumbnail?.width}
                  height={review?.Image?.formats?.thumbnail?.height}
                  alt={review?.name || 'image'}
                  className='m-auto p-2'
                />
                <h2 className='text-center'>{review?.Name}</h2>
                <p className='text-center'>{review?.Comment}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>

  //<EmblaCarousel slides={SLIDES} options={OPTIONS}/>
  );
}

export default Reviews;
