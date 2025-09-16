'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/use-intersection-observer';
import { ANIMATION_VARIANTS } from '../../constants/animation-variants';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof ANIMATION_VARIANTS;
  threshold?: number;
  triggerOnce?: boolean;
}

/**
 * Reusable animated section component that handles intersection observer logic
 */
export function AnimatedSection({ 
  children, 
  className = '', 
  variant = 'container',
  threshold = 0.1,
  triggerOnce = true 
}: AnimatedSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    triggerOnce
  });

  return (
    <motion.section
      ref={ref}
      className={className}
      variants={ANIMATION_VARIANTS[variant]}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
    >
      {children}
    </motion.section>
  );
}