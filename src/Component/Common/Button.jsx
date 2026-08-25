import React from 'react';

const Button = ({
  children = 'Create',
  onClick,
  type = 'button',
  className = '',
  variant = 'primary',
  disabled = false,
  ...props
}) => {
  const baseStyle = "px-4 py-2 font-medium rounded-lg shadow-sm transition duration-150 ease-in-out text-sm flex items-center justify-center gap-1.5";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-300 text-gray-800",
    dark: "bg-black hover:bg-gray-800 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    edit: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${selectedVariant} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
