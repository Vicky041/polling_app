'use client';

import { memo } from 'react';
import { motion, MotionProps } from 'framer-motion';

// Memoized motion components for better performance
export const MemoizedMotionDiv = memo(motion.div);
export const MemoizedMotionH1 = memo(motion.h1);
export const MemoizedMotionH2 = memo(motion.h2);
export const MemoizedMotionP = memo(motion.p);
export const MemoizedMotionSection = memo(motion.section);

// Optimized animation variants
export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

// Performance-optimized image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const OptimizedImage = memo(({ src, alt, className, width, height }: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      style={{ contentVisibility: 'auto' }}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Reduced motion preferences
export const useReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Animation configuration based on user preferences
export const getAnimationConfig = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return {
    initial: prefersReducedMotion ? false : "hidden",
    animate: prefersReducedMotion ? false : "visible",
    transition: prefersReducedMotion ? { duration: 0 } : undefined
  };
};