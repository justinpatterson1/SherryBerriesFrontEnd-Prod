'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaHeart } from 'react-icons/fa';
import NavLinks from './navigation/NavLinks';
import CartBadge from './navigation/CartBadge';
import AuthButtons from './navigation/AuthButtons';
import MobileMenu from './navigation/MobileMenu';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(o => !o), []);

  return (
    <>
      <nav className='bg-white/95 backdrop-blur-md fixed w-full z-50 top-0 left-0 shadow-lg border-b border-gray-100'>
        <div className='container mx-auto flex justify-between items-center px-4 py-3'>
          <Link href='/' className='text-lg font-bold flex items-center group' aria-label='Home'>
            <motion.span
              className='bg-gradient-to-r from-brand to-pink-500 text-white px-3 py-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sherry
            </motion.span>
            <span className='ml-2 text-gray-800 font-bold text-xl'>Berries</span>
          </Link>

          <NavLinks pathname={pathname} />

          <div className='hidden md:flex items-center space-x-3'>
            <Link href='/wishlist' className='relative p-2 text-gray-600 hover:text-brand transition-colors duration-300' aria-label='Wishlist'>
              <FaHeart className='w-5 h-5' />
            </Link>
            <CartBadge />
            <AuthButtons />
          </div>

          <button
            className='md:hidden p-2 text-gray-600 hover:text-brand transition-colors duration-300'
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FaTimes className='w-6 h-6' /> : <FaBars className='w-6 h-6' />}
          </button>
        </div>

        <MobileMenu open={isMobileMenuOpen} pathname={pathname} onClose={closeMobileMenu} />
      </nav>

      <div className='h-16'></div>
    </>
  );
}
