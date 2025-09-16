import { ReactNode } from 'react';

/**
 * Feature interface for the features section
 */
export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  details: string;
  color: string;
}

/**
 * Testimonial interface for the testimonials section
 */
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

/**
 * Stats interface for displaying metrics
 */
export interface Stat {
  value: string;
  label: string;
}

/**
 * Poll option interface for demo poll
 */
export interface PollOption {
  label: string;
  percentage: number;
  color: string;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration: number;
  repeat: number;
  ease: string;
  delay?: number;
}