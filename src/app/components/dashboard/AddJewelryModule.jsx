'use client';

import { useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import JewelryForm from './JewelryForm';
import Modal from '../ui/Modal';
import { JEWELRY_SIZES } from '@/lib/constants';
import { uploadFile } from '@/lib/api/uploads';
import { createJewelry } from '@/lib/api/products';
import { ApiError } from '@/lib/api-client';

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
      let uploadResp;
      try {
        uploadResp = await uploadFile(imageFile, session?.jwt);
      } catch (err) {
        if (err instanceof ApiError) {
          setImageError('Select an image less than 5MB');
          return;
        }
        throw err;
      }

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
        image: uploadResp?.[0]?.id || '',
        sizes
      };

      await createJewelry({ data: payload }, session?.jwt);
      resetForm();
      fetchJewelries?.();
      toast('Jewelry was successfully added!');
    } catch {
      setImageError('Submission failed — please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        open
        onClose={() => setOpenAddForm(false)}
        title='Add Jewelry'
        titleId='add-jewelry-title'
      >
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
      </Modal>
      <ToastContainer />
    </>
  );
}
