'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function NewsletterForm() {
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
    <>
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
      <ToastContainer
        position='bottom-right'
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
        toastClassName='custom-toast'
      />
    </>
  );
}
