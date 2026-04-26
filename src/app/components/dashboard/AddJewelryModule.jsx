'use client';

import { useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { RxCross2 } from 'react-icons/rx';
import JewelryForm from './JewelryForm';
import { JEWELRY_SIZES } from '@/lib/constants';

const INITIAL_FORM = {
  name: '',
  description: '',
  price: '',
  isFeatured: '',
  color: '',
  discount: '0',
  category: '',
  material: '',
  ItemType: 'Jewelry'
};

const initialSizes = () => JEWELRY_SIZES.map(Size => ({ quantity: 0, Size }));

export default function AddJewelryModule({ setOpenAddForm, fetchJewelries }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [sizes, setSizes] = useState(initialSizes);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSizeChange = useCallback((index, value) => {
    setSizes(prev => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: value };
      return next;
    });
  }, []);

  const handleImageChange = useCallback(file => {
    setImageFile(file);
    setImageError('');
  }, []);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setSizes(initialSizes());
    setImageFile(null);
    setImageError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setImageError('');

    if (!imageFile) {
      setImageError('Please select an image');
      return;
    }

    setSubmitting(true);
    try {
      const formImage = new FormData();
      formImage.append('files', imageFile);

      const imageUpload = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/upload`,
        {
          method: 'POST',
          headers: { authorization: `Bearer ${session?.jwt}` },
          body: formImage
        }
      );

      if (!imageUpload.ok) {
        setImageError('Select an image less than 5MB');
        return;
      }

      const uploadResp = await imageUpload.json();
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price, 10),
        isFeatured: formData.isFeatured,
        color: formData.color,
        discount: parseInt(formData.discount, 10) || 0,
        category: formData.category,
        material: formData.material,
        ItemType: formData.ItemType,
        image: uploadResp[0]?.id || '',
        sizes
      };

      const createResp = await fetch(
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

      if (createResp.ok) {
        resetForm();
        fetchJewelries?.();
        toast('Jewelry was successfully added!');
      }
    } catch {
      setImageError('Submission failed — please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-4'>
      <div className='w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative'>
        <button
          className='absolute top-3 right-3 text-2xl text-gray-600 hover:text-red-500 z-50'
          onClick={() => setOpenAddForm(false)}
          aria-label='Close'
        >
          <RxCross2 />
        </button>

        <div className='mb-4'>
          <h2 className='text-lg sm:text-2xl font-semibold text-gray-800 text-center'>
            Add Jewelry
          </h2>
        </div>

        <JewelryForm
          formData={formData}
          onInputChange={handleInputChange}
          sizes={sizes}
          onSizeChange={handleSizeChange}
          onImageChange={handleImageChange}
          imageError={imageError}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
      <ToastContainer />
    </div>
  );
}
