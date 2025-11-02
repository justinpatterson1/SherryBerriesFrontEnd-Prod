import Link from 'next/link';

export default function EmptyCartModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-md text-center overflow-hidden'>
        <div className='p-8'>
          <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center'>
            <svg className='w-10 h-10 text-[#EA4492]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01' />
            </svg>
          </div>
          
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>Your cart is empty</h2>
          <p className='text-gray-600 mb-8'>Looks like you haven't added anything yet. Let's find something beautiful for you!</p>
          
          <div className='space-y-3'>
            <Link
              href='/product/jewelry'
              className='block w-full bg-[#EA4492] text-white px-6 py-3 rounded-lg hover:bg-[#c83778] transition-colors duration-200 font-medium'
            >
              Browse Jewelry Collection
            </Link>
            <Link
              href='/product/waistbeads'
              className='block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium'
            >
              Explore Waistbeads
            </Link>
            <Link
              href='/product/clothing'
              className='block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium'
            >
              Shop Clothing
            </Link>
          </div>
          
          <button
            onClick={onClose}
            className='mt-6 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
