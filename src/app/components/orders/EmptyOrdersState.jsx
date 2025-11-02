'use client';

import React from 'react';
import Link from 'next/link';
import { FiPackage, FiShoppingBag, FiHeart } from 'react-icons/fi';
import Button from '../ui/Button';

const EmptyOrdersState = ({ hasFilters = false }) => {
  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FiPackage className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No orders found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We couldn't find any orders matching your current filters. Try adjusting your search criteria.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="mx-auto w-32 h-32 bg-gradient-to-br from-[#EA4492] to-pink-400 rounded-full flex items-center justify-center mb-8">
        <FiShoppingBag className="h-16 w-16 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Your order history is empty
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Start your shopping journey and discover our beautiful collection of jewelry, waistbeads, and more!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/product/jewelry">
          <Button variant="primary" size="lg" icon={FiHeart}>
            Shop Jewelry
          </Button>
        </Link>
        
        <Link href="/product/waistbeads">
          <Button variant="outline" size="lg" icon={FiPackage}>
            Shop Waistbeads
          </Button>
        </Link>
      </div>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <FiPackage className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Quality Products</h3>
          <p className="text-sm text-gray-600">Handcrafted with love and attention to detail</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <FiShoppingBag className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Easy Ordering</h3>
          <p className="text-sm text-gray-600">Simple checkout process with secure payment</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <FiHeart className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Customer Care</h3>
          <p className="text-sm text-gray-600">Dedicated support for all your needs</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyOrdersState;
