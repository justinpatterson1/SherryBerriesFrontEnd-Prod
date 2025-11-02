'use client';

import React from 'react';
import Link from 'next/link';
import { useSkipNavigation } from '../hooks/useFocusManagement';

const SkipNavigation = () => {
  const { skipToMain, skipToContent } = useSkipNavigation();

  return (
    <div className="sr-only focus-within:not-sr-only">
      <nav className="fixed top-0 left-0 z-50 bg-[#EA4492] text-white p-2">
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={skipToMain}
              className="px-4 py-2 bg-white text-[#EA4492] rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Skip to main content
            </button>
          </li>
          <li>
            <Link
              href="#navigation"
              className="px-4 py-2 bg-white text-[#EA4492] rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Skip to navigation
            </Link>
          </li>
          <li>
            <Link
              href="#search"
              className="px-4 py-2 bg-white text-[#EA4492] rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Skip to search
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SkipNavigation;
