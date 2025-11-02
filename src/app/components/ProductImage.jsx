'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductImage({ 
  src, 
  alt, 
  width = 500, 
  height = 500, 
  className = "w-full max-w-md lg:max-w-lg object-cover rounded-lg shadow-lg",
  fallbackSrc = "/placeholder-image.jpg"
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (imageError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {isLoading && (
        <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
          <div className="text-gray-400 flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}
      <Image
        src={src || fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-all duration-500 ease-in-out group-hover:scale-105`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {/* Image overlay for better UX */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-lg pointer-events-none"></div>
    </div>
  );
}
