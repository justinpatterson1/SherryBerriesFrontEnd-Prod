'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { signIn } from 'next-auth/react';
import Loader from '../../components/Loader';
import AppContext from '../../../../context/AppContext';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [identifier, setIdentifier] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const { setUser } = useContext(AppContext);

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
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Call NextAuth's signIn function
    const result = await signIn('credentials', {
      redirect: false, // Prevent auto-redirect for manual handling
      identifier,
      password,
      callbackUrl:
        process.env.NEXT_PUBLIC_SHERRYBERRIES_FRONTEND_URL ||
        'http://localhost:3000/'
    });

    if (result?.status === 429) {
      setError('Too many login attempts. Please try again in 1 minute.');
      return;
    }

    if (result?.ok) {
      setUser(result);
      router.push('/');
    } else if (result?.error) {
      setError(result.error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className='h-screen bg-[#fef2f2] flex items-center justify-center'>
      <div className='flex flex-col lg:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-11/12 max-w-4xl h-auto lg:h-3/4'>
        {/* Image Section */}
        <div
          className='lg:w-1/2 w-full h-64 lg:h-auto'
          style={{
            backgroundImage: `url('${data?.Image.url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        {/* Login Form Section */}
        <div className='lg:w-1/2 w-full p-8 flex flex-col justify-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>Login</h1>
          <p className='text-sm text-gray-600 mb-6'>
            Enter the information to Login
          </p>
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <span className='text-red-500 font-bold text-center'>{error}</span>
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
                  placeholder='Password'
                  value={password}
                  onChange={evt => {
                    setPassword(evt.target.value);
                  }}
                />
              </div>
            </div>
            {/* Login Button */}
            <button
              type='submit'
              className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium'
            >
              Login
            </button>
            <p className='mt-4 text-sm text-center text-gray-500 flex flex-col'>
              <a href='#' className='hover:underline'>
                <Link href='/forget-password'> Forgot Password? </Link>
              </a>
              <p>- OR -</p>
              <a href='#' className='hover:underline'>
                <Link href='/sign-up'> Sign Up </Link>
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
