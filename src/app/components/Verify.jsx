import React, { useState, useEffect } from 'react';

function Verify({ email }) {
  const [error, setError] = useState();
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (status) {
      const timeout = setTimeout(() => {
        setStatus(false);
      }, 3000);
    }
  }, [status]);
  const resendEmail = async() => {
    setStatus(true);
    const response = fetch(
      `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/auth/send-email-confirmation`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ email })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      setError('Email was unable to be sent');
      throw new Error('Failed to register user');
    }
  };
  return (
    <div className='h-screen w-full bg-[#fef2f2] flex flex-col items-center justify-center px-4'>
      <h1 className='text-2xl md:text-3xl lg:text-4xl text-[#EA4492] text-center font-semibold max-w-2xl mb-6'>
        Welcome to Sherry Berries!
        <br />
        Click the link that was sent to your email to verify your account.
      </h1>

      <button
        className='bg-[#EA4492] text-white px-6 py-2 rounded-full shadow-md hover:bg-[#d8377f] transition duration-300 ease-in-out'
        onClick={async() => {
          await resendEmail();
          alert('Resend link clicked');
        }}
      >
        {!status ? 'Resend Verification Link' : 'Sending....'}
      </button>
    </div>
  );
}

export default Verify;
