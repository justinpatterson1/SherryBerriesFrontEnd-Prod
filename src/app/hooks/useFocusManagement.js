import { useEffect, useRef, useCallback } from 'react';

// Hook for managing focus within a component
export const useFocusManagement = () => {
  const focusableElements = useRef([]);
  const containerRef = useRef(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors));
  }, []);

  // Trap focus within the container
  const trapFocus = useCallback((event) => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [getFocusableElements]);

  // Focus first element in the container
  const focusFirst = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [getFocusableElements]);

  // Focus last element in the container
  const focusLast = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [getFocusableElements]);

  // Focus specific element by selector
  const focusElement = useCallback((selector) => {
    if (!containerRef.current) return;
    const element = containerRef.current.querySelector(selector);
    if (element) {
      element.focus();
    }
  }, []);

  return {
    containerRef,
    trapFocus,
    focusFirst,
    focusLast,
    focusElement,
    getFocusableElements
  };
};

// Hook for managing focus when modals open/close
export const useModalFocus = (isOpen) => {
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement;
      
      // Focus the modal after it opens
      const timer = setTimeout(() => {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const firstFocusable = modal.querySelector('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);
};

// Hook for managing focus on route changes
export const useRouteFocus = () => {
  const focusMainContent = useCallback(() => {
    const timer = setTimeout(() => {
      const main = document.querySelector('main');
      if (main) {
        // Focus the main content area
        main.setAttribute('tabindex', '-1');
        main.focus();
        main.removeAttribute('tabindex');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { focusMainContent };
};

// Hook for skip navigation
export const useSkipNavigation = () => {
  const skipToMain = useCallback(() => {
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      main.removeAttribute('tabindex');
    }
  }, []);

  const skipToContent = useCallback(() => {
    const content = document.querySelector('[role="main"], main, .main-content');
    if (content) {
      content.setAttribute('tabindex', '-1');
      content.focus();
      content.removeAttribute('tabindex');
    }
  }, []);

  return { skipToMain, skipToContent };
};
