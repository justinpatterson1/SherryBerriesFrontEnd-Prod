import Image from 'next/image';
import Link from 'next/link';
import FadeInSection from '../components/FadeInSection';
import Loader from '../components/Loader';
import { getAboutPage } from '@/lib/api/content';

export default async function About() {
  try {
    const about = await getAboutPage();

    if (!about?.data) {
      throw new Error('No about data available');
    }

    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
        {/* Hero Section */}
        <FadeInSection>
          <div className='relative bg-gradient-to-r from-brand to-pink-600 py-20 px-4 overflow-hidden'>
            <div className='absolute inset-0 bg-black/10'></div>
            <div className='relative container mx-auto text-center'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
                {about.data.title || 'About SherryBerries'}
              </h1>
              <p className='text-xl md:text-2xl text-pink-100 max-w-3xl mx-auto font-light'>
                We Do It Big Here At SherryBerries!
              </p>
            </div>
            {/* Decorative elements */}
            <div className='absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full'></div>
            <div className='absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full'></div>
            <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full'></div>
          </div>
        </FadeInSection>

        {/* Main Content */}
        <div className='py-16 px-4'>
          <div className='container mx-auto max-w-6xl'>
            <div className='grid lg:grid-cols-2 gap-16 items-center'>
              {/* Image Section */}
              <FadeInSection>
                <div className='relative group'>
                  <div className='absolute -inset-4 bg-gradient-to-r from-brand to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200'></div>
                  <div className='relative bg-white p-4 rounded-2xl shadow-xl'>
                    {about?.data?.blocks[2]?.file?.formats?.large?.url ? (
                      <Image
                        className='w-full h-auto object-cover rounded-xl'
                        src={about.data.blocks[2].file.formats.large.url}
                        width={about.data.blocks[2].file.formats.large.width}
                        height={about.data.blocks[2].file.formats.large.height}
                        alt={about.data.blocks[2].file.alternativeText || 'About SherryBerries'}
                        priority
                      />
                    ) : (
                      <div className='w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center'>
                        <span className='text-gray-500 text-lg'>Image coming soon</span>
                      </div>
                    )}
                  </div>
                </div>
              </FadeInSection>

              {/* Content Section */}
              <FadeInSection>
                <div className='space-y-8'>
                  <div>
                    <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
                      Our Story
                    </h2>
                    {about?.data?.blocks[1]?.body ? (
                      <div className='prose prose-lg max-w-none'>
                        <p className='text-gray-700 leading-relaxed text-lg mb-6'>
                          {about.data.blocks[1].body}
                        </p>
                      </div>
                    ) : (
                      <p className='text-gray-700 leading-relaxed text-lg mb-6'>
                        Welcome to SherryBerries, where we create beautiful, unique pieces that celebrate your individual style. 
                        Our passion for quality craftsmanship and attention to detail ensures that every piece tells a story 
                        and becomes a treasured part of your collection.
                      </p>
                    )}
                  </div>

                  {/* Values Section */}
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
                      <div className='w-12 h-12 bg-brand rounded-lg flex items-center justify-center mb-4'>
                        <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                        </svg>
                      </div>
                      <h3 className='text-xl font-semibold text-gray-900 mb-2'>Quality First</h3>
                      <p className='text-gray-600'>Every piece is crafted with the highest quality materials and attention to detail.</p>
                    </div>

                    <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
                      <div className='w-12 h-12 bg-brand rounded-lg flex items-center justify-center mb-4'>
                        <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                      </div>
                      <h3 className='text-xl font-semibold text-gray-900 mb-2'>Fast Delivery</h3>
                      <p className='text-gray-600'>Quick and reliable shipping to get your beautiful pieces to you fast.</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <FadeInSection>
          <div className='bg-gradient-to-r from-gray-900 to-gray-800 py-16 px-4'>
            <div className='container mx-auto text-center max-w-4xl'>
              <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
                Ready to Find Your Perfect Piece?
              </h2>
              <p className='text-xl text-gray-300 mb-8 leading-relaxed'>
                Explore our curated collection of jewelry, waistbeads, clothing, and aftercare products. 
                Each piece is carefully selected to bring joy and style to your life.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link 
                  href='/product/jewelry'
                  className='bg-brand hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg'
                >
                  Shop Jewelry
                </Link>
                <Link 
                  href='/product/waistbeads'
                  className='bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg'
                >
                  Shop Waistbeads
                </Link>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Contact Section */}
        <FadeInSection>
          <div className='py-16 px-4 bg-white'>
            <div className='container mx-auto text-center max-w-2xl'>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
                Get In Touch
              </h2>
              <p className='text-xl text-gray-600 mb-8'>
                Have questions about our products or need help finding the perfect piece? 
                We'd love to hear from you!
              </p>
              <Link 
                href='/contact'
                className='inline-flex items-center bg-brand hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg'
              >
                Contact Us
                <svg className='ml-2 w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                </svg>
              </Link>
            </div>
          </div>
        </FadeInSection>
      </div>
    );
  } catch (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <div className='text-center max-w-md'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Oops! Something went wrong</h1>
          <p className='text-gray-600 mb-6'>
            We're having trouble loading our about page. Please try again later.
          </p>
          <Link 
            href='/'
            className='inline-flex items-center bg-brand hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300'
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }
}
