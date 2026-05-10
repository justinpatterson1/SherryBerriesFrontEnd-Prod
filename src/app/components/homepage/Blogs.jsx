'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getBlogList } from '@/lib/api/blogs';

const PAGE_SIZE = 6;

function Blogs({ blog }) {
  const [blogs, setBlogs] = useState(blog?.blogs ?? []);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const json = await getBlogList({
        page: currentPage + 1,
        pageSize: PAGE_SIZE
      });
      const more = json?.data ?? [];
      if (more.length > 0) {
        setBlogs(prev => [...prev, ...more]);
        setCurrentPage(p => p + 1);
      }
    } catch (err) {
    } finally {
      setLoadingMore(false);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className='px-4 py-16 butterfly-bg'>
      <div className='text-center mb-12'>
        <span className='inline-block text-sm font-semibold tracking-widest uppercase text-brand mb-3'>
          Journal
        </span>
        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
          {blog.Title}
        </h2>
        <div className='w-20 h-1 bg-gradient-to-r from-brand to-pink-500 rounded-full mx-auto mb-6'></div>
        <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto'>
          {blog.description}
        </p>
      </div>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {blogs.map(blogItem => (
            <div key={blogItem.id} className='my-8'>
              <div>
                {blogItem.image?.formats?.small && (
                  <Image
                    src={blogItem?.image?.formats?.small?.url}
                    width={blogItem?.image?.formats?.small?.width}
                    height={blogItem?.image?.formats?.small?.height}
                    alt={blogItem?.Title || 'Blog Image'}
                    className='rounded-md border-2 border-rose-200 hover:border-brand transition-colors duration-300'
                  />
                )}
                <p className='my-2 font-semibold text-slate-500'>
                  {blogItem?.date}
                </p>
                <h3 className='font-extrabold text-xl'>{blogItem?.Title}</h3>
                <p>{truncateText(blogItem?.description, 100)}</p>

                <Link href={`/blogs/${blogItem?.documentId}`}>
                  <p className='text-brand cursor-pointer'>Read More</p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          className='flex justify-center py-12'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={loadMore}
            disabled={loadingMore}
            className='bg-gradient-to-r from-brand to-pink-500 hover:from-pink-600 hover:to-pink-700 disabled:opacity-70 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{loadingMore ? 'Loading...' : 'Load More Posts'}</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Blogs;
