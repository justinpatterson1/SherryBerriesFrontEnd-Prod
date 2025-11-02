'use client';

import React, { useState } from 'react';
import Breadcrumbs from '../Breadcrumbs';
import { ProductGridSkeleton, HeroSkeleton } from '../SkeletonLoader';
import Button, { LoadingButton, PrimaryButton } from '../ui/Button';
import CartButton from '../ui/CartButton';
import Image, { ProductImage } from '../ui/Image';
import ErrorBoundary from '../ErrorBoundary';

const QuickWinsDemo = () => {
  const [loading, setLoading] = useState(false);
  const [showSkeletons, setShowSkeletons] = useState(false);

  const handleAddToCart = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Added to cart!');
  };

  const simulateLoading = () => {
    setShowSkeletons(true);
    setTimeout(() => setShowSkeletons(false), 3000);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Quick Wins Demo</h1>
      
      {/* Breadcrumbs Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Breadcrumbs</h2>
        <div className="bg-gray-100 p-4 rounded">
          <Breadcrumbs />
        </div>
      </section>

      {/* Loading Skeletons Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading Skeletons</h2>
        <button 
          onClick={simulateLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Skeletons
        </button>
        {showSkeletons ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">Product 1</div>
            <div className="bg-white p-4 rounded shadow">Product 2</div>
            <div className="bg-white p-4 rounded shadow">Product 3</div>
          </div>
        )}
      </section>

      {/* Button States Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button States</h2>
        <div className="flex flex-wrap gap-4">
          <PrimaryButton>Normal Button</PrimaryButton>
          <LoadingButton loading={loading} onClick={() => setLoading(true)}>
            Loading Button
          </LoadingButton>
          <Button variant="success" success>
            Success State
          </Button>
          <Button variant="danger" error>
            Error State
          </Button>
          <Button disabled>
            Disabled Button
          </Button>
        </div>
      </section>

      {/* Cart Button Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cart Button</h2>
        <div className="max-w-xs">
          <CartButton onAddToCart={handleAddToCart}>
            Add to Cart
          </CartButton>
        </div>
      </section>

      {/* Image Component Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Enhanced Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">With proper alt text:</h3>
            <ProductImage
              src="https://via.placeholder.com/300x200"
              width={300}
              height={200}
              productName="Sample Jewelry"
              category="Jewelry"
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">With fallback:</h3>
            <Image
              src="invalid-url"
              width={300}
              height={200}
              alt="This will show fallback"
            />
          </div>
        </div>
      </section>

      {/* Error Boundary Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Error Boundary</h2>
        <ErrorBoundary>
          <div className="bg-gray-100 p-4 rounded">
            <p>This content is wrapped in an error boundary.</p>
            <button 
              onClick={() => { throw new Error('Demo error!'); }}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Trigger Error
            </button>
          </div>
        </ErrorBoundary>
      </section>
    </div>
  );
};

export default QuickWinsDemo;
