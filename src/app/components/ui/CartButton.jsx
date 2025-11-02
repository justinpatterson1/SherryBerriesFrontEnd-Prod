'use client';

import React, { useState } from 'react';
import Button from './Button';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';

const CartButton = ({
  onAddToCart,
  disabled = false,
  className = '',
  children = 'Add to Cart',
  successMessage = 'Added!',
  ...props
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = async () => {
    if (isAdding || disabled) return;

    setIsAdding(true);
    
    try {
      await onAddToCart();
      
      // Show success state briefly
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      variant="primary"
      size="lg"
      fullWidth
      loading={isAdding}
      success={showSuccess}
      disabled={disabled}
      onClick={handleClick}
      icon={showSuccess ? FiCheck : FiShoppingCart}
      className={`${className} ${showSuccess ? 'animate-pulse' : ''}`}
      {...props}
    >
      {showSuccess ? successMessage : (isAdding ? 'Adding...' : children)}
    </Button>
  );
};

export default CartButton;
