'use client';

import React from 'react';

// Generic skeleton component
const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

// Product card skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="w-full h-64" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  </div>
);

// Product grid skeleton
export const ProductGridSkeleton = ({ count = 12 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Cart item skeleton
export const CartItemSkeleton = () => (
  <div className="flex border-b border-gray-300 pb-4 mb-4 bg-white p-4">
    <Skeleton className="w-24 h-24 rounded-md" />
    <div className="pl-3 flex-1 space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
    <div className="flex flex-col items-center space-y-2">
      <Skeleton className="h-6 w-16" />
      <div className="flex space-x-1">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-8 h-8 rounded" />
      </div>
    </div>
  </div>
);

// Blog card skeleton
export const BlogCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

// Hero section skeleton
export const HeroSkeleton = () => (
  <div className="relative h-75vh">
    <Skeleton className="w-full h-full" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-6 w-64 mx-auto" />
        <Skeleton className="h-10 w-32 mx-auto rounded" />
      </div>
    </div>
  </div>
);

// Navigation skeleton
export const NavigationSkeleton = () => (
  <nav className="bg-white fixed w-full z-20 top-0 left-0 shadow-md h-16 flex items-center">
    <div className="container mx-auto flex justify-between items-center p-4">
      <Skeleton className="h-8 w-32" />
      <div className="hidden md:flex space-x-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-16" />
        ))}
      </div>
      <div className="hidden md:flex space-x-4">
        <Skeleton className="h-10 w-20 rounded" />
        <Skeleton className="h-10 w-20 rounded" />
      </div>
    </div>
  </nav>
);

// Page content skeleton
export const PageSkeleton = () => (
  <div className="container mx-auto p-6 space-y-8">
    <Skeleton className="h-8 w-64" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Skeleton className="h-64 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
);

export default Skeleton;
