'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { FiImage } from 'react-icons/fi';

const Image = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallback = true,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate meaningful alt text if not provided
  const generateAltText = (src, providedAlt) => {
    if (providedAlt) return providedAlt;
    
    // Extract meaningful information from URL or path
    const filename = src.split('/').pop().split('.')[0];
    const category = src.includes('jewelry') ? 'jewelry' :
                   src.includes('waistbead') ? 'waistbead' :
                   src.includes('clothing') ? 'clothing' :
                   src.includes('aftercare') ? 'aftercare' :
                   src.includes('blog') ? 'blog' :
                   src.includes('hero') ? 'hero image' :
                   'product';
    
    return `${category} image - ${filename.replace(/[-_]/g, ' ')}`;
  };

  const altText = generateAltText(src, alt);

  // Handle image load error
  const handleError = () => {
    setImageError(true);
  };

  // Handle image load success
  const handleLoad = () => {
    setImageLoaded(true);
  };

  // Fallback component when image fails to load
  const ImageFallback = () => (
    <div 
      className={`bg-gray-200 flex items-center justify-center ${className}`}
      style={{ width, height }}
      role="img"
      aria-label={altText}
    >
      <div className="text-center text-gray-400">
        <FiImage className="h-12 w-12 mx-auto mb-2" />
        <p className="text-sm">Image not available</p>
      </div>
    </div>
  );

  // Loading placeholder
  const LoadingPlaceholder = () => (
    <div 
      className={`bg-gray-200 animate-pulse ${className}`}
      style={{ width, height }}
    />
  );

  // If image failed to load and fallback is enabled
  if (imageError && fallback) {
    return <ImageFallback />;
  }

  // If image is still loading
  if (!imageLoaded && !imageError) {
    return <LoadingPlaceholder />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <NextImage
        src={src}
        alt={altText}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
      
      {/* Loading indicator overlay */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">
            <FiImage className="h-8 w-8 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

// Specialized image components for different use cases
export const ProductImage = ({ productName, category, ...props }) => {
  const altText = `${category || 'product'} - ${productName || 'item'}`;
  return <Image alt={altText} {...props} />;
};

export const HeroImage = ({ title, description, ...props }) => {
  const altText = description || title || 'Hero image';
  return <Image alt={altText} priority {...props} />;
};

export const BlogImage = ({ title, author, ...props }) => {
  const altText = `Blog post: ${title}${author ? ` by ${author}` : ''}`;
  return <Image alt={altText} {...props} />;
};

export const UserImage = ({ userName, ...props }) => {
  const altText = userName ? `Profile picture of ${userName}` : 'User profile picture';
  return <Image alt={altText} {...props} />;
};

export default Image;
