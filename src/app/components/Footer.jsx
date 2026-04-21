'use client';

import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaHeart,
  FaArrowRight
} from 'react-icons/fa6';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import FadeInSection from './FadeInSection';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const notify = () =>
    toast('🎉 Email was successfully added!', {
      position: 'bottom-right',
      className: 'toast-success'
    });
  const failure = () =>
    toast('❌ Unable to add Email to subscription list', {
      position: 'bottom-right',
      className: 'toast-error'
    });
  const isExisting = () =>
    toast('ℹ️ Email already exists in our list', {
      position: 'bottom-right',
      className: 'toast-info'
    });

  const handleSubmit = async evt => {
    evt.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.status === 429) {
        toast.error('Too many requests. Please try again in 1 minute.');
        return;
      }

      const data = await response.json();

      if (data.status === 201) {
        notify();
        setEmail('');
      } else if (data.status === 200) {
        isExisting();
        setEmail('');
      } else if (data.status === 500) {
        failure();
        setEmail('');
      }
    } catch (error) {
      failure();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className='bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 bg-gradient-to-r from-brand/5 to-pink-600/5'></div>
      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-pink-600'></div>
      
      <div className='relative z-10'>
        {/* Main Footer Content */}
        <div className='container mx-auto py-16 px-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
            
            {/* Brand Section */}
            <FadeInSection>
              <div className='space-y-6'>
                <Link href='/' className='inline-flex items-center group'>
                  <span className='bg-brand text-white px-4 py-2 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105'>
                    Sherry
                  </span>
                  <span className='ml-3 text-2xl font-bold text-white'>Berries</span>
                </Link>
                <p className='text-gray-300 leading-relaxed text-lg font-light'>
                  We Do It Big Here At SherryBerries! Creating beautiful, unique pieces that celebrate your individual style.
                </p>
                <div className='flex space-x-4'>
                  {/* <Link
                    href='https://www.facebook.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand transition-all duration-300 transform hover:scale-110'
                  >
                    <FaFacebookF size={18} />
                  </Link> */}
                  <Link
                    href='https://www.instagram.com/sherryberries_?igsh=MTRzOWF2aTQ4Y3A5OQ%3D%3D&utm_source=qr'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand transition-all duration-300 transform hover:scale-110'
                  >
                    <FaInstagram size={18} />
                  </Link>
                  <Link
                    href='https://www.tiktok.com/@sherrybvanessa?_t=ZM-900BUOlr0Jf&_r=1'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand transition-all duration-300 transform hover:scale-110'
                  >
                    <FaTiktok size={18} />
                  </Link>
                  {/* <Link
                    href='https://www.twitter.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand transition-all duration-300 transform hover:scale-110'
                  >
                    <FaXTwitter size={18} />
                  </Link> */}
                </div>
              </div>
            </FadeInSection>

            {/* Quick Links */}
            <FadeInSection>
              <div className='space-y-6'>
                <h3 className='text-xl font-bold text-white mb-6'>Quick Links</h3>
                <nav className='space-y-4'>
                  <Link href='/' className='flex items-center text-gray-300 hover:text-brand transition-colors duration-300 group'>
                    <FaArrowRight size={12} className='mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    Home
                  </Link>
                  <Link href='/about' className='flex items-center text-gray-300 hover:text-brand transition-colors duration-300 group'>
                    <FaArrowRight size={12} className='mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    About Us
                  </Link>
                  <Link href='/blogs' className='flex items-center text-gray-300 hover:text-brand transition-colors duration-300 group'>
                    <FaArrowRight size={12} className='mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    Blog
                  </Link>
                  <Link href='/contact' className='flex items-center text-gray-300 hover:text-brand transition-colors duration-300 group'>
                    <FaArrowRight size={12} className='mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    Contact
                  </Link>
                </nav>
              </div>
            </FadeInSection>

            {/* Products */}
            <FadeInSection>
              <div className='space-y-6'>
                <h3 className='text-xl font-bold text-white mb-6'>Products</h3>
                <nav className='space-y-4'>
                  <Link href='/product/jewelry' className='flex items-center text-gray-300 hover:text-brand transition-colors duration-300 group'>
                    <FaArrowRight size={12} className='mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    Jewelry
                  </Link>
                  <Link href='/product/waistbeads' className='flex items-center text-gray-300 hover:text-brand transition-colors duration-300 group'>
                    <FaArrowRight size={12} className='mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    Waistbeads
                  </Link>
                  <Link href='/product/clothing' className='flex items-center text-gray-300 hover:text-brand transition-colors duration-300 group'>
                    <FaArrowRight size={12} className='mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    Clothing
                  </Link>
                  <Link href='/product/aftercare' className='flex items-center text-gray-300 hover:text-brand transition-colors duration-300 group'>
                    <FaArrowRight size={12} className='mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    Aftercare
                  </Link>
                </nav>
              </div>
            </FadeInSection>

            {/* Contact Info & Newsletter */}
            <FadeInSection>
              <div className='space-y-6'>
                <h3 className='text-xl font-bold text-white mb-6'>Stay Connected</h3>
                
                {/* Contact Info */}
                <div className='space-y-4 mb-6'>
                  <div className='flex items-center text-gray-300'>
                    <FaEnvelope className='mr-3 text-brand' />
                    <span>me@sherry-berries.com</span>
                  </div>
                  <div className='flex items-center text-gray-300'>
                    <FaPhone className='mr-3 text-brand' />
                    <span>+1 (868) 470-2471</span>
                  </div>
                  <div className='flex items-center text-gray-300'>
                    <FaLocationDot className='mr-3 text-brand' />
                    <span>Trinidad and Tobago</span>
                  </div>
                  <div className='flex items-center text-gray-300'>
                    <FaClock className='mr-3 text-brand' />
                    <span>Mon-Fri: 10AM-8PM</span>
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className='bg-white/5 rounded-xl p-6 border border-white/10'>
                  <h4 className='text-lg font-semibold text-white mb-3'>Newsletter</h4>
                  <p className='text-gray-300 text-sm mb-4'>
                    Get exclusive offers and updates delivered to your inbox.
                  </p>
                  <form onSubmit={handleSubmit} className='space-y-3'>
                    <input
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={evt => setEmail(evt.target.value)}
                      className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-300'
                      required
                    />
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='w-full bg-brand hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center'
                    >
                      {isSubmitting ? (
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-white/10 py-6'>
          <div className='container mx-auto px-4'>
            <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
              <div className='flex items-center text-gray-400 text-sm'>
                <span>&copy; {new Date().getFullYear()} SherryBerries™. All Rights Reserved.</span>
              </div>
              <div className='flex items-center space-x-6 text-sm'>
                <Link href='/privacy' className='text-gray-400 hover:text-brand transition-colors duration-300'>
                  Privacy Policy
                </Link>
                <Link href='/terms' className='text-gray-400 hover:text-brand transition-colors duration-300'>
                  Terms of Service
                </Link>
                <Link href='/shipping' className='text-gray-400 hover:text-brand transition-colors duration-300'>
                  Shipping Info
                </Link>
              </div>
            </div>
            <div className='text-center mt-4'>
              <p className='text-gray-500 text-sm flex items-center justify-center'>
                Made with <FaHeart className='mx-1 text-brand' size={12} /> for our amazing customers
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="custom-toast"
      />
    </footer>
  );
}
