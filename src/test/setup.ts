import '@testing-library/jest-dom';

// Polyfill window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill scrollTo
window.scrollTo = (() => {}) as unknown as typeof window.scrollTo;

// Stub Canvas 2D context: jsdom does not implement getContext without the
// native canvas package. Components must null-guard regardless, but the stub
// keeps full-App renders free of "Not implemented" console noise.
const noop = () => {};
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  configurable: true,
  value: () =>
    new Proxy(
      {},
      {
        get: (_target, prop) => {
          if (prop === 'canvas') return null;
          return typeof prop === 'string' ? noop : undefined;
        },
        set: () => true,
      }
    ),
});
