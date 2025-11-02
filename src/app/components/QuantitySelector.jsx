'use client';
import { useState } from 'react';

export default function QuantitySelector({ 
  quantity, 
  onIncrement, 
  onDecrement, 
  min = 1, 
  max,
  disabled = false 
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleIncrement = () => {
    if (quantity < max && !disabled && max > 0) {
      setIsAnimating(true);
      onIncrement();
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  const handleDecrement = () => {
    if (quantity > min && !disabled) {
      setIsAnimating(true);
      onDecrement();
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={handleDecrement}
        disabled={quantity <= min || disabled}
        className={`
          w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center
          hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
          transition-all duration-200 ease-in-out
          ${isAnimating ? 'scale-95' : 'scale-100'}
        `}
      >
        <span className="text-xl font-bold text-gray-600">−</span>
      </button>
      
      <span 
        className={`
          min-w-[3rem] text-center text-xl font-bold text-gray-800
          ${isAnimating ? 'scale-110' : 'scale-100'}
          transition-transform duration-200 ease-in-out
        `}
        aria-live="polite"
      >
        {quantity}
      </span>
      
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={handleIncrement}
        disabled={quantity >= max || disabled || max <= 0}
        className={`
          w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center
          hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
          transition-all duration-200 ease-in-out
          ${isAnimating ? 'scale-95' : 'scale-100'}
        `}
      >
        <span className="text-xl font-bold text-gray-600">+</span>
      </button>
    </div>
  );
}
