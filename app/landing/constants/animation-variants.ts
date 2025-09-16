/**
 * Shared animation variants for consistent motion across landing page components
 */

export const ANIMATION_VARIANTS = {
  // Container animations with staggered children
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  },

  // Standard item animations
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  },

  // Fade in animation
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 }
    }
  },

  // Scale animation for cards
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 }
    }
  },

  // Slide up animation
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }
} as const;

export const FLOATING_ANIMATION = {
  y: [0, -10, 0],
  rotate: [0, 5, 0]
};

export const FLOATING_ANIMATION_REVERSE = {
  y: [0, 10, 0],
  rotate: [0, -5, 0]
};