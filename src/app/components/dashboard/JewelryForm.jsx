'use client';

import { useId } from 'react';
import { JEWELRY_SIZES } from '@/lib/constants';
import ImageUploader from './ImageUploader';

const TEXT_FIELDS = [
  { label: 'Name', name: 'name', required: true },
  { label: 'Item Type', name: 'ItemType', required: true },
  { label: 'Color', name: 'color', required: false },
  { label: 'Price', name: 'price', required: true },
  { label: 'Discount', name: 'discount', required: false },
  { label: 'Description', name: 'description', required: false }
];

const MATERIAL_OPTIONS = ['Gold', 'Silver', 'Acrylic', 'Plastic', 'Stainless-Steel'];
const CATEGORY_OPTIONS = ['Nose-Ring', 'Belly-Ring', 'Septum', 'Tragus'];

function FormField({ label, name, value, onChange, required, placeholder }) {
  const inputId = useId();
  return (
    <div className='flex flex-col'>
      <label htmlFor={inputId} className='text-sm font-medium text-gray-700 mb-1'>
        {label}
        {required && <span className='text-red-500 ml-1' aria-hidden='true'>*</span>}
      </label>
      <input
        id={inputId}
        placeholder={placeholder}
        type='text'
        name={name}
        value={value || ''}
        onChange={onChange}
        aria-required={required}
        className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required }) {
  const selectId = useId();
  return (
    <div className='flex flex-col'>
      <label htmlFor={selectId} className='text-sm font-medium text-gray-700 mb-1'>
        {label}
        {required && <span className='text-red-500 ml-1' aria-hidden='true'>*</span>}
      </label>
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        aria-required={required}
        className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
      >
        <option value=''>Select</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

export default function JewelryForm({
  formData,
  onInputChange,
  sizes,
  onSizeChange,
  onImageChange,
  imageError,
  onSubmit,
  submitting
}) {
  return (
    <form onSubmit={onSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4' noValidate>
      {TEXT_FIELDS.map(field => (
        <FormField
          key={field.name}
          label={field.label}
          name={field.name}
          value={formData[field.name]}
          onChange={onInputChange}
          required={field.required}
          placeholder={field.label === 'Discount' ? '-5' : ''}
        />
      ))}

      <SelectField
        label='Material'
        name='material'
        value={formData.material}
        onChange={onInputChange}
        options={MATERIAL_OPTIONS}
      />

      <SelectField
        label='Category'
        name='category'
        value={formData.category}
        onChange={onInputChange}
        options={CATEGORY_OPTIONS}
      />

      <SelectField
        label='Featured'
        name='isFeatured'
        value={formData.isFeatured}
        onChange={onInputChange}
        options={['true', 'false']}
      />

      <fieldset className='col-span-full'>
        <legend className='text-sm font-medium mb-2 block'>Sizes</legend>
        {sizes.map((entry, index) => (
          <div key={JEWELRY_SIZES[index]} className='mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2'>
            <label className='sr-only' htmlFor={`size-${entry.Size}`}>Size {entry.Size} quantity</label>
            <input
              type='text'
              value={entry.Size}
              readOnly
              aria-label={`Size ${entry.Size} inches`}
              className='border p-2 w-full sm:w-auto bg-gray-50'
            />
            <input
              id={`size-${entry.Size}`}
              type='number'
              placeholder='Quantity'
              value={entry.quantity}
              onChange={e => onSizeChange(index, parseInt(e.target.value, 10) || 0)}
              className='border p-2 w-full sm:w-auto'
            />
          </div>
        ))}
      </fieldset>

      <ImageUploader onChange={onImageChange} error={imageError} />

      <div className='md:col-span-2 mt-6 flex justify-end'>
        <button
          type='submit'
          disabled={submitting}
          className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60'
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
