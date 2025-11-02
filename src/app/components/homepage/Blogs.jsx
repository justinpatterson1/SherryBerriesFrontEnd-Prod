'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Blogs({ blog }) {
  const [visibleCount, setVisibleCount] = useState(6);

  const loadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className='px-4 mt-4'>
      <div className='text-center'>
        <h1 className='text-[3rem]'>{blog.Title}</h1>
        <p className='text-[1.5rem] font-thin'>{blog.description}</p>
      </div>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {blog.blogs.slice(0, visibleCount).map(blogItem => (
            <div key={blogItem.id} className='my-8'>
              <div>
                {blogItem.image?.formats?.small && (
                  <Image
                    src={blogItem?.image?.formats?.small?.url}
                    width={blogItem?.image?.formats?.small?.width}
                    height={blogItem?.image?.formats?.small?.height}
                    alt={blogItem?.Title || 'Blog Image'}
                    className='rounded-md'
                  />
                )}
                <p className='my-2 font-semibold text-slate-500'>
                  {blogItem?.date}
                </p>
                <h3 className='font-extrabold text-xl'>{blogItem?.Title}</h3>
                <p>{truncateText(blogItem?.description, 100)}</p>

                <Link href={`/blogs/${blogItem?.documentId}`}>
                  <p className='text-[#EA4492] cursor-pointer'>Read More</p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-center py-10'>
          <div
            className='h-[50px] w-[200px] flex justify-center items-center text-white bg-[#ffaaaa] cursor-pointer'
            onClick={loadMore}
          >
            Load More
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blogs;
