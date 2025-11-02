'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaHeart } from 'react-icons/fa';

function Hero({ img }) {
  const style = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${img}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    height: '90vh',
    width: '100%'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section 
      style={style} 
      className="relative flex items-center justify-center"
      role="banner"
      aria-label="Hero section"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" aria-hidden="true"></div>
      
      <motion.div
        className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          variants={itemVariants}
        >
          Discover Your
          <span className="text-[#EA4492] block">Unique Style</span>
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Handcrafted jewelry, waistbeads, and accessories that celebrate your individuality. 
          Every piece tells a story of beauty and empowerment.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <Link href="/product/jewelry">
            <motion.button
              className="group bg-[#EA4492] hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Shop our jewelry collection"
            >
              <FaShoppingBag className="text-xl" aria-hidden="true" />
              Shop Now
              <span className="text-lg group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">→</span>
            </motion.button>
          </Link>
          
          <Link href="/about">
            <motion.button
              className="group bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Learn about our story"
            >
              <FaHeart className="text-xl" aria-hidden="true" />
              Our Story
            </motion.button>
          </Link>
        </motion.div>
        
        {/* Trust indicators */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-300"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#EA4492] rounded-full"></div>
            <span>Handcrafted Quality</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#EA4492] rounded-full"></div>
            <span>Fast Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#EA4492] rounded-full"></div>
            <span>30-Day Returns</span>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        role="button"
        tabIndex={0}
        aria-label="Scroll down to explore more content"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
