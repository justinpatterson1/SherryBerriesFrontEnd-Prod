'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'authenticated') {
    return (
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
    );
  }

  return (
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
  );
}
