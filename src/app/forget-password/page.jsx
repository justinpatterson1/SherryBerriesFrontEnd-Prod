'use client';

import React, { useEffect, useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { BASE_URL } from '@/lib/api-client';
import { getSignUpHero, forgotPassword } from '@/lib/api/auth';

function page() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [identifier, setIdentifier] = useState();
  const [error, setError] = useState();

  const success = () => toast('Email was sent Successfully');
  const failure = () => toast('Email could not be sent');
  useEffect(() => {
    getSignUpHero()
      .then(json => {
        setData(json.data);
        setLoading(false);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async evt => {
    evt.preventDefault();

    if (identifier) {
      try {
        await forgotPassword(identifier);
        success();
        setIdentifier('');
        setError('');
      } catch (error) {
        failure();
      }
    } else {
      setError('Enter email addresss');
    }
  };

  return (
    <div className='h-screen bg-[#fef2f2] flex items-center justify-center'>
      <div className='flex flex-col lg:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-11/12 max-w-4xl h-auto lg:h-3/4'>
        {/* Image Section */}
        <div
          className='lg:w-1/2 w-full h-64 lg:h-auto'
          style={{
            backgroundImage: `url('${BASE_URL}${data?.Image?.url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        {/* Login Form Section */}
        <div className='lg:w-1/2 w-full p-8 flex flex-col justify-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>Verify</h1>
          <p className='text-sm text-gray-600 mb-6'>
            Enter email to reset password
          </p>
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className='mb-4'>
              <label
                htmlFor='email'
                className='block text-sm text-gray-600 mb-1'
              ></label>
              <div className='relative'>
                <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <FiMail className='h-5 w-5 text-gray-400' />
                </span>
                <input
                  type='email'
                  id='email'
                  className='w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm'
                  placeholder='Email Address'
                  value={identifier}
                  onChange={evt => {
                    setIdentifier(evt.target.value);
                  }}
                />
              </div>
            </div>
            {/* Password Input
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm text-gray-600 mb-1"
            >

            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiLock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="password"
                id="password"
                className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                placeholder="Password"
                value={password}
                onChange={(evt)=>{setPassword(evt.target.value)}}
              />
            </div>
          </div> */}
            {/* Login Button */}
            <button
              type='submit'
              className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium'
            >
              Verify
            </button>
            {/* <p className="mt-4 text-sm text-center text-gray-500">
            <a href="#" className="hover:underline">
             <Link href="/forget-password"> Forgot Password? </Link>
            </a>
          </p> */}
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default page;
