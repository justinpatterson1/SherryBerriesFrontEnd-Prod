'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { CgAddR } from 'react-icons/cg';
import { RxCross2 } from 'react-icons/rx';
import AddJewelryModule from './AddJewelryModule';
import Loader from '../Loader';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';

function AddNewBlogModule({ openAddForm, setOpenAddForm, fetchBlogs }) {
  const [formData, setFormData] = useState({
    Title: '',
    description: '',
    date: ''
  });

  const { data: session } = useSession();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');

  const notify = () => toast('Blog was successfully added!');

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setImageError('');

    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }

    if (imageFile) {
      const formImage = new FormData();
      formImage.append('files', imageFile);

      try {
        const imageUpload = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/upload`,
          {
            method: 'POST',
            headers: {
              authorization: `Bearer ${session?.jwt}`
            },
            body: formImage
          }
        );

        if (imageUpload.ok) {
          const resp = await imageUpload.json();
          const payload = {
            Title: formData.Title,
            description: formData.description,
            date: moment().format('yyyy-MM-DD'),
            image: resp[0].id || ''
          };

          console.log(payload);
          try {
            const resp = await fetch(
              `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/blogs`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  authorization: `Bearer ${session?.jwt}`
                },
                body: JSON.stringify({ data: payload })
              }
            );

            if (resp.ok) {
              setFormData({
                Title: '',
                description: ''
              });
              setImageFile(null);
              setImagePreview(null);
              fetchBlogs();
              notify();
            }
          } catch (error) {
            console.log('Unable to create Waistbead: ' + error);
          }
        } else {
          alert('Image uploaded unsuccessfully');
          setImageError('Select an image less than 5MB');
        }
      } catch (error) {
        console.log('Error: ' + error);
      }
    }

    console.log('Submitted FormData:');
    for (const [key, value] of submissionData.entries()) {
      console.log(`${key}:`, value);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-4'>
      <div className='w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl sm:text-2xl font-semibold text-gray-800'>
            Add Waistbead
          </h2>
          <RxCross2
            className='text-2xl text-gray-600 hover:cursor-pointer hover:text-red-500'
            onClick={() => setOpenAddForm(false)}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
          <div className='flex flex-col'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              Title
            </label>
            <input
              name='Title'
              value={formData.Title}
              onChange={handleInputChange}
              placeholder='Title'
              className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>

          <div className='flex flex-col'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              placeholder='Description'
              className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            ></textarea>
          </div>

          <div className='flex flex-col md:col-span-2'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              Upload Image
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='border border-gray-300 p-2 rounded-md text-sm'
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt='Preview'
                className='mt-4 h-48 w-full object-cover rounded-md'
              />
            )}
            {imageError && (
              <span className='text-red-500 mt-2 text-sm'>{imageError}</span>
            )}
          </div>

          <div className='md:col-span-2 mt-6 flex justify-end'>
            <button
              type='submit'
              className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddNewBlogModule;
