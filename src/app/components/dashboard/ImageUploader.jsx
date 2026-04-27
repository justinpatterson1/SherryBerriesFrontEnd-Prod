'use client';

import { useState, useEffect, useId } from 'react';

/**
 * Reusable image upload control with preview.
 * Calls onChange(file) when a file is selected.
 */
export default function ImageUploader({ onChange, error, label = 'Upload Image' }) {
  const [preview, setPreview] = useState(null);
  const inputId = useId();
  const errorId = useId();

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
      <label htmlFor={inputId} className='text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
      <input
        id={inputId}
        type='file'
        accept='image/*'
        onChange={handleChange}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className='border border-gray-300 p-2 rounded-md text-sm'
      />
      {preview && (
        <img src={preview} alt='Preview of uploaded file' className='mt-4 h-48 w-full object-cover rounded-md' />
      )}
      {error && (
        <span id={errorId} role='alert' className='text-red-500 mt-2 text-sm'>
          {error}
        </span>
      )}
    </div>
  );
}
