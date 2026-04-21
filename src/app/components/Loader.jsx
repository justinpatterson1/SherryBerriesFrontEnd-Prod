import React from 'react';

function Loader({ type = 'spinner', children }) {
  // If children are provided, show them instead of default loader
  if (children) {
    return <div className='flex items-center justify-center min-h-screen'>{children}</div>;
  }

  // Default spinner loader
  if (type === 'spinner') {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='loader'></div>
      </div>
    );
  }

  // Modern spinner with better UX
  if (type === 'modern') {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen space-y-4'>
        <div className='relative'>
          <div className='w-16 h-16 border-4 border-gray-200 border-t-brand rounded-full animate-spin'></div>
          <div className='absolute inset-0 w-16 h-16 border-4 border-transparent border-r-brand rounded-full animate-spin' style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className='text-gray-600 font-medium'>Loading...</p>
      </div>
    );
  }

  return null;
}

export default Loader;
