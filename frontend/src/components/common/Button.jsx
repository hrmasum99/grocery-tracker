import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '', 
  icon: Icon,
  loading = false,
  disabled = false
}) => {
  const baseStyles = 'font-medium rounded-lg transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'text-red-600 hover:text-red-800',
    ghost: 'bg-white text-gray-700 hover:bg-gray-100',
  };
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <Loader2 className="animate-spin mr-2" size={18} />
      ) : Icon ? (
        <Icon size={18} className="mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;