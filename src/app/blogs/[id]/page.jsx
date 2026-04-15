import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiCalendar, FiClock, FiShare2, FiHeart } from 'react-icons/fi';
import { notFound } from 'next/navigation';
import Breadcrumbs from '../../components/Breadcrumbs';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/blogs/${id}?populate=image`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return { title: 'Blog Post' };
    const { data } = await res.json();
    return {
      title: data?.title || 'Blog Post',
      description: data?.description?.slice(0, 160) || 'Read this article on the SherryBerries blog.',
      openGraph: {
        images: data?.image?.url ? [{ url: data.image.url }] : []
      }
    };
  } catch {
    return { title: 'Blog Post' };
  }
}

async function page({ params }) {
  const { id } = await params;

  console.log(id);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/blogs/${id}?populate=*`,
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );

  if (!response.ok) {
    notFound();
  }

  const blog = await response.json();

  console.log(blog);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimatedReadTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <article className='min-h-screen bg-gray-50'>
      {/* Breadcrumbs */}
      <div className='bg-white border-b'>
        <div className='container mx-auto px-4 py-3'>
          <Breadcrumbs 
            customItems={[
              { label: 'Home', href: '/', icon: null },
              { label: 'Blogs', href: '/blogs' },
              { label: blog?.data?.Title || 'Blog Post', href: `/blogs/${id}` }
            ]}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className='bg-white border-b'>
        <div className='container mx-auto px-4 py-4'>
          <Link 
            href='/blogs' 
            className='inline-flex items-center text-gray-600 hover:text-[#EA4492] transition-colors duration-200'
          >
            <FiArrowLeft className='mr-2' />
            Back to Blogs
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className='bg-white'>
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-4xl mx-auto'>
            {/* Meta Information */}
            <div className='flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500'>
              <div className='flex items-center'>
                <FiCalendar className='mr-2' />
                <time>{formatDate(blog?.data?.date)}</time>
              </div>
              <div className='flex items-center'>
                <FiClock className='mr-2' />
                <span>{estimatedReadTime(blog?.data?.description)}</span>
              </div>
              {blog?.data?.category && (
                <div className='bg-[#EA4492] text-white px-3 py-1 rounded-full text-xs font-medium'>
                  {blog?.data?.category?.name}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
              {blog?.data?.Title}
            </h1>

            {/* Action Buttons */}
            {/* <div className='flex items-center gap-4 mb-8'>
              <button className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200'>
                <FiShare2 className='w-4 h-4' />
                <span>Share</span>
              </button>
              <button className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200'>
                <FiHeart className='w-4 h-4' />
                <span>Like</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog?.data?.image && (
        <div className='bg-gray-100'>
          <div className='container mx-auto px-4 py-8'>
            <div className='max-w-5xl mx-auto'>
              <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                <Image
                  src={blog?.data?.image?.formats?.large?.url || blog?.data?.image?.formats?.medium?.url || blog?.data?.image?.url}
                  width={blog?.data?.image?.formats?.large?.width || blog?.data?.image?.formats?.medium?.width || 800}
                  height={blog?.data?.image?.formats?.large?.height || blog?.data?.image?.formats?.medium?.height || 600}
                  alt={blog?.data?.Title || 'Blog Image'}
                  className='w-full h-auto object-cover'
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className='bg-white'>
        <div className='container mx-auto px-4 py-12'>
          <div className='max-w-4xl mx-auto'>
            <div className='prose prose-lg prose-gray max-w-none'>
              <div className='text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-line'>
                {blog?.data?.description}
              </div>
            </div>

            {/* Article Footer */}
            <div className='mt-12 pt-8 border-t border-gray-200'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div className='flex items-center gap-4'>
                  <button className='flex items-center gap-2 px-6 py-3 bg-[#EA4492] hover:bg-pink-600 text-white rounded-lg transition-colors duration-200'>
                    <FiHeart className='w-4 h-4' />
                    <span>Like this post</span>
                  </button>
                  <button className='flex items-center gap-2 px-6 py-3 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200'>
                    <FiShare2 className='w-4 h-4' />
                    <span>Share</span>
                  </button>
                </div>
                
                <Link 
                  href='/blogs'
                  className='text-[#EA4492] hover:text-pink-600 font-medium transition-colors duration-200'
                >
                  ← Back to all posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts Section (Placeholder) */}
      <div className='bg-gray-50 py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center'>
              You might also like
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Placeholder for related posts */}
              <div className='bg-white rounded-xl p-6 shadow-md'>
                <div className='w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center'>
                  <span className='text-4xl text-gray-400'>📝</span>
                </div>
                <h3 className='font-semibold text-lg mb-2'>Related Post Title</h3>
                <p className='text-gray-600 text-sm mb-4'>Brief description of the related post...</p>
                <Link href='#' className='text-[#EA4492] font-medium'>Read More →</Link>
              </div>
              <div className='bg-white rounded-xl p-6 shadow-md'>
                <div className='w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center'>
                  <span className='text-4xl text-gray-400'>📝</span>
                </div>
                <h3 className='font-semibold text-lg mb-2'>Related Post Title</h3>
                <p className='text-gray-600 text-sm mb-4'>Brief description of the related post...</p>
                <Link href='#' className='text-[#EA4492] font-medium'>Read More →</Link>
              </div>
              <div className='bg-white rounded-xl p-6 shadow-md'>
                <div className='w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center'>
                  <span className='text-4xl text-gray-400'>📝</span>
                </div>
                <h3 className='font-semibold text-lg mb-2'>Related Post Title</h3>
                <p className='text-gray-600 text-sm mb-4'>Brief description of the related post...</p>
                <Link href='#' className='text-[#EA4492] font-medium'>Read More →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default page;
