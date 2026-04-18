'use client';

import React, { useEffect, useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function page() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState();
  const [code, setCode] = useState();

  const success = () => toast('Password change was successfull');
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('code');
    setCode(token);
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/sign-up?populate=*`)
      .then(res => res.json())
      .then(json => {
        setData(json.data);
        setLoading(false);
      })
      .catch(() => {});
    // const data = await response.json();

    // const imageUrl = `http://localhost:1337${data.data.Image.url}`;
  }, []);

  const handleSubmit = async evt => {
    evt.preventDefault();

    if (!password && !newPassword && !confirmPassword) {
      setError('Fields must not be blank');
      return;
    }

    if (newPassword === confirmPassword) {
      try {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/auth/reset-password`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              code: code,
              password: newPassword,
              passwordConfirmation: newPassword
            })
          }
        );

        if (resp.ok) {
          setNewPassword('');
          setConfirmPassword('');
          setError('');
          success();
          router.push('/sign-in');
        } else {
        }
      } catch (error) {
      }

      // .then(res=>res.json())
      // .then(json=>{
      //   setData(json.data)
      //   setLoading(false)
      // })
      // const data = await response.json();

      // const imageUrl = `http://localhost:1337${data.data.Image.url}`;
    } else {
      setError('Password could not be confirmed');
    }
  };

  return (
    <div className='h-screen bg-[#fef2f2] flex items-center justify-center'>
      <div className='flex flex-col lg:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-11/12 max-w-4xl h-auto lg:h-3/4'>
        {/* Image Section */}
        <div
          className='lg:w-1/2 w-full h-64 lg:h-auto'
          style={{
            backgroundImage: `url('${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}${data?.Image?.url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        {/* Login Form Section */}
        <div className='lg:w-1/2 w-full p-8 flex flex-col justify-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>
            Change Password
          </h1>
          <p className='text-sm text-gray-600 mb-6'>Enter your new password</p>
          <form onSubmit={handleSubmit}>
            {/* Email Input */}

            <span className='text-red-500 font-bold'>{error}</span>
            {/* <div className="mb-4">
            <label
              htmlFor="email"
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
                placeholder="Old Password"
                value={password}
                onChange={(evt)=>{setPassword(evt.target.value)}}
              />
            </div>
          </div> */}
            {/* Password Input */}
            <div className='mb-6'>
              <label
                htmlFor='password'
                className='block text-sm text-gray-600 mb-1'
              ></label>
              <div className='relative'>
                <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <FiLock className='h-5 w-5 text-gray-400' />
                </span>
                <input
                  type='password'
                  id='password'
                  className='w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm'
                  placeholder='New Password'
                  value={newPassword}
                  onChange={evt => {
                    setNewPassword(evt.target.value);
                  }}
                />
              </div>
            </div>

            <div className='mb-6'>
              <label
                htmlFor='confirmPassword'
                className='block text-sm text-gray-600 mb-1'
              ></label>
              <div className='relative'>
                <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <FiLock className='h-5 w-5 text-gray-400' />
                </span>
                <input
                  type='password'
                  id='confirmPassword'
                  className='w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm'
                  placeholder='Confirm New Password'
                  value={confirmPassword}
                  onChange={evt => {
                    setConfirmPassword(evt.target.value);
                  }}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type='submit'
              className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium'
            >
              Change
            </button>
            {/* <p className="mt-4 text-sm text-center text-gray-500">
            <a href="#" className="hover:underline">
             <Link href="/forget-password"> Forgot Password? </Link>
            </a>
          </p> */}
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default page;
