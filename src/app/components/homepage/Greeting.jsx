import React from 'react';
//import video from '../../../../assets/videos/promotionvideo.mp4'

function Greeting({ greeting }) {
  return (
    <div className='flex flex-col items-center justify-center px-4 py-16 butterfly-bg'>
      <div className='text-center mb-8'>
        <span className='inline-block text-sm font-semibold tracking-widest uppercase text-brand mb-3'>
          Welcome
        </span>
        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
          Welcome To Sherry Berries
        </h2>
        <div className='w-20 h-1 bg-gradient-to-r from-brand to-pink-500 rounded-full mx-auto'></div>
      </div>
      <video
        controls
        className='rounded-lg w-full max-w-[1020px] h-auto'
        src={`${process.env.NEXT_PUBLIC_SHERRYBERRIES_FRONTEND_URL}/videos/promotionvideo.mp4`}
        width='640'
        height='360'
      />
    </div>
  );
}

export default Greeting;
