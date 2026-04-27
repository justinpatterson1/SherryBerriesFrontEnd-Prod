import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

// Mock next/image as a plain <img> tag for tests
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, ...props }) =>
    React.createElement('img', { src, alt, width, height, ...props })
}));

// Mock next/link as plain <a>
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }) =>
    React.createElement('a', { href, ...props }, children)
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Stub matchMedia (used by some libraries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// Stub IntersectionObserver (used by framer-motion's useInView, etc.)
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Provide URL.createObjectURL / revokeObjectURL stubs
if (typeof URL.createObjectURL === 'undefined') {
  URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  URL.revokeObjectURL = vi.fn();
}
