'use client';

import { React, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaEye, FaStar } from 'react-icons/fa';

function FeaturedProducts({ featured }) {
  const [visibleCount, setVisibleCount] = useState(8);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const loadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const toggleWishlist = (productId) => {
    setWishlistItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const addToCart = (product) => {
    // This would typically integrate with your cart context
    console.log('Adding to cart:', product);
    // You can add toast notification here
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className='bg-gradient-to-br from-[#fef2f2] to-[#fce7f3] py-16 px-4'>
      <div className='container mx-auto'>
        <motion.div 
          className='text-center mb-12'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
            Featured Products
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Discover our handpicked collection of stunning jewelry pieces, each crafted with love and attention to detail.
          </p>
        </motion.div>

        <motion.div 
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featured?.jewelries?.slice(0, visibleCount).map(feature => (
            <motion.div
              key={feature?.id}
              variants={itemVariants}
              className='group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden'
              onMouseEnter={() => setHoveredProduct(feature?.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link href={`product/jewelry/${feature?.documentId}`}>
                <div className='relative overflow-hidden'>
                  <Image
                    src={feature?.image?.formats?.small?.url}
                    width={feature?.image?.formats?.small?.width}
                    height={feature?.image?.formats?.small?.height}
                    alt={feature?.name || 'Featured Image'}
                    className='w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                  
                  {/* Overlay with quick actions */}
                  <AnimatePresence>
                    {hoveredProduct === feature?.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='absolute inset-0 bg-black/40 flex items-center justify-center space-x-3'
                      >
                        {/* <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className='bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg'
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(feature);
                          }}
                        >
                          <FaShoppingCart className='w-5 h-5' />
                        </motion.button> */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className='bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg'
                        >
                          <FaEye className='w-5 h-5' />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Discount Badge */}
                  {feature?.discount < 0 && (
                    <div className='absolute top-3 left-3 bg-gradient-to-r from-[#EA4492] to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg'>
                      {Math.abs(feature?.discount)}% OFF
                    </div>
                  )}

                  {/* Wishlist Button
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(feature?.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 ${
                      wishlistItems.has(feature?.id)
                        ? 'bg-[#EA4492] text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-[#EA4492] hover:text-white'
                    }`}
                  >
                    <FaHeart className='w-4 h-4' />
                  </button> */}
                </div>
              </Link>

              <div className='p-4'>
                <div className='flex items-center mb-2'>
                  <div className='flex text-yellow-400'>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className='w-4 h-4' />
                    ))}
                  </div>
                  <span className='text-sm text-gray-500 ml-2'>(4.8)</span>
                </div>
                
                <h3 className='font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-[#EA4492] transition-colors duration-300'>
                  {feature?.name}
                </h3>
                
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-xl font-bold text-[#EA4492]'>
                      ${feature?.price}
                    </span>
                    {feature?.discount < 0 && (
                      <span className='text-sm text-gray-500 line-through'>
                        ${(feature?.price * (1 + feature?.discount / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className='flex justify-center py-12'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={loadMore}
            className='bg-gradient-to-r from-[#EA4492] to-pink-500 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Load More Products</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default FeaturedProducts;
