'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import Breadcrumbs from '../components/Breadcrumbs';
import { FiSearch, FiCalendar, FiFilter, FiClock } from 'react-icons/fi';
import { getBlogList } from '@/lib/api/blogs';

export default function BlogsClient({ initialBlogs, initialPage, initialOrder }) {
  const [page, setPage] = useState(initialPage);
  const [order, setOrder] = useState(initialOrder);
  const [blog, setBlog] = useState(initialBlogs);
  const [filteredBlogs, setFilteredBlogs] = useState(initialBlogs);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories] = useState([]);

  const isInitialFetch = useRef(true);

  useEffect(() => {
    if (isInitialFetch.current) {
      isInitialFetch.current = false;
      return;
    }
    setLoading(true);
    getBlogList({ page, pageSize: 12, sortOrder: order })
      .then(json => {
        if (json.data.length !== 0) {
          setBlog(json.data);
          setFilteredBlogs(json.data);
          setLoading(false);
        } else {
          setPage(prev => prev - 1);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [page, order]);

  useEffect(() => {
    let filtered = blog;

    if (searchTerm) {
      filtered = filtered.filter(blogItem =>
        blogItem.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blogItem.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blogItem =>
        blogItem.category?.name === selectedCategory
      );
    }

    setFilteredBlogs(filtered);
  }, [blog, searchTerm, selectedCategory]);

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleSortChange = (e) => setOrder(e.target.value);

  if (loading) return <Loader type='modern' />;

  return (
    <>
      <div className='bg-gray-50 border-b'>
        <div className='container mx-auto px-4 py-3'>
          <Breadcrumbs />
        </div>
      </div>

      <div className='bg-gradient-to-r from-pink-50 to-purple-50 py-16'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>
            Our Blog
          </h1>
          <p className='text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto'>
            Discover the latest trends, tips, and insights from our fashion experts
          </p>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row gap-4 items-center justify-between mb-6'>
            <div className='relative w-full lg:w-96'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl' />
              <input
                type='text'
                placeholder='Search blogs...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-200'
              />
            </div>

            <div className='flex flex-col sm:flex-row gap-4 items-center'>
              <div className='relative'>
                <FiFilter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className='pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-200 bg-white'
                >
                  <option value='all'>All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='relative'>
                <FiCalendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <select
                  value={order}
                  onChange={handleSortChange}
                  className='pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-200 bg-white'
                >
                  <option value='DESC'>Newest First</option>
                  <option value='ASC'>Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between mb-6'>
            <p className='text-gray-600'>
              Showing {filteredBlogs.length} of {blog.length} blog posts
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='text-brand hover:text-pink-600 font-medium'
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className='text-center py-16'>
            <div className='text-gray-400 text-6xl mb-4'>📝</div>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>No blogs found</h3>
            <p className='text-gray-500'>
              {searchTerm ? 'Try adjusting your search terms' : 'No blog posts available at the moment'}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredBlogs.map(blogItem => (
              <article key={blogItem.id} className='group'>
                <div className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform group-hover:-translate-y-2'>
                  <div className='relative overflow-hidden'>
                    {blogItem.image?.formats?.small ? (
                      <Image
                        src={blogItem?.image?.formats?.small?.url}
                        width={blogItem?.image?.formats?.small?.width}
                        height={blogItem?.image?.formats?.small?.height}
                        alt={blogItem.Title || 'Blog Image'}
                        className='object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300'
                      />
                    ) : (
                      <div className='w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center'>
                        <span className='text-4xl text-gray-400'>📝</span>
                      </div>
                    )}
                    <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300'></div>
                  </div>

                  <div className='p-6'>
                    <div className='flex items-center text-sm text-gray-500 mb-3'>
                      <FiClock className='mr-2' />
                      <time>{formatDate(blogItem?.date)}</time>
                    </div>

                    <h3 className='font-bold text-lg md:text-xl mb-3 text-gray-900 group-hover:text-brand transition-colors duration-200 line-clamp-2'>
                      {blogItem?.Title}
                    </h3>

                    <p className='text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed'>
                      {truncateText(blogItem?.description, 120)}
                    </p>

                    <Link href={`/blogs/${blogItem?.documentId}`}>
                      <div className='inline-flex items-center text-brand hover:text-pink-600 font-medium transition-colors duration-200 group/link'>
                        <span>Read More</span>
                        <svg className='ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {filteredBlogs.length > 0 && (
        <div className='py-8'>
          <Pagination page={page} setPage={setPage} />
        </div>
      )}
    </>
  );
}
