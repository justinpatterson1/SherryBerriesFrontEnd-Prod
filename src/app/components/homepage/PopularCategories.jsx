'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

function PopularCategories({ popular_category, description }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className='text-center py-16 px-4 bg-gradient-to-br from-white to-gray-50'>
      <div className='container mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='mb-12'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-gray-800 mb-6'>
            Popular Categories
          </h2>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            {description}
          </p>
        </motion.div>

        <motion.div 
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {popular_category?.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className='group'
            >
              <Link href={`/${category.Slug}`}>
                <div className='relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white'>
                  <div className='relative overflow-hidden'>
                    <Image
                      src={`${category?.Image?.formats?.small?.url}`}
                      width={category?.Image?.formats?.small?.width}
                      height={category?.Image?.formats?.small?.height}
                      alt={category?.name || 'Category Image'}
                      className='w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    
                    {/* Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    
                    {/* Category Title Overlay */}
                    <div className='absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
                      <h3 className='text-white text-xl font-bold'>
                        {category?.Title}
                      </h3>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className='p-6'>
                    <h3 className='text-xl font-bold text-gray-800 group-hover:text-[#EA4492] transition-colors duration-300 mb-2'>
                      {category?.Title}
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Explore our curated collection
                    </p>
                    
                    <div className='mt-4 flex items-center text-[#EA4492] font-medium group-hover:translate-x-2 transition-transform duration-300'>
                      <span>Shop Now</span>
                      <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default PopularCategories;
