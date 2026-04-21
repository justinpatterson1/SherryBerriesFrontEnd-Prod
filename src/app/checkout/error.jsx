'use client';

export default function Error({ reset }) {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center px-4'>
      <div className='bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center'>
        <h2 className='text-xl font-bold text-gray-800 mb-2'>Checkout Error</h2>
        <p className='text-gray-600 mb-6'>
          Something went wrong during checkout. Your cart has been preserved — please try again.
        </p>
        <button onClick={() => reset()} className='px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors'>
          Try Again
        </button>
      </div>
    </div>
  );
}
