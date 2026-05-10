import Image from 'next/image';
import Link from 'next/link';

function Advert({ advert }) {
  return (
    <section className='py-20 px-4'>
      <div className='container mx-auto max-w-6xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center'>
          <div className='relative flex justify-center'>
            <div
              className='absolute inset-0 bg-brand-light rounded-sm -translate-x-4 translate-y-4 md:-translate-x-6 md:translate-y-6'
              aria-hidden='true'
            />
            <Image
              src={advert?.image?.formats?.large?.url}
              width={advert?.image?.formats?.large?.width}
              height={advert?.image?.formats?.large?.height}
              alt={advert?.Title || 'Advert image'}
              className='relative max-w-full h-auto shadow-lg rounded-sm'
            />
          </div>

          <div className='flex flex-col'>
            <h3 className='font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6'>
              {advert?.Title}
            </h3>
            <p className='text-base md:text-lg leading-relaxed text-gray-600 mb-8'>
              {advert?.description}
            </p>
            <Link href={'/product/aftercare'} className='self-start'>
              <div className='cursor-pointer bg-brand hover:bg-brand-hover transition-colors px-10 py-3 text-white text-sm tracking-widest uppercase font-medium'>
                Shop Now
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Advert;
