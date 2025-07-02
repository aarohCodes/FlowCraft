import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  delay?: number;
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
}

const variants = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50',
  elevated: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-large',
  bordered: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
};

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  hover = true,
  clickable = false,
  onClick,
  delay = 0,
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={hover ? { 
        y: -4,
        scale: 1.01,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={clickable ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        relative rounded-2xl transition-all duration-300 ease-out
        ${variants[variant]}
        ${hover ? 'shadow-soft hover:shadow-medium' : 'shadow-soft'}
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Hover glow effect */}
      {hover && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle border animation on hover */}
      {hover && (
        <motion.div
          className="absolute inset-0 rounded-2xl border border-blue-500/20 opacity-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};