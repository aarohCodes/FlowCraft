import React from 'react';
import { motion } from 'framer-motion';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
  gradient?: boolean;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
}

const variants = {
  h1: 'text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight',
  h2: 'text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight',
  h3: 'text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight',
  h4: 'text-xl md:text-2xl lg:text-3xl leading-tight tracking-tight',
  h5: 'text-lg md:text-xl lg:text-2xl leading-tight tracking-tight',
  h6: 'text-base md:text-lg lg:text-xl leading-tight tracking-tight',
  body1: 'text-base leading-relaxed',
  body2: 'text-sm leading-relaxed',
  caption: 'text-xs leading-relaxed',
  overline: 'text-xs uppercase tracking-wider leading-relaxed'
};

const weights = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold'
};

const defaultWeights = {
  h1: 'bold',
  h2: 'bold',
  h3: 'bold',
  h4: 'semibold',
  h5: 'semibold',
  h6: 'semibold',
  body1: 'normal',
  body2: 'normal',
  caption: 'medium',
  overline: 'semibold'
} as const;

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  children,
  className = '',
  animate = false,
  delay = 0,
  gradient = false,
  weight
}) => {
  const Component = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';
  const variantClasses = variants[variant];
  const weightClass = weights[weight || defaultWeights[variant]];
  
  const baseClasses = `
    ${variantClasses}
    ${weightClass}
    ${gradient 
      ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
      : 'text-gray-900 dark:text-white'
    }
    ${className}
  `;

  if (!animate) {
    return React.createElement(Component, { className: baseClasses }, children);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      {React.createElement(Component, { className: baseClasses }, children)}
    </motion.div>
  );
};