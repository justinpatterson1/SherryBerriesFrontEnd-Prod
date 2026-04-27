'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PRODUCT_LINKS } from './productLinks';

/**
 * Product category dropdown with full keyboard support.
 * - Open: hover, focus, Enter, Space
 * - Navigate: ArrowDown / ArrowUp
 * - Close: Escape, blur outside container
 */
export default function NavDropdown({ pathname }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);
  const isProductsActive = pathname.startsWith('/product');

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handleKey = e => {
      if (e.key === 'Escape') {
        close();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, close]);

  const handleButtonKeyDown = e => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      // Focus first item after the dropdown renders
      setTimeout(() => itemRefs.current[0]?.focus(), 0);
    }
  };

  const handleItemKeyDown = (e, index) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % PRODUCT_LINKS.length;
      itemRefs.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + PRODUCT_LINKS.length) % PRODUCT_LINKS.length;
      itemRefs.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      itemRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      itemRefs.current[PRODUCT_LINKS.length - 1]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className='relative'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={e => {
        if (!containerRef.current?.contains(e.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        aria-expanded={open}
        aria-haspopup='menu'
        onClick={() => setOpen(o => !o)}
        onKeyDown={handleButtonKeyDown}
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
          aria-hidden='true'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role='menu'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute left-0 mt-2 w-48 bg-white shadow-xl rounded-lg z-20 border border-gray-100 list-none p-0'
          >
            {PRODUCT_LINKS.map((link, i) => (
              <li key={link.href} role='none'>
                <Link
                  ref={el => (itemRefs.current[i] = el)}
                  href={link.href}
                  role='menuitem'
                  tabIndex={open ? 0 : -1}
                  onKeyDown={e => handleItemKeyDown(e, i)}
                  onClick={close}
                  className={`block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-brand focus:bg-pink-50 focus:text-brand focus:outline-none transition-colors duration-200 ${i === 0 ? 'rounded-t-lg' : ''} ${i === PRODUCT_LINKS.length - 1 ? 'rounded-b-lg' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
