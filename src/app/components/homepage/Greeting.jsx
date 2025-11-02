import React from 'react';
//import video from '../../../../assets/videos/promotionvideo.mp4'

function Greeting({ greeting }) {
  return (
    <div className='h-[70vh] flex flex-col items-center justify-center my-10 px-4 py-10 mb-20'>
      <h1 className='text-2xl sm:text-3xl md:text-4xl py-4 text-center'>
        {greeting?.Title}
      </h1>
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
