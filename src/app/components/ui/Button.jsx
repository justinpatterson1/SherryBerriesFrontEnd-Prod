'use client';

import React from 'react';
import { FiLoader, FiCheck, FiAlertCircle } from 'react-icons/fi';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  success = false,
  error = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles
  const variants = {
    primary: 'bg-brand text-white hover:bg-pink-600 focus:ring-brand shadow-sm hover:shadow-md',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border-2 border-brand text-brand hover:bg-brand hover:text-white focus:ring-brand',
    ghost: 'text-brand hover:bg-pink-50 focus:ring-brand',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  // State styles
  const getStateStyles = () => {
    if (success) return 'bg-green-600 text-white cursor-default';
    if (error) return 'bg-red-600 text-white cursor-default';
    if (loading) return 'cursor-wait';
    return '';
  };

  // Combine all styles
  const buttonStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${getStateStyles()}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  // Render icon based on state. Supports both component refs (e.g. `icon={FiTruck}`)
  // and React elements (e.g. `icon={<FiTruck />}`).
  const renderIcon = () => {
    if (loading) {
      return <FiLoader className="animate-spin" />;
    }
    if (success) {
      return <FiCheck />;
    }
    if (error) {
      return <FiAlertCircle />;
    }
    if (icon) {
      const IconCmp = icon;
      return typeof icon === 'function' ? <IconCmp /> : icon;
    }
    return null;
  };

  // Icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-4 w-4';
      case 'lg': return 'h-5 w-5';
      case 'xl': return 'h-6 w-6';
      default: return 'h-4 w-4';
    }
  };

  const iconElement = renderIcon();
  const iconSize = getIconSize();

  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {iconElement && iconPosition === 'left' && (
        <span className={`mr-2 ${iconSize}`}>
          {React.cloneElement(iconElement, { className: iconSize })}
        </span>
      )}
      
      <span className={loading ? 'opacity-75' : ''}>
        {children}
      </span>
      
      {iconElement && iconPosition === 'right' && (
        <span className={`ml-2 ${iconSize}`}>
          {React.cloneElement(iconElement, { className: iconSize })}
        </span>
      )}
    </button>
  );
};

// Specialized button components
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;

// Loading button component
export const LoadingButton = ({ loading, loadingText = 'Loading...', children, ...props }) => (
  <Button loading={loading} {...props}>
    {loading ? loadingText : children}
  </Button>
);

// Icon button component
export const IconButton = ({ icon, size = 'md', ...props }) => {
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  return (
    <Button
      className="p-2"
      {...props}
    >
      {React.cloneElement(icon, { className: iconSizes[size] })}
    </Button>
  );
};

export default Button;
