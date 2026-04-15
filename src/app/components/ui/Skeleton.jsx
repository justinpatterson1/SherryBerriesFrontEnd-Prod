/**
 * Reusable skeleton components for loading states.
 * All use Tailwind's animate-pulse for consistent animation.
 */

export function Skeleton({ className = '' }) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 animate-pulse rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ className = 'w-full h-64' }) {
  return <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`} />;
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 space-y-3 ${className}`}>
      <SkeletonImage className='w-full h-48' />
      <Skeleton className='h-5 w-3/4' />
      <Skeleton className='h-4 w-1/2' />
      <Skeleton className='h-8 w-1/3' />
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <Skeleton className='h-4 w-48 mb-6' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <SkeletonImage className='w-full h-[400px]' />
        <div className='space-y-4'>
          <Skeleton className='h-8 w-3/4' />
          <Skeleton className='h-6 w-1/4' />
          <SkeletonText lines={4} />
          <Skeleton className='h-12 w-full mt-4' />
          <Skeleton className='h-12 w-full' />
        </div>
      </div>
    </div>
  );
}

export function OrderListSkeleton() {
  return (
    <div className='max-w-4xl mx-auto px-4 py-8 space-y-4'>
      <Skeleton className='h-8 w-48 mb-6' />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className='bg-white rounded-lg shadow-sm p-6 space-y-3'>
          <div className='flex justify-between'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-5 w-20' />
          </div>
          <Skeleton className='h-4 w-48' />
          <div className='flex gap-4'>
            <Skeleton className='h-16 w-16 rounded' />
            <div className='space-y-2 flex-1'>
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className='max-w-4xl mx-auto px-4 py-8 space-y-4'>
      <Skeleton className='h-8 w-32 mb-6' />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className='bg-white rounded-lg shadow-sm p-4 flex gap-4'>
          <Skeleton className='h-24 w-24 rounded' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-4 w-1/4' />
            <Skeleton className='h-8 w-32' />
          </div>
          <Skeleton className='h-6 w-16' />
        </div>
      ))}
      <div className='bg-white rounded-lg shadow-sm p-4 space-y-2 mt-4'>
        <Skeleton className='h-5 w-32 ml-auto' />
        <Skeleton className='h-10 w-48 ml-auto' />
      </div>
    </div>
  );
}

export function BlogGridSkeleton() {
  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <Skeleton className='h-8 w-32 mb-6' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className='max-w-6xl mx-auto px-4 py-8 space-y-6'>
      <Skeleton className='h-8 w-48 mb-4' />
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='bg-white rounded-lg shadow-sm p-6 space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-8 w-16' />
          </div>
        ))}
      </div>
      <div className='bg-white rounded-lg shadow-sm p-4'>
        <Skeleton className='h-6 w-32 mb-4' />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='flex justify-between py-3 border-b border-gray-100'>
            <Skeleton className='h-4 w-1/4' />
            <Skeleton className='h-4 w-1/6' />
            <Skeleton className='h-4 w-1/6' />
            <Skeleton className='h-4 w-16' />
          </div>
        ))}
      </div>
    </div>
  );
}
