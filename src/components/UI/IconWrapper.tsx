import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface IconWrapperProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  animate?: boolean;
  hover?: boolean;
  color?: string;
  background?: string;
  rounded?: boolean;
  padding?: number;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  icon: Icon,
  size = 20,
  className = '',
  animate = true,
  hover = true,
  color,
  background,
  rounded = false,
  padding = 0
}) => {
  const iconElement = <Icon size={size} className={color || 'currentColor'} />;

  if (!animate) {
    return (
      <div 
        className={`${background || ''} ${rounded ? 'rounded-lg' : ''} ${className}`}
        style={{ padding: padding > 0 ? `${padding}px` : undefined }}
      >
        {iconElement}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={hover ? { 
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={hover ? { 
        scale: 0.95,
        transition: { duration: 0.1 }
      } : undefined}
      className={`
        inline-flex items-center justify-center
        ${background || ''}
        ${rounded ? 'rounded-lg' : ''}
        ${className}
      `}
      style={{ padding: padding > 0 ? `${padding}px` : undefined }}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        {iconElement}
      </motion.div>
    </motion.div>
  );
};