'use client';

export default function SizeSelector({ 
  sizes, 
  selectedSize, 
  onSizeSelect, 
  type = 'jewelry',
  disabled = false 
}) {
  const getSizeLabel = () => {
    switch (type) {
      case 'jewelry':
        return 'Ring Size';
      case 'clothing':
        return 'Clothing Size';
      case 'waistbead':
        return 'Waist Size (inches)';
      default:
        return 'Size';
    }
  };

  const isSizeAvailable = (size) => {
    return size.quantity === undefined || size.quantity > 0;
  };

  if (type === 'waistbead') {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-8">
        <label htmlFor="waist-size" className="text-lg lg:text-2xl text-gray-600 font-medium">
          {getSizeLabel()}
        </label>
        <div className="relative">
          <input
            id="waist-size"
            type="number"
            name="size"
            value={selectedSize}
            onChange={(e) => onSizeSelect(e.target.value)}
            placeholder="Enter your waist size"
            disabled={disabled}
            className={`
              border-2 border-gray-300 rounded-lg p-4 w-48 text-lg font-medium
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 ease-in-out
              ${selectedSize ? 'border-pink-500 bg-pink-50' : ''}
            `}
            min="20"
            max="60"
            step="0.5"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            in
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-8">
      <p className="text-lg lg:text-2xl text-gray-600 font-medium min-w-fit">{getSizeLabel()}</p>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size, index) => {
          const available = isSizeAvailable(size);
          const isSelected = selectedSize === size.Size;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => available && onSizeSelect(size.Size)}
              disabled={!available || disabled}
              className={`
                border-2 w-14 h-14 rounded-full text-center flex items-center justify-center cursor-pointer
                transition-all duration-200 ease-in-out transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
                ${isSelected 
                  ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold shadow-md' 
                  : available 
                    ? 'border-gray-300 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50 shadow-sm' 
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                }
                ${!available ? 'opacity-50' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-label={`Select size ${size.Size}${!available ? ' (out of stock)' : ''}`}
              aria-pressed={isSelected}
            >
              <span className="text-sm font-medium">{size.Size}</span>
            </button>
          );
        })}
        {sizes.length === 0 && (
          <p className="text-gray-500 text-sm italic">No sizes available</p>
        )}
      </div>
    </div>
  );
}
