import { useEffect, useRef, useState } from 'react';

export interface ScrollRevealOptions {
  enabled?: boolean;
  onReveal?: () => void;
  rootMargin?: string;
  threshold?: number;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    enabled = true,
    onReveal,
    rootMargin = '50px 0px 50px 0px',
    threshold = 0.02,
  } = options;
  const ref = useRef<T | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!enabled || isRevealed) return;

    const node = ref.current;
    if (!node) return;

    // Check prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ) {
      setIsRevealed(true);
      onReveal?.();
      return;
    }

    // Fallback if IntersectionObserver is not available
    if (typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true);
      onReveal?.();
      return;
    }

    // If already in or near viewport when enabled, reveal
    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top <= vh + 60 && rect.bottom >= -60) {
      setIsRevealed(true);
      onReveal?.();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            onReveal?.();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [enabled, isRevealed, onReveal, rootMargin, threshold]);

  return { ref, isRevealed };
}
