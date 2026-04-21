'use client';

export default function Error({ error, reset }) {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-brand-light px-4'>
      <div className='bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center'>
        <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center'>
          <svg className='w-8 h-8 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' />
          </svg>
        </div>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Something went wrong</h1>
        <p className='text-gray-600 mb-6'>
          We encountered an unexpected error. Please try again.
        </p>
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <button
            onClick={() => reset()}
            className='px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors'
          >
            Try Again
          </button>
          <a
            href='/'
            className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
