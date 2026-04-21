import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-brand-light px-4'>
      <div className='bg-white shadow-md rounded-2xl p-8 max-w-lg w-full text-center'>
        <h1 className='text-7xl font-bold text-brand mb-2'>404</h1>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Page Not Found</h2>
        <p className='text-gray-600 mb-8'>
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className='grid grid-cols-2 gap-3 mb-6 text-sm'>
          <Link href='/' className='px-4 py-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors'>
            Home
          </Link>
          <Link href='/product/jewelry' className='px-4 py-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors'>
            Jewelry
          </Link>
          <Link href='/product/waistbeads' className='px-4 py-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors'>
            Waistbeads
          </Link>
          <Link href='/contact' className='px-4 py-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors'>
            Contact Us
          </Link>
        </div>
        <Link
          href='/'
          className='inline-block px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors'
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
