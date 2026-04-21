import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

function Pagination({ page, setPage, totalPages, hasNextPage = true, hasPrevPage = true }) {
  const add = evt => {
    evt.preventDefault();
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  const subtract = evt => {
    evt.preventDefault();
    if (hasPrevPage && page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  // Generate page numbers to show
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages || page + 2, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className='flex items-center justify-center space-x-2 my-8'>
      {/* Previous Button */}
      <button
        onClick={subtract}
        disabled={!hasPrevPage || page <= 1}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          !hasPrevPage || page <= 1
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-600 hover:border-brand hover:text-brand hover:bg-pink-50'
        }`}
        aria-label="Previous page"
      >
        <IoIosArrowBack className='text-lg' />
      </button>

      {/* Page Numbers */}
      {pageNumbers.length > 1 && (
        <>
          {/* First page if not visible */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className='flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:border-brand hover:text-brand hover:bg-pink-50 transition-all duration-200'
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className='text-gray-400 px-2'>...</span>
              )}
            </>
          )}

          {/* Visible page numbers */}
          {pageNumbers.map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
                pageNumber === page
                  ? 'border-brand bg-brand text-white'
                  : 'border-gray-300 text-gray-600 hover:border-brand hover:text-brand hover:bg-pink-50'
              }`}
            >
              {pageNumber}
            </button>
          ))}

          {/* Last page if not visible */}
          {pageNumbers[pageNumbers.length - 1] < (totalPages || page + 10) && (
            <>
              {(totalPages || page + 10) > pageNumbers[pageNumbers.length - 1] + 1 && (
                <span className='text-gray-400 px-2'>...</span>
              )}
              <button
                onClick={() => goToPage(totalPages || page + 10)}
                className='flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:border-brand hover:text-brand hover:bg-pink-50 transition-all duration-200'
              >
                {totalPages || page + 10}
              </button>
            </>
          )}
        </>
      )}

      {/* Next Button */}
      <button
        onClick={add}
        disabled={!hasNextPage}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          !hasNextPage
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-600 hover:border-brand hover:text-brand hover:bg-pink-50'
        }`}
        aria-label="Next page"
      >
        <IoIosArrowForward className='text-lg' />
      </button>

      {/* Page Info */}
      <div className='ml-4 text-sm text-gray-500'>
        Page {page}
        {totalPages && ` of ${totalPages}`}
      </div>
    </div>
  );
}

export default Pagination;
