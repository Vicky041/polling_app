'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Memoize the callback to prevent unnecessary re-renders
  const handleIntersection = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      setIsIntersecting(entry.isIntersecting);
      
      if (entry.isIntersecting && options.triggerOnce && observerRef.current) {
        observerRef.current.unobserve(entry.target);
      }
    },
    [options.triggerOnce]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === 'undefined') return;

    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      // Fallback for browsers that don't support IntersectionObserver
      setIsIntersecting(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      handleIntersection,
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleIntersection, options.threshold, options.rootMargin]);

  return { ref, isIntersecting };
}