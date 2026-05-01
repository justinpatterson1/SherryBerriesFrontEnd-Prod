'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { CgAddR } from 'react-icons/cg';
import { RxCross2 } from 'react-icons/rx';
import AddNewBlogModule from '../dashboard/AddNewBlogModule';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import { getBlogListWithImage, updateBlog as apiUpdateBlog } from '@/lib/api/blogs';

function Blog() {
  const [page, setPage] = useState(1);
  const [blog, setBlog] = useState([]);
  const [expandedBlogId, setExpandedBlogId] = useState(null);
  const [formData, setFormData] = useState({}); // editable fields
  const { data: session, status } = useSession();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleblog = blog => {
    if (expandedBlogId === blog.id) {
      setExpandedBlogId(null);
    } else {
      setExpandedBlogId(blog.id);
      setFormData({
        // populate form fields on expand
        Title: blog.Title || '',
        description: blog.description || '',
        date: blog.date || ''
      });
    }
  };

  const fetchBlogs = async() => {
    try {
      const json = await getBlogListWithImage({ page, pageSize: 4 });
      if (json?.data?.length) {
        setBlog(json.data);
        setLoading(false);
      } else {
        setPage(prev => prev - 1);
      }
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateblog = async id => {
    try {
      await apiUpdateBlog(id, formData, session?.jwt);
      fetchBlogs();
    } catch {
      alert('Failed to update blog.');
    }
  };

  if (status === 'loading') return <Loader />;
  if (loading) return <Loader />;

  return (
    <div className='p-4'>
      <div className='relative'>
        <h1 className='text-center text-2xl mb-6'>Blogs</h1>

        <CgAddR
          className={
            openAddForm
              ? 'hidden'
              : 'absolute right-4 top-1 text-2xl hover:cursor-pointer'
          }
          onClick={() => setOpenAddForm(!openAddForm)}
        />

        <RxCross2
          className={
            !openAddForm
              ? 'hidden'
              : 'absolute right-4 top-1 text-2xl hover:cursor-pointer'
          }
          onClick={() => setOpenAddForm(!openAddForm)}
        />
      </div>

      {openAddForm && (
        <AddNewBlogModule
          openAddForm={openAddForm}
          setOpenAddForm={setOpenAddForm}
          fetchBlogs={fetchBlogs}
        />
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mx-4'>
        {blog.map(blog => (
          <div key={blog.id} className='bg-white rounded-lg shadow p-4'>
            <div
              className='flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition p-2 rounded'
              onClick={() => toggleblog(blog)}
            >
              
              <Image
                src={blog?.image?.formats?.thumbnail?.url || blog?.image?.url}
                width={blog?.image?.formats?.thumbnail?.width || 200}
                height={blog?.image?.formats?.thumbnail?.height || 200}
                alt={blog.Title}
                className='rounded-md object-cover'
              />
              <span className='text-xl font-semibold'>{blog?.Title}</span>
            </div>

            {expandedBlogId === blog.id && (
              <div className='mt-4 border-t pt-4'>
                <form className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-700 mb-1'>
                      Title
                    </label>
                    <input
                      name='Title'
                      value={formData.Title || ''}
                      onChange={handleInputChange}
                      placeholder='Title'
                      className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
                    />
                  </div>

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-700 mb-1'>
                      Date
                    </label>
                    <input
                      name='Date'
                      value={formData.date || ''}
                      onChange={handleInputChange}
                      placeholder='Date'
                      className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
                    />
                  </div>

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-700 mb-1'>
                      Description
                    </label>
                    <textarea
                      name='description'
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      placeholder='Description'
                      className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
                    ></textarea>
                  </div>
                </form>

                <div className='flex justify-end mt-4'>
                  <button
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
                    onClick={() => updateblog(blog?.documentId)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='mt-10'>
        <Pagination page={page} setPage={setPage} length={blog.length} />
      </div>
    </div>
  );
}

export default Blog;
