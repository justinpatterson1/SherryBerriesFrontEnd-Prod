'use client';

import { JEWELRY_SIZES } from '@/lib/constants';
import ImageUploader from './ImageUploader';

const TEXT_FIELDS = [
  { label: 'Name', name: 'name' },
  { label: 'Item Type', name: 'ItemType' },
  { label: 'Color', name: 'color' },
  { label: 'Price', name: 'price' },
  { label: 'Discount', name: 'discount' },
  { label: 'Description', name: 'description' }
];

const MATERIAL_OPTIONS = ['Gold', 'Silver', 'Acrylic', 'Plastic', 'Stainless-Steel'];
const CATEGORY_OPTIONS = ['Nose-Ring', 'Belly-Ring', 'Septum', 'Tragus'];

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
    <form onSubmit={onSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {TEXT_FIELDS.map(field => (
        <div key={field.name} className='flex flex-col'>
          <label className='text-sm font-medium text-gray-700 mb-1'>{field.label}</label>
          <input
            placeholder={field.label === 'Discount' ? '-5' : ''}
            type='text'
            name={field.name}
            value={formData[field.name] || ''}
            onChange={onInputChange}
            className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
        </div>
      ))}

      <div className='flex flex-col'>
        <label className='text-sm font-medium text-gray-700 mb-1'>Material</label>
        <select
          name='material'
          value={formData.material}
          onChange={onInputChange}
          className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
        >
          <option value=''>Select</option>
          {MATERIAL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className='flex flex-col'>
        <label className='text-sm font-medium text-gray-700 mb-1'>Category</label>
        <select
          name='category'
          value={formData.category}
          onChange={onInputChange}
          className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
        >
          <option value=''>Select</option>
          {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className='flex flex-col'>
        <label className='text-sm font-medium text-gray-700 mb-1'>Featured</label>
        <select
          name='isFeatured'
          value={formData.isFeatured}
          onChange={onInputChange}
          className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
        >
          <option value=''>Select</option>
          <option value='true'>True</option>
          <option value='false'>False</option>
        </select>
      </div>

      <div className='col-span-full'>
        <label className='text-sm font-medium mb-2 block'>Sizes</label>
        {sizes.map((entry, index) => (
          <div key={JEWELRY_SIZES[index]} className='mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2'>
            <input
              type='text'
              placeholder='Size'
              value={entry.Size}
              readOnly
              className='border p-2 w-full sm:w-auto bg-gray-50'
            />
            <input
              type='number'
              placeholder='Quantity'
              value={entry.quantity}
              onChange={e => onSizeChange(index, parseInt(e.target.value, 10) || 0)}
              className='border p-2 w-full sm:w-auto'
            />
          </div>
        ))}
      </div>

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
