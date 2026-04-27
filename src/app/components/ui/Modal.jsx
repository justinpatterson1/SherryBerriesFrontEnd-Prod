'use client';

import { useEffect, useRef } from 'react';
import { RxCross2 } from 'react-icons/rx';

/**
 * Accessible modal dialog with:
 * - role="dialog", aria-modal, aria-labelledby
 * - Focus trap (Tab/Shift+Tab cycles within modal)
 * - Escape key to close
 * - Focus restored to trigger element on close
 */
export default function Modal({ open, onClose, title, titleId = 'modal-title', children, className = '' }) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;

    // Focus first focusable element in dialog
    const t = setTimeout(() => {
      const focusables = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      focusables?.[0]?.focus();
    }, 0);

    const handleKey = e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', handleKey);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-4'
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className={`w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative ${className}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className='absolute top-3 right-3 text-2xl text-gray-600 hover:text-red-500 z-50'
          onClick={onClose}
          aria-label='Close dialog'
        >
          <RxCross2 />
        </button>
        {title && (
          <div className='mb-4'>
            <h2 id={titleId} className='text-lg sm:text-2xl font-semibold text-gray-800 text-center'>
              {title}
            </h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
