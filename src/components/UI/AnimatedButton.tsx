import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  fullWidth?: boolean;
  gradient?: boolean;
}

const variants = {
  primary: {
    base: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-transparent'
  },
  secondary: {
    base: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200 hover:border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600',
    gradient: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 border-transparent dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 dark:text-white'
  },
  success: {
    base: 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 hover:border-emerald-600',
    gradient: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-transparent'
  },
  warning: {
    base: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 hover:border-amber-600',
    gradient: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-transparent'
  },
  danger: {
    base: 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500 hover:border-rose-600',
    gradient: 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white border-transparent'
  },
  ghost: {
    base: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent hover:border-gray-200 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-700',
    gradient: 'bg-transparent hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 border-transparent dark:hover:from-gray-800 dark:hover:to-gray-700 dark:text-gray-300'
  }
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  fullWidth = false,
  gradient = false,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const variantClasses = gradient ? variants[variant].gradient : variants[variant].base;
  const sizeClasses = sizes[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.02,
        y: disabled || loading ? 0 : -1
      }}
      whileTap={{ 
        scale: disabled || loading ? 1 : 0.98,
        y: disabled || loading ? 0 : 0
      }}
      animate={{
        scale: isPressed ? 0.95 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center font-semibold rounded-xl border
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-soft hover:shadow-medium
        ${variantClasses}
        ${sizeClasses}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl"
          >
            <Loader2 size={16} className="animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button content */}
      <motion.div
        animate={{ opacity: loading ? 0 : 1 }}
        className="flex items-center space-x-2"
      >
        {icon && iconPosition === 'left' && (
          <motion.span
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
        
        <span>{children}</span>
        
        {icon && iconPosition === 'right' && (
          <motion.span
            initial={{ rotate: 0 }}
            whileHover={{ rotate: -5 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
      </motion.div>

      {/* Ripple effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-white rounded-xl pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};