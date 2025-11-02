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
    if (quantity < max && !disabled) {
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
          w-10 h-10 bg-white border border-gray-300 rounded-md flex items-center justify-center
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
          transition-all duration-150 ease-in-out
          ${isAnimating ? 'scale-95' : 'scale-100'}
        `}
      >
        <span className="text-lg font-medium">-</span>
      </button>
      
      <span 
        className={`
          min-w-[2rem] text-center text-lg font-medium
          ${isAnimating ? 'scale-110' : 'scale-100'}
          transition-transform duration-150 ease-in-out
        `}
        aria-live="polite"
      >
        {quantity}
      </span>
      
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={handleIncrement}
        disabled={quantity >= max || disabled}
        className={`
          w-10 h-10 bg-white border border-gray-300 rounded-md flex items-center justify-center
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
          transition-all duration-150 ease-in-out
          ${isAnimating ? 'scale-95' : 'scale-100'}
        `}
      >
        <span className="text-lg font-medium">+</span>
      </button>
    </div>
  );
}
