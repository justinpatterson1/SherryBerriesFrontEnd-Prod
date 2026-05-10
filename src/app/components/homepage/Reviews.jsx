'use client';

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

function Reviews({ reviews }) {
  const settings = {
    className: 'mx-auto',
    centerMode: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 600,
    swipe: true,
    draggable: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5500,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, centerPadding: '40px' }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, centerPadding: '20px', dots: true }
      }
    ]
  };

  return (
    <section className='reviews-section py-12 px-4 bg-white'>
      <div className='container mx-auto max-w-6xl'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-8'
        >
          <span className='inline-block text-sm font-semibold tracking-widest uppercase text-brand mb-3'>
            Testimonials
          </span>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            {reviews?.Title || 'What Our Customers Say'}
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-brand to-pink-500 rounded-full mx-auto'></div>
        </motion.div>

        <div className='py-2'>
          <Slider {...settings}>
            {reviews?.reviews?.map((review, index) => (
              <div key={index} className='px-3 py-2 h-full'>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className='relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 px-[47px] py-7 border border-gray-100 hover:-translate-y-1 h-full flex flex-col overflow-hidden'
                >
                  <div
                    className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand to-pink-400'
                    aria-hidden='true'
                  ></div>

                  <FaQuoteLeft
                    className='absolute top-6 right-6 text-4xl text-brand/10'
                    aria-hidden='true'
                  />

                  <div className='flex items-center gap-4 mb-4 mt-1'>
                    <div className='relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-brand/15 flex-shrink-0 bg-gradient-to-br from-pink-100 to-rose-200'>
                      {review?.Image?.formats?.thumbnail?.url ? (
                        <Image
                          src={review?.Image?.formats?.thumbnail?.url}
                          width={review?.Image?.formats?.thumbnail?.width}
                          height={review?.Image?.formats?.thumbnail?.height}
                          alt={review?.Name || 'Customer'}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <span className='absolute inset-0 flex items-center justify-center text-white font-bold text-xl'>
                          {(review?.Name || '?').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-bold text-gray-900 truncate'>
                        {review?.Name}
                      </h3>
                      <div
                        className='flex text-yellow-400 mt-1'
                        aria-label='5 out of 5 stars'
                      >
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className='w-3.5 h-3.5' />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className='text-gray-600 leading-relaxed italic line-clamp-4 flex-1'>
                    &ldquo;{review?.Comment}&rdquo;
                  </p>
                </motion.article>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
