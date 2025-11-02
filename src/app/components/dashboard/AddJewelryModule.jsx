'use client';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { RxCross2 } from 'react-icons/rx';

function AddJewelryModule({ openAddForm, setOpenAddForm, fetchJewelries }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isFeatured: '',
    color: '',
    discount: '0',
    category: '',
    material: '',
    ItemType: 'Jewelry'
  });

  const { data: session } = useSession();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [size, setSize] = useState([
    { quantity: 0, Size: 14 },
    { quantity: 0, Size: 16 },
    { quantity: 0, Size: 18 },
    { quantity: 0, Size: 20 },
    { quantity: 0, Size: 22 }
  ]);

  const notify = () => toast('Jewelry was successfully added!');

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...size];
    updatedSizes[index]['quantity'] = parseInt(value);

    setSize(updatedSizes);
  };

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
            name: formData.name,
            description: formData.description,
            price: parseInt(formData.price),
            isFeatured: formData.isFeatured,
            color: formData.color,
            discount: parseInt(formData.discount) || 0,
            category: formData.category,
            material: formData.material,
            ItemType: formData.ItemType,
            image: resp[0].id || '',
            sizes: size
          };

          console.log(payload);

          const resp2 = await fetch(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/jewelries`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${session?.jwt}`
              },
              body: JSON.stringify({ data: payload })
            }
          );

          if (resp2.ok) {
            setFormData({
              name: '',
              description: '',
              price: '',
              isFeatured: '',
              color: '',
              discount: '0',
              category: '',
              material: '',
              ItemType: 'Jewelry'
            });

            setSize([
              { quantity: 0, Size: 14 },
              { quantity: 0, Size: 16 },
              { quantity: 0, Size: 18 },
              { quantity: 0, Size: 20 },
              { quantity: 0, Size: 22 }
            ]);

            setImageFile(null);
            setImagePreview(null);
            fetchJewelries();
            notify();
          }
        } else {
          alert('Image upload failed');
          setImageError('Select an image less than 5MB');
        }
      } catch (error) {
        console.log('Upload error:', error);
      }
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-4'>
      <div className='w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative '>
        {/* Absolute Close Button */}
        <button
          className='absolute top-3 right-3 text-2xl text-gray-600 hover:text-red-500 z-50'
          onClick={() => setOpenAddForm(false)}
        >
          <RxCross2 />
        </button>

        {/* Header */}
        <div className='mb-4'>
          <h2 className='text-lg sm:text-2xl font-semibold text-gray-800 text-center'>
            Add Jewelry
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
          {[
            { label: 'Name', name: 'name' },
            { label: 'Item Type', name: 'ItemType' },
            { label: 'Color', name: 'color' },
            { label: 'Price', name: 'price' },
            { label: 'Discount', name: 'discount' },
            { label: 'Description', name: 'description' }
          ].map(field => (
            <div key={field.name} className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {field.label}
              </label>
              <input
                placeholder={field.label === 'Discount' ? '-5' : ''}
                type='text'
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
          ))}

          {/* Material */}
          <div className='flex flex-col'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              Material
            </label>
            <select
              name='material'
              value={formData.material}
              onChange={handleInputChange}
              className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            >
              <option value=''>Select</option>
              <option value='Gold'>Gold</option>
              <option value='Silver'>Silver</option>
              <option value='Acrylic'>Acrylic</option>
              <option value='Plastic'>Plastic</option>
              <option value='Stainless-Steel'>Stainless-Steel</option>
            </select>
          </div>

          {/* Category */}
          <div className='flex flex-col'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              Category
            </label>
            <select
              name='category'
              value={formData.category}
              onChange={handleInputChange}
              className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            >
              <option value=''>Select</option>
              <option value='Nose-Ring'>Nose-Ring</option>
              <option value='Belly-Ring'>Belly-Ring</option>
              <option value='Septum'>Septum</option>
              <option value='Tragus'>Tragus</option>
            </select>
          </div>

          {/* Featured */}
          <div className='flex flex-col'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              Featured
            </label>
            <select
              name='isFeatured'
              value={formData.isFeatured}
              onChange={handleInputChange}
              className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            >
              <option value=''>Select</option>
              <option value='true'>True</option>
              <option value='false'>False</option>
            </select>
          </div>

          <div className='col-span-full'>
            <label className='text-sm font-medium mb-2 block'>Sizes</label>
            {size?.map((size, index) => (
              <div
                key={index}
                className='mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2'
              >
                <input
                  type='text'
                  placeholder='Size'
                  value={size.Size}
                  onChange={e => handleSizeChange(index, e.target.value)}
                  className='border p-2 w-full sm:w-auto'
                />
                <input
                  type='number'
                  placeholder='Quantity'
                  value={size.quantity}
                  onChange={e =>
                    handleSizeChange(index, parseInt(e.target.value))
                  }
                  className='border p-2 w-full sm:w-auto'
                />
                <button
                  type='button'
                  onClick={() => removeSize(index)}
                  className='text-red-500'
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Image Upload */}
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

          {/* Submit */}
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

export default AddJewelryModule;
