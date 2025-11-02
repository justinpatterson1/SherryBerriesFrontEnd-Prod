'use client';
import { useState, useReducer } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { ToastContainer, toast } from 'react-toastify';
import ImageGallery from './ImageGallery';
import QuantitySelector from './QuantitySelector';
import SizeSelector from './SizeSelector';
import ErrorBoundary from './ErrorBoundary';
import ErrorDisplay from './ErrorDisplay';
import RelatedProducts from './RelatedProducts';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';
import Loader from './Loader';
import { calculateDiscountedPrice } from '../lib/func';

const cartState = { size: '', color: '', quantity: 1 };

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { ...state, quantity: state.quantity + 1 };
    case 'decrement':
      return { ...state, quantity: Math.max(1, state.quantity - 1) };
    case 'size':
      return { ...state, size: action.payload };
    case 'color':
      return { ...state, color: action.payload };
    case 'resetQuantity':
      return { ...state, quantity: 1 };
    case 'reset':
      return cartState;
    default:
      throw new Error('Unsupported action type');
  }
};

export default function ProductLayout({ 
  productId, 
  productType, 
  params 
}) {
  const [state, dispatch] = useReducer(reducer, cartState);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  
  const { product, loading, error, refetch } = useProduct(productId, productType);
  const { addToCart, loading: cartLoading } = useCart();

  console.log("product: " + JSON.stringify(product,null,2));

  // Get the maximum quantity available for the selected size
  const getMaxQuantityForSelectedSize = () => {
    if (!product?.sizes || productType === 'aftercare') {
      return product?.quantity || 999; // fallback to general quantity or high number
    }
    
    const selectedSizeObj = product.sizes.find(size => 
      size.Size === state.size || size.Size === parseInt(state.size)
    );
    
    return selectedSizeObj?.quantity || 0;
  };

  const increment = () => {
    const maxQuantity = getMaxQuantityForSelectedSize();
    if (state.quantity < maxQuantity) {
      dispatch({ type: 'increment' });
    }
  };
  
  const decrement = () => dispatch({ type: 'decrement' });
  
  const handleSizeClick = (size) => {
    dispatch({ type: 'size', payload: size });
    
    // Reset quantity to 1 if current quantity exceeds the new size's availability
    const newMaxQuantity = product?.sizes?.find(s => 
      s.Size === size || s.Size === parseInt(size)
    )?.quantity || 0;
    
    if (state.quantity > newMaxQuantity) {
      dispatch({ type: 'resetQuantity' });
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      toast.error('Please sign in to add items to cart');
      router.push('/sign-in');
      return;
    }

    if (!state.size && productType !== 'aftercare') {
      toast.error(`Please select a ${productType === 'waistbead' ? 'waist size' : 'size'} first`);
      return;
    }

    setIsAddingToCart(true);
    try {
      const productData = createProductData();
      await addToCart(productData);
      dispatch({ type: 'reset' });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const createProductData = () => {
    const baseData = {
      ItemType: getItemType(productType),
      quantity: state.quantity,
      color: product?.color || state.color
    };

    switch (productType) {
      case 'jewelry':
        return {
          ...baseData,
          jewelries: [productId],
          size: state.size
        };
      case 'clothing':
        return {
          ...baseData,
          merchandises: [productId],
          clothingSize: state.size
        };
      case 'waistbead':
        return {
          ...baseData,
          waistbeads: [productId],
          waistbeadSize: parseInt(state.size)
        };
      case 'aftercare':
        return {
          ...baseData,
          aftercares: [productId]
        };
      default:
        throw new Error(`Unknown product type: ${productType}`);
    }
  };

  const getItemType = (type) => {
    switch (type) {
      case 'jewelry':
        return 'Jewelry';
      case 'clothing':
        return 'Merchandise';
      case 'waistbead':
        return 'Waistbead';
      case 'aftercare':
        return 'Aftercare';
      default:
        return 'Product';
    }
  };

  const formatPrice = (price, discount) => {
    return calculateDiscountedPrice(price, discount);
  };

  const getProductImages = () => {
    if (!product) return [];
    if (Array.isArray(product.image)) return product.image;
    return [product.image].filter(Boolean);
  };

  const getProductName = () => {
    return product?.name || product?.Name || 'Product';
  };

  const getProductDescription = () => {
    return product?.description || product?.Description || '';
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Product Not Found"
        onRetry={refetch}
      />
    );
  }

  if (!product) {
    return (
      <ErrorDisplay
        error="The product you're looking for doesn't exist or has been removed."
        title="Product Not Found"
        onRetry={refetch}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className='bg-[#ffefef] min-h-screen flex flex-col'>
        <ToastContainer />
        <main className='flex-grow'>
          <div className='container mx-auto px-4'>
            {/* Product Details */}
            <div className='flex flex-col lg:flex-row lg:space-x-8 py-10'>
              {/* Left Column: Images */}
              <div className='flex-shrink-0 flex justify-center lg:justify-start'>
                <ImageGallery
                  images={getProductImages()}
                  alt={getProductName()}
                />
              </div>

              {/* Right Column: Content */}
              <div className='flex flex-col space-y-6 lg:space-y-8 mt-6 lg:mt-0'>
                <h1 className='text-3xl lg:text-4xl font-bold text-gray-900'>
                  {getProductName()}
                </h1>

                {/* Price Section */}
                <div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-5'>
                  <p className='text-[#EA4492] text-2xl lg:text-3xl font-bold'>
                    ${formatPrice(product.price, product.discount)}
                  </p>
                  { product.discount < 0 && (
                    <>
                      <span className='text-gray-400 text-lg lg:text-xl'>
                        <strike>${product.price.toFixed(2)}</strike>
                      </span>
                      <span className='border-2 w-auto px-4 py-2 rounded-full text-center bg-[#B88E2F] text-white text-sm lg:text-base font-medium'>
                        {product?.discount}% off
                      </span>
                    </>
                  )}
                </div>

                {/* Size Section */}
                {productType !== 'aftercare' && (
                  <SizeSelector
                    sizes={product?.sizes || []}
                    selectedSize={state.size}
                    onSizeSelect={handleSizeClick}
                    type={productType}
                    disabled={isAddingToCart}
                  />
                )}

                {/* Color Section */}
                {product?.color && (
                  <div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-8'>
                    <p className='text-lg lg:text-2xl text-gray-600 font-medium'>Color</p>
                    <span className='border-2 border-gray-300 w-auto px-4 py-2 rounded-full text-center bg-white flex items-center justify-center text-gray-700 font-medium'>
                      {product.color}
                    </span>
                  </div>
                )}

                {/* Quantity Section */}
                <div className='flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-8'>
                  <p className='text-lg lg:text-2xl text-gray-600 font-medium'>Quantity</p>
                  <div className='flex flex-col space-y-2'>
                    <QuantitySelector
                      quantity={state.quantity}
                      onIncrement={increment}
                      onDecrement={decrement}
                      max={getMaxQuantityForSelectedSize()}
                      disabled={isAddingToCart || (!state.size && productType !== 'aftercare')}
                    />
                    {state.size && productType !== 'aftercare' && getMaxQuantityForSelectedSize() === 0 && (
                      <p className='text-sm text-red-600 font-medium'>
                        This size is currently out of stock
                      </p>
                    )}
                    {state.size && productType !== 'aftercare' && getMaxQuantityForSelectedSize() > 0 && (
                      <p className='text-sm text-gray-600'>
                        {getMaxQuantityForSelectedSize()} available in this size
                      </p>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  className='w-full sm:w-auto bg-[#EA4492] p-4 lg:p-6 text-center text-white text-lg lg:text-xl font-medium rounded-lg hover:bg-[#d63a7a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || cartLoading || (!state.size && productType !== 'aftercare') || (state.size && getMaxQuantityForSelectedSize() === 0)}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Adding...</span>
                    </>
                  ) : !state.size && productType !== 'aftercare' ? (
                    `Select a ${productType === 'waistbead' ? 'waist size' : 'size'} first`
                  ) : state.size && getMaxQuantityForSelectedSize() === 0 ? (
                    'This size is out of stock'
                  ) : (
                    'Add To Cart'
                  )}
                </button>
              </div>
            </div>

            {/* Description Section */}
            {getProductDescription() && (
              <div className='my-8'>
                <h2 className='text-2xl lg:text-3xl py-4 font-bold text-gray-900'>Description</h2>
                <div className='text-base lg:text-lg text-gray-700 leading-relaxed'>
                  {getProductDescription()}
                </div>
              </div>
            )}

            {/* Instructions Section */}
            {product?.Instructions && product.Instructions.length > 0 && (
              <div className='my-8'>
                <h2 className='text-2xl lg:text-3xl py-4 font-semibold text-gray-900'>
                  Instructions
                </h2>
                <div className='text-base lg:text-lg text-gray-700 leading-relaxed'>
                  <BlocksRenderer content={product.Instructions} />
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Related Products */}
        <RelatedProducts
          currentProductId={productId}
          productType={productType}
        />
      </div>
    </ErrorBoundary>
  );
}
