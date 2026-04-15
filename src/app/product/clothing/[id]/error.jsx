'use client';

import Link from 'next/link';

export default function Error({ reset }) {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center px-4'>
      <div className='bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center'>
        <h2 className='text-xl font-bold text-gray-800 mb-2'>Product Unavailable</h2>
        <p className='text-gray-600 mb-6'>
          This product could not be loaded. It may have been removed or is temporarily unavailable.
        </p>
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <button onClick={() => reset()} className='px-6 py-2 bg-[#EA4492] text-white rounded-lg hover:bg-[#c83778] transition-colors'>
            Try Again
          </button>
          <Link href='/product/clothing' className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
            Browse Clothing
          </Link>
        </div>
      </div>
    </div>
  );
}
