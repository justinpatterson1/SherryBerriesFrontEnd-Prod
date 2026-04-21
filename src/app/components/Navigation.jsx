'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import { signIn, signOut } from 'next-auth/react';
import AppContext from '../../../context/AppContext.jsx';
import { useSession } from 'next-auth/react';
import { FaBars, FaTimes, FaSearch, FaShoppingCart, FaUser, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useContext(AppContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const { data: session, status } = useSession();
  const { currentCart, refreshCart } = useCart();

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  useEffect(() => {
    const cartItemCount = currentCart?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
    setCartCount(cartItemCount);
  }, [currentCart]);

  // Refresh cart when window regains focus (e.g., user returns from cart page)
  useEffect(() => {
    const handleFocus = () => {
      if (session?.user?.documentId) {
        refreshCart();
      }
    };

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      if (session?.user?.documentId) {
        refreshCart();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [session, refreshCart]);


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <nav className='bg-white/95 backdrop-blur-md fixed w-full z-50 top-0 left-0 shadow-lg border-b border-gray-100'>
        <div className='container mx-auto flex justify-between items-center px-4 py-3'>
          {/* Logo */}
          <Link href='/' className='text-lg font-bold flex items-center group'>
            <motion.span 
              className='bg-gradient-to-r from-brand to-pink-500 text-white px-3 py-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sherry
            </motion.span>
            <span className='ml-2 text-gray-800 font-bold text-xl'>Berries</span>
          </Link>

          {/* Search Bar - Desktop */}
          {/* <div className='hidden md:flex flex-1 max-w-lg mx-8'>
            <form onSubmit={handleSearch} className='relative w-full'>
              <input
                type='text'
                placeholder='Search jewelry, waistbeads...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full px-4 py-2 pl-10 pr-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-300'
              />
              <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <button
                type='submit'
                className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand text-white px-3 py-1 rounded-full hover:bg-pink-600 transition-colors duration-300'
              >
                Search
              </button>
            </form>
          </div> */}

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center space-x-8'>
            <Link
              href='/'
              className={`px-3 py-2 rounded-md font-medium transition-all duration-300 ${
                pathname === '/' 
                  ? 'text-brand bg-pink-50' 
                  : 'text-gray-700 hover:text-brand hover:bg-pink-50'
              }`}
            >
              Home
            </Link>
            <Link
              href='/about'
              className={`px-3 py-2 rounded-md font-medium transition-all duration-300 ${
                pathname === '/about' 
                  ? 'text-brand bg-pink-50' 
                  : 'text-gray-700 hover:text-brand hover:bg-pink-50'
              }`}
            >
              About
            </Link>
            <Link
              href='/blogs'
              className={`px-3 py-2 rounded-md font-medium transition-all duration-300 ${
                pathname === '/blogs' 
                  ? 'text-brand bg-pink-50' 
                  : 'text-gray-700 hover:text-brand hover:bg-pink-50'
              }`}
            >
              Blogs
            </Link>

            <div
              className='relative'
              onMouseEnter={() => {
                clearTimeout(window.dropdownTimeout);
                setDropdownOpen(true);
              }}
              onMouseLeave={() => {
                window.dropdownTimeout = setTimeout(() => {
                  setDropdownOpen(false);
                }, 300);
              }}
            >
              <button
                className={`px-3 py-2 rounded-md font-medium transition-all duration-300 flex items-center gap-1 ${
                  pathname.startsWith('/product') 
                    ? 'text-brand bg-pink-50' 
                    : 'text-gray-700 hover:text-brand hover:bg-pink-50'
                }`}
              >
                Products
                <svg className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='absolute left-0 mt-2 w-48 bg-white shadow-xl rounded-lg z-20 border border-gray-100'
                    onMouseEnter={() => {
                      clearTimeout(window.dropdownTimeout);
                      setDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      window.dropdownTimeout = setTimeout(() => {
                        setDropdownOpen(false);
                      }, 300);
                    }}
                  >
                    <Link
                      href='/product/jewelry'
                      className='block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-brand transition-colors duration-200 first:rounded-t-lg'
                    >
                      💎 Jewelry
                    </Link>
                    <Link
                      href='/product/waistbeads'
                      className='block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-brand transition-colors duration-200'
                    >
                      📿 Waistbeads
                    </Link>
                    <Link
                      href='/product/clothing'
                      className='block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-brand transition-colors duration-200'
                    >
                      👗 Clothing
                    </Link>
                    <Link
                      href='/product/aftercare'
                      className='block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-brand transition-colors duration-200 last:rounded-b-lg'
                    >
                      ✨ Aftercare
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href='/contact'
              className={`px-3 py-2 rounded-md font-medium transition-all duration-300 ${
                pathname === '/contact' 
                  ? 'text-brand bg-pink-50' 
                  : 'text-gray-700 hover:text-brand hover:bg-pink-50'
              }`}
            >
              Contact
            </Link>
            {status === 'authenticated' &&
              session.user.role_type === 'customer' && (
              <Link
                href='/orders'
                className={`px-3 py-2 rounded-md font-medium transition-all duration-300 ${
                  pathname === '/orders' 
                    ? 'text-brand bg-pink-50' 
                    : 'text-gray-700 hover:text-brand hover:bg-pink-50'
                }`}
              >
                  Orders
              </Link>
            )}
          </div>

          {/* Action Buttons */}
          <div className='hidden md:flex items-center space-x-3'>
            {/* Search Toggle - Mobile */}
            {/* <button
              onClick={toggleSearch}
              className='md:hidden p-2 text-gray-600 hover:text-brand transition-colors duration-300'
            >
              <FaSearch className='w-5 h-5' />
            </button> */}

            {/* Wishlist */}
            <Link href='/wishlist' className='relative p-2 text-gray-600 hover:text-brand transition-colors duration-300'>
              <FaHeart className='w-5 h-5' />
            </Link>

            {/* Cart */}
            {status === 'authenticated' && session.user.role_type === 'customer' && (
              <Link href='/cart' className='relative p-2 text-gray-600 hover:text-brand transition-colors duration-300'>
                <FaShoppingCart className='w-5 h-5' />
                {cartCount > 0 && (
                  <span className='absolute -top-1 -right-1 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Account */}
            <div className='relative'>
              {status === 'authenticated' ? (
                <div className='flex items-center space-x-2'>
                  {session.user.role_type === 'admin' && (
                    <Link href='/dashboard'>
                      <motion.button
                        className='bg-gradient-to-r from-brand to-pink-500 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaUser className='w-4 h-4' />
                        Dashboard
                      </motion.button>
                    </Link>
                  )}
                  <motion.button
                    onClick={() => signOut()}
                    className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium transition-all duration-300'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <Link href='/sign-up'>
                    <motion.button
                      className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium transition-all duration-300'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={() => signIn()}
                    className='bg-gradient-to-r from-brand to-pink-500 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className='md:hidden p-2 text-gray-600 hover:text-brand transition-colors duration-300'
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes className='w-6 h-6' /> : <FaBars className='w-6 h-6' />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='md:hidden bg-white border-t border-gray-200'
            >
              <form onSubmit={handleSearch} className='p-4'>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Search jewelry, waistbeads...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full px-4 py-3 pl-10 pr-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent'
                    autoFocus
                  />
                  <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  <button
                    type='submit'
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand text-white px-3 py-1 rounded-full hover:bg-pink-600 transition-colors duration-300'
                  >
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className='md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-40'
            >
              <div className='p-4 space-y-4'>
                {/* Mobile Action Buttons */}
                <div className='flex items-center justify-between py-2 border-b border-gray-100'>
                  <div className='flex items-center space-x-4'>
                    <Link href='/wishlist' className='p-2 text-gray-600 hover:text-brand transition-colors duration-300'>
                      <FaHeart className='w-5 h-5' />
                    </Link>
                    {status === 'authenticated' && session.user.role_type === 'customer' && (
                      <Link href='/cart' className='relative p-2 text-gray-600 hover:text-brand transition-colors duration-300'>
                        <FaShoppingCart className='w-5 h-5' />
                        {cartCount > 0 && (
                          <span className='absolute -top-1 -right-1 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={toggleSearch}
                    className='p-2 text-gray-600 hover:text-brand transition-colors duration-300'
                  >
                    <FaSearch className='w-5 h-5' />
                  </button>
                </div>

                {/* Navigation Links */}
                <Link
                  href='/'
                  className={`block py-3 px-2 rounded-md font-medium transition-colors duration-300 ${
                    pathname === '/' ? 'text-brand bg-pink-50' : 'text-gray-700 hover:text-brand hover:bg-pink-50'
                  }`}
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>
                <Link
                  href='/about'
                  className={`block py-3 px-2 rounded-md font-medium transition-colors duration-300 ${
                    pathname === '/about' ? 'text-brand bg-pink-50' : 'text-gray-700 hover:text-brand hover:bg-pink-50'
                  }`}
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
                <Link
                  href='/blogs'
                  className={`block py-3 px-2 rounded-md font-medium transition-colors duration-300 ${
                    pathname === '/blogs' ? 'text-brand bg-pink-50' : 'text-gray-700 hover:text-brand hover:bg-pink-50'
                  }`}
                  onClick={toggleMobileMenu}
                >
                  Blogs
                </Link>

                {/* Products Dropdown */}
                <div className='space-y-2'>
                  <span className='block text-gray-700 font-medium px-2'>Products</span>
                  <Link
                    href='/product/jewelry'
                    className='block py-2 px-4 text-gray-700 hover:text-brand hover:bg-pink-50 rounded-md transition-colors duration-300'
                    onClick={toggleMobileMenu}
                  >
                    💎 Jewelry
                  </Link>
                  <Link
                    href='/product/waistbeads'
                    className='block py-2 px-4 text-gray-700 hover:text-brand hover:bg-pink-50 rounded-md transition-colors duration-300'
                    onClick={toggleMobileMenu}
                  >
                    📿 Waistbeads
                  </Link>
                  <Link
                    href='/product/clothing'
                    className='block py-2 px-4 text-gray-700 hover:text-brand hover:bg-pink-50 rounded-md transition-colors duration-300'
                    onClick={toggleMobileMenu}
                  >
                    👗 Clothing
                  </Link>
                  <Link
                    href='/product/aftercare'
                    className='block py-2 px-4 text-gray-700 hover:text-brand hover:bg-pink-50 rounded-md transition-colors duration-300'
                    onClick={toggleMobileMenu}
                  >
                    ✨ Aftercare
                  </Link>
                </div>

                <Link
                  href='/contact'
                  className={`block py-3 px-2 rounded-md font-medium transition-colors duration-300 ${
                    pathname === '/contact' ? 'text-brand bg-pink-50' : 'text-gray-700 hover:text-brand hover:bg-pink-50'
                  }`}
                  onClick={toggleMobileMenu}
                >
                  Contact
                </Link>

                {status === 'authenticated' && session.user.role_type === 'customer' && (
                  <Link
                    href='/orders'
                    className={`block py-3 px-2 rounded-md font-medium transition-colors duration-300 ${
                      pathname === '/orders' ? 'text-brand bg-pink-50' : 'text-gray-700 hover:text-brand hover:bg-pink-50'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    Orders
                  </Link>
                )}

                {/* Mobile Auth Buttons */}
                <div className='pt-4 border-t border-gray-100 space-y-3'>
                  {status === 'authenticated' ? (
                    <div className='space-y-2'>
                      {session.user.role_type === 'admin' && (
                        <Link
                          href='/dashboard'
                          className='block w-full bg-gradient-to-r from-brand to-pink-500 text-white py-3 px-4 rounded-full text-center font-medium'
                          onClick={toggleMobileMenu}
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        className='block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-full font-medium'
                        onClick={() => {
                          toggleMobileMenu();
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
                        onClick={toggleMobileMenu}
                      >
                        Sign Up
                      </Link>
                      <button
                        className='block w-full bg-gradient-to-r from-brand to-pink-500 text-white py-3 px-4 rounded-full font-medium'
                        onClick={() => {
                          toggleMobileMenu();
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
      </nav>

      {/* Spacer for navbar height */}
      <div className='h-16'></div>
    </>
  );
}
