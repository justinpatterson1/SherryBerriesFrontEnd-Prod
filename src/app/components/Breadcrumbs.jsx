'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumbs = ({ customItems = null, className = '' }) => {
  const pathname = usePathname();
  
  // Generate breadcrumbs from pathname or use custom items
  const breadcrumbItems = customItems || generateBreadcrumbs(pathname);

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs for home page
  }

  return (
    <nav 
      className={`flex items-center space-x-1 text-sm text-gray-500 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <FiChevronRight className="h-4 w-4 text-gray-400 mx-1" aria-hidden="true" />
            )}
            
            {index === breadcrumbItems.length - 1 ? (
              // Current page (last item) - not clickable
              <span 
                className="text-gray-900 font-medium"
                aria-current="page"
              >
                {item.icon && <item.icon className="h-4 w-4 mr-1 inline" />}
                {item.label}
              </span>
            ) : (
              // Previous pages - clickable
              <Link
                href={item.href}
                className="hover:text-gray-700 transition-colors duration-200 flex items-center"
              >
                {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs from pathname
const generateBreadcrumbs = (pathname) => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  // Always start with home
  breadcrumbs.push({
    label: 'Home',
    href: '/',
    icon: FiHome
  });

  // Build breadcrumbs from path segments
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip dynamic route segments (like [id])
    if (segment.startsWith('[') && segment.endsWith(']')) {
      return;
    }

    const label = formatSegmentLabel(segment, index, pathSegments);
    
    breadcrumbs.push({
      label,
      href: currentPath
    });
  });

  return breadcrumbs;
};

// Helper function to format segment labels
const formatSegmentLabel = (segment, index, allSegments) => {
  // Handle special cases
  const labelMap = {
    'product': 'Products',
    'jewelry': 'Jewelry',
    'waistbeads': 'Waistbeads',
    'clothing': 'Clothing',
    'aftercare': 'Aftercare',
    'checkout': 'Checkout',
    'cart': 'Cart',
    'orders': 'My Orders',
    'dashboard': 'Dashboard',
    'blogs': 'Blogs',
    'about': 'About',
    'contact': 'Contact',
    'sign-in': 'Sign In',
    'sign-up': 'Sign Up',
    'thank-you': 'Thank You'
  };

  // If it's a known segment, use the mapped label
  if (labelMap[segment]) {
    return labelMap[segment];
  }

  // If it's a dynamic route parameter, try to get a meaningful label
  if (index === allSegments.length - 1 && segment !== allSegments[0]) {
    // This is likely a product ID or similar - we'll need to fetch the actual name
    // For now, return a generic label
    return 'Product Details';
  }

  // Default: capitalize and replace hyphens with spaces
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Enhanced breadcrumb with product name support
export const ProductBreadcrumbs = ({ productName = null, category = null }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = [
    { label: 'Home', href: '/', icon: FiHome }
  ];

  // Add category breadcrumb if available
  if (category) {
    breadcrumbs.push({
      label: category,
      href: `/product/${category.toLowerCase()}`
    });
  } else if (pathSegments.includes('product') && pathSegments.length > 2) {
    // Extract category from path
    const categoryIndex = pathSegments.indexOf('product');
    if (categoryIndex + 1 < pathSegments.length) {
      const categorySegment = pathSegments[categoryIndex + 1];
      breadcrumbs.push({
        label: formatSegmentLabel(categorySegment, 0, pathSegments),
        href: `/product/${categorySegment}`
      });
    }
  }

  // Add product name if available
  if (productName) {
    breadcrumbs.push({
      label: productName,
      href: pathname
    });
  } else {
    breadcrumbs.push({
      label: 'Product Details',
      href: pathname
    });
  }

  return <Breadcrumbs customItems={breadcrumbs} />;
};

// Simple breadcrumb for specific pages
export const SimpleBreadcrumbs = ({ items }) => {
  return <Breadcrumbs customItems={items} />;
};

export default Breadcrumbs;
