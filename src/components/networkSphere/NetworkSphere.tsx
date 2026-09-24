import React, { useEffect, useRef } from 'react';
import { SphereEngine, type SphereTheme } from './engine';
import './NetworkSphere.css';

function currentTheme(): SphereTheme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  );
}

/**
 * Interactive dotted network sphere for the hero.
 * Decorative/experiential: a quiet constellation wrapped around a globe.
 * Canvas owns all animation state; React only handles lifecycle and theme.
 */
export const NetworkSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const engine = new SphereEngine(canvas, {
      theme: currentTheme(),
      reducedMotion: prefersReducedMotion(),
    });

    // Pause when scrolled off-screen; resume when visible again.
    let inView = true;
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          engine.setVisible(inView);
        },
        { threshold: 0 }
      );
      observer.observe(wrap);
    } else {
      engine.setVisible(true);
    }

    // Follow light/dark theme switches.
    const themeObserver =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => engine.setTheme(currentTheme()))
        : null;
    themeObserver?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Keep the backing store matched to the displayed size (DPR capped at 2).
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => engine.resize())
        : null;
    if (resizeObserver) resizeObserver.observe(canvas);

    const onVisibility = () => engine.setVisible(inView);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      resizeObserver?.disconnect();
      themeObserver?.disconnect();
      observer?.disconnect();
      engine.destroy();
    };
  }, []);

  return (
    <div ref={wrapRef} className="network-sphere">
      <canvas
        ref={canvasRef}
        className="network-sphere-canvas"
        tabIndex={0}
        aria-label="Interactive network sphere. Drag to rotate. Use arrow keys to rotate."
      />
      <p className="sphere-hint" aria-hidden="true">
        drag to rotate
      </p>
    </div>
  );
};

export default NetworkSphere;
