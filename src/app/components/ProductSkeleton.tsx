'use client';

export default function ProductSkeleton() {
  return (
    <div className="bg-brand-light min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:space-x-8 py-10">
            {/* Image Skeleton */}
            <div className="flex-shrink-0 flex justify-center lg:justify-start">
              <div className="w-full max-w-md lg:max-w-lg h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-col space-y-6 lg:space-y-10 mt-6 lg:mt-0 flex-1">
              {/* Title Skeleton */}
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
              
              {/* Price Skeleton */}
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
              
              {/* Size Skeleton */}
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="flex space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {/* Color Skeleton */}
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              
              {/* Quantity Skeleton */}
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="flex space-x-4 items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              
              {/* Add to Cart Button Skeleton */}
              <div className="w-full sm:w-auto h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="my-5">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
