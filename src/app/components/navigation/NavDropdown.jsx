'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PRODUCT_LINKS } from './productLinks';

/**
 * Product category dropdown. Opens on hover/focus, closes on mouseleave/blur/Escape.
 * Uses a single state-driven approach with CSS for hover (no setTimeout race conditions).
 */
export default function NavDropdown({ pathname }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const isProductsActive = pathname.startsWith('/product');

  useEffect(() => {
    if (!open) return;
    const handleKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className='relative'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={e => {
        if (!containerRef.current?.contains(e.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        aria-expanded={open}
        aria-haspopup='menu'
        onClick={() => setOpen(o => !o)}
        className={`px-3 py-2 rounded-md font-medium transition-all duration-300 flex items-center gap-1 ${
          isProductsActive
            ? 'text-brand bg-pink-50'
            : 'text-gray-700 hover:text-brand hover:bg-pink-50'
        }`}
      >
        Products
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role='menu'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute left-0 mt-2 w-48 bg-white shadow-xl rounded-lg z-20 border border-gray-100'
          >
            {PRODUCT_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                role='menuitem'
                className={`block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-brand transition-colors duration-200 ${i === 0 ? 'first:rounded-t-lg' : ''} ${i === PRODUCT_LINKS.length - 1 ? 'last:rounded-b-lg' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
