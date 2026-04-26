'use client';

import { useState, useEffect } from 'react';

/**
 * Reusable image upload control with preview.
 * Calls onChange(file) when a file is selected.
 */
export default function ImageUploader({ onChange, error, label = 'Upload Image' }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange?.(file);
    }
  };

  return (
    <div className='flex flex-col md:col-span-2'>
      <label className='text-sm font-medium text-gray-700 mb-1'>{label}</label>
      <input
        type='file'
        accept='image/*'
        onChange={handleChange}
        className='border border-gray-300 p-2 rounded-md text-sm'
      />
      {preview && (
        <img src={preview} alt='Preview' className='mt-4 h-48 w-full object-cover rounded-md' />
      )}
      {error && <span className='text-red-500 mt-2 text-sm'>{error}</span>}
    </div>
  );
}
