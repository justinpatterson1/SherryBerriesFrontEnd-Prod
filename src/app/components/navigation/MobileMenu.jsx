'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import CartBadge from './CartBadge';
import { PRODUCT_LINKS } from './productLinks';

const PRIMARY_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blogs', label: 'Blogs' }
];

function mobileLinkClass(active) {
  return `block py-3 px-2 rounded-md font-medium transition-colors duration-300 ${
    active ? 'text-brand bg-pink-50' : 'text-gray-700 hover:text-brand hover:bg-pink-50'
  }`;
}

export default function MobileMenu({ open, pathname, onClose }) {
  const { data: session, status } = useSession();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className='md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-40'
        >
          <div className='p-4 space-y-4'>
            <div className='flex items-center justify-between py-2 border-b border-gray-100'>
              <div className='flex items-center space-x-4'>
                <Link href='/wishlist' className='p-2 text-gray-600 hover:text-brand transition-colors duration-300'>
                  <FaHeart className='w-5 h-5' />
                </Link>
                <CartBadge />
              </div>
            </div>

            {PRIMARY_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={mobileLinkClass(pathname === href)}
                onClick={onClose}
              >
                {label}
              </Link>
            ))}

            <div className='space-y-2'>
              <span className='block text-gray-700 font-medium px-2'>Products</span>
              {PRODUCT_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className='block py-2 px-4 text-gray-700 hover:text-brand hover:bg-pink-50 rounded-md transition-colors duration-300'
                  onClick={onClose}
                >
                  {label}
                </Link>
              ))}
            </div>

            <Link
              href='/contact'
              className={mobileLinkClass(pathname === '/contact')}
              onClick={onClose}
            >
              Contact
            </Link>

            {status === 'authenticated' && session.user.role_type === 'customer' && (
              <Link
                href='/orders'
                className={mobileLinkClass(pathname === '/orders')}
                onClick={onClose}
              >
                Orders
              </Link>
            )}

            <div className='pt-4 border-t border-gray-100 space-y-3'>
              {status === 'authenticated' ? (
                <div className='space-y-2'>
                  {session.user.role_type === 'admin' && (
                    <Link
                      href='/dashboard'
                      className='block w-full bg-gradient-to-r from-brand to-pink-500 text-white py-3 px-4 rounded-full text-center font-medium'
                      onClick={onClose}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    className='block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-full font-medium'
                    onClick={() => {
                      onClose();
                      signOut();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className='space-y-2'>
                  <Link
                    href='/sign-up'
                    className='block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-full text-center font-medium'
                    onClick={onClose}
                  >
                    Sign Up
                  </Link>
                  <button
                    className='block w-full bg-gradient-to-r from-brand to-pink-500 text-white py-3 px-4 rounded-full font-medium'
                    onClick={() => {
                      onClose();
                      signIn();
                    }}
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
