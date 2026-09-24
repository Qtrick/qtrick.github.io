import { useEffect, useRef, useState } from 'react';

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Check prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ) {
      setIsRevealed(true);
      return;
    }

    // Fallback if IntersectionObserver is not available
    if (typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true);
      return;
    }

    // If already in or near viewport on mount, reveal immediately
    const rect = node.getBoundingClientRect();
    if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 80) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.02,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, isRevealed };
}
