import React from 'react';

function Thankyou({ orderId, email }) {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-brand-light  px-4'>
      <div className='bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center'>
        <h1 className='text-3xl font-bold text-brand mb-4'>
          Thank You for Your Order!
        </h1>
        <p className='text-lg text-gray-700 mb-6'>
          Your order has been placed successfully.
        </p>
        <div className='bg-gray-100 rounded-md p-4 border border-dashed border-gray-300'>
          <span className='text-sm text-gray-500'>Order ID</span>
          <p className='text-xl font-semibold text-gray-800'>{orderId}</p>
        </div>
        <p className='text-sm text-gray-500 mt-6'>
          A confirmation email has been sent to {email}.
        </p>
        <a href='/' className='mt-6 inline-block text-blue-600 hover:underline'>
          Return to Home
        </a>
      </div>
    </div>
  );
}

export default Thankyou;
