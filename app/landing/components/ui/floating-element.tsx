'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FLOATING_ANIMATION, FLOATING_ANIMATION_REVERSE } from '../../constants/animation-variants';
import { ANIMATION_VARIANTS } from '../../constants/animation-variants';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  duration?: number;
  delay?: number;
}

/**
 * Reusable floating animation component for decorative elements
 */
export function FloatingElement({ 
  children, 
  className = '', 
  reverse = false,
  duration = 3,
  delay = 0
}: FloatingElementProps) {
  const animation = reverse ? FLOATING_ANIMATION_REVERSE : FLOATING_ANIMATION;
  
  return (
    <motion.div 
      className={className}
      variants={ANIMATION_VARIANTS.item}
      animate={{
        y: animation.y,
        rotate: animation.rotate
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
}