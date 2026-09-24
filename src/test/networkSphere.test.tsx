import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NetworkSphere } from '../components/networkSphere/NetworkSphere';
import { SphereEngine } from '../components/networkSphere/engine';
import {
  buildLocalEdges,
  buildSphereNodes,
  hash01,
  projectPoint,
  rotatePoint,
  MAX_EDGE_LENGTH,
  NODE_COUNT,
} from '../components/networkSphere/geometry';

// -- geometry ---------------------------------------------------------------

describe('sphere geometry', () => {
  it('builds a deterministic set of unit-sphere nodes', () => {
    const a = buildSphereNodes();
    const b = buildSphereNodes();
    expect(a).toHaveLength(NODE_COUNT);
    expect(a).toEqual(b);
    for (const n of a) {
      const len = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z);
      expect(len).toBeCloseTo(1, 5);
      expect([n.x, n.y, n.z].every(Number.isFinite)).toBe(true);
    }
    // Covers both hemispheres, not a flat disc.
    expect(a.some((n) => n.z > 0.5)).toBe(true);
    expect(a.some((n) => n.z < -0.5)).toBe(true);
  });

  it('hash01 is deterministic and bounded', () => {
    expect(hash01(7)).toBe(hash01(7));
    expect(hash01(7)).toBeGreaterThanOrEqual(0);
    expect(hash01(7)).toBeLessThan(1);
    expect(hash01(8)).not.toBe(hash01(7));
  });

  it('builds a restrained local graph without self-loops or duplicates', () => {
    const nodes = buildSphereNodes();
    const edges = buildLocalEdges(nodes);
    expect(edges.length).toBeGreaterThan(nodes.length / 2);
    expect(edges.length).toBeLessThan(nodes.length * 2);
    const seen = new Set<string>();
    for (const e of edges) {
      expect(e.a).not.toBe(e.b);
      expect(e.a).toBeGreaterThanOrEqual(0);
      expect(e.b).toBeLessThan(nodes.length);
      const key = `${e.a}-${e.b}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
      const dx = nodes[e.a].x - nodes[e.b].x;
      const dy = nodes[e.a].y - nodes[e.b].y;
      const dz = nodes[e.a].z - nodes[e.b].z;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      expect(len).toBeLessThanOrEqual(MAX_EDGE_LENGTH);
    }
  });

  it('rotation is identity at zero and periodic over a full turn', () => {
    const p = { x: 0.3, y: -0.5, z: 0.8 };
    const id = rotatePoint(p, { x: 0, y: 0 });
    expect(id.x).toBeCloseTo(p.x, 10);
    expect(id.y).toBeCloseTo(p.y, 10);
    expect(id.z).toBeCloseTo(p.z, 10);
    const full = rotatePoint(p, { x: 0, y: Math.PI * 2 });
    expect(full.x).toBeCloseTo(p.x, 8);
    expect(full.y).toBeCloseTo(p.y, 8);
    expect(full.z).toBeCloseTo(p.z, 8);
  });

  it('projection maps depth and keeps perspective subtle', () => {
    const near = projectPoint({ x: 0, y: 0, z: 1 });
    const far = projectPoint({ x: 0, y: 0, z: -1 });
    expect(near.depth).toBe(1);
    expect(far.depth).toBe(0);
    expect(near.px).toBe(0);
    expect(near.py).toBe(0);
    // Weak perspective: near side modestly expanded, never exaggerated.
    const nearScale = projectPoint({ x: 0.5, y: 0, z: 1 }).px / 0.5;
    const farScale = projectPoint({ x: 0.5, y: 0, z: -1 }).px / 0.5;
    expect(nearScale).toBeGreaterThan(1);
    expect(farScale).toBeLessThan(1);
    expect(nearScale / farScale).toBeLessThan(1.6);
  });
});

// -- engine test harness -----------------------------------------------------

function stubContext() {
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    setTransform: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
  };
}

function stubAnimationFrame() {
  const callbacks = new Map<number, FrameRequestCallback>();
  let nextId = 1;
  const raf = vi.fn((cb: FrameRequestCallback) => {
    const id = nextId++;
    callbacks.set(id, cb);
    return id;
  });
  const cancel = vi.fn((id: number) => {
    callbacks.delete(id);
  });
  vi.stubGlobal('requestAnimationFrame', raf);
  vi.stubGlobal('cancelAnimationFrame', cancel);
  return { raf, cancel, callbacks };
}

/**
 * jsdom does not implement PointerEvent with clientX, so synthesize plain
 * events with coordinates assigned. The engine only reads clientX/clientY.
 */
function dispatchPointer(
  target: Element,
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
  x: number,
  y: number
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  (event as unknown as Record<string, unknown>).clientX = x;
  (event as unknown as Record<string, unknown>).clientY = y;
  (event as unknown as Record<string, unknown>).pointerId = 1;
  target.dispatchEvent(event);
}

describe('sphere engine', () => {
  let getContextSpy: { mockRestore: () => void };

  beforeEach(() => {
    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(stubContext() as unknown as CanvasRenderingContext2D);
  });

  afterEach(() => {
    getContextSpy.mockRestore();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('constructs without a real 2D context and reports counts', () => {
    const canvas = document.createElement('canvas');
    const engine = new SphereEngine(canvas, { reducedMotion: true });
    expect(engine.getNodeCount()).toBe(NODE_COUNT);
    expect(engine.getEdgeCount()).toBeGreaterThan(0);
    engine.destroy();
  });

  it('idle step advances rotation on time, not per frame', () => {
    const canvas = document.createElement('canvas');
    const engine = new SphereEngine(canvas, {
      reducedMotion: true,
      idleSpeedY: 0.05,
      idleSpeedX: 0,
    });
    const before = engine.getRotation();
    engine.step(1);
    const after = engine.getRotation();
    expect(after.y - before.y).toBeCloseTo(0.05, 5);
    engine.destroy();
  });

  it('reduced-motion engine never schedules animation frames', () => {
    const { raf } = stubAnimationFrame();
    const canvas = document.createElement('canvas');
    const engine = new SphereEngine(canvas, { reducedMotion: true });
    engine.start();
    engine.setVisible(true);
    expect(raf).not.toHaveBeenCalled();
    expect(engine.isRunning()).toBe(false);
    engine.destroy();
  });

  it('keyboard arrows update rotation directly', () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const engine = new SphereEngine(canvas, { reducedMotion: true });
    const before = engine.getRotation();
    canvas.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(engine.getRotation().y).toBeGreaterThan(before.y);
    canvas.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    expect(engine.getRotation().x).toBeGreaterThan(before.x);
    engine.destroy();
    canvas.remove();
  });

  it('pointer drag rotates around the center and release preserves orientation', () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const engine = new SphereEngine(canvas, { reducedMotion: true });
    const start = engine.getRotation();

    dispatchPointer(canvas, 'pointerdown', 100, 100);
    expect(engine.isDragging()).toBe(true);
    dispatchPointer(canvas, 'pointermove', 140, 120);
    const mid = engine.getRotation();
    expect(mid.y).toBeGreaterThan(start.y);
    expect(mid.x).toBeGreaterThan(start.x);

    dispatchPointer(canvas, 'pointerup', 140, 120);
    expect(engine.isDragging()).toBe(false);
    // Release does not snap back: orientation is preserved exactly.
    expect(engine.getRotation()).toEqual(mid);
    engine.destroy();
    canvas.remove();
  });

  it('release momentum decays instead of flying', () => {
    const canvas = document.createElement('canvas');
    const engine = new SphereEngine(canvas, { reducedMotion: true });
    dispatchPointer(canvas, 'pointerdown', 0, 0);
    dispatchPointer(canvas, 'pointermove', 60, 0);
    dispatchPointer(canvas, 'pointerup', 60, 0);
    const atRelease = engine.getRotation().y;
    // Simulate real frames: 5 seconds at 60fps.
    for (let i = 0; i < 300; i++) engine.step(1 / 60);
    const drift = Math.abs(engine.getRotation().y - atRelease);
    // Capped fling velocity with exponential decay stays subtle
    // (momentum under ~1 rad plus ~0.3 rad of resumed idle drift).
    expect(drift).toBeLessThan(2);
    engine.destroy();
  });

  it('cleanup cancels frames and detaches listeners', () => {
    const { raf, cancel } = stubAnimationFrame();
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const engine = new SphereEngine(canvas, {});
    engine.start();
    expect(raf).toHaveBeenCalled();
    expect(engine.isRunning()).toBe(true);
    engine.destroy();
    expect(engine.isRunning()).toBe(false);
    expect(cancel).toHaveBeenCalled();
    dispatchPointer(canvas, 'pointerdown', 0, 0);
    expect(engine.isDragging()).toBe(false);
    canvas.remove();
  });

  it('offscreen visibility stops the loop and return resumes it', () => {
    const { raf } = stubAnimationFrame();
    const canvas = document.createElement('canvas');
    const engine = new SphereEngine(canvas, {});
    engine.start();
    const calls = raf.mock.calls.length;
    engine.setVisible(false);
    expect(engine.isRunning()).toBe(false);
    engine.setVisible(true);
    expect(raf.mock.calls.length).toBeGreaterThan(calls);
    engine.destroy();
  });
});

// -- component ----------------------------------------------------------------

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  target: Element | null = null;
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element) {
    this.target = target;
  }

  unobserve() {}

  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting, target: this.target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

describe('NetworkSphere component', () => {
  let getContextSpy: { mockRestore: () => void };

  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(stubContext() as unknown as CanvasRenderingContext2D);
  });

  afterEach(() => {
    getContextSpy.mockRestore();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders a labeled canvas and a subtle hint', () => {
    render(<NetworkSphere />);
    const canvas = screen.getByLabelText(
      /Interactive network sphere. Drag to rotate/i
    );
    expect(canvas.tagName).toBe('CANVAS');
    expect(screen.getByText('drag to rotate')).toBeInTheDocument();
  });

  it('canvas is keyboard-focusable with arrow controls', () => {
    render(<NetworkSphere />);
    const canvas = screen.getByLabelText(/Interactive network sphere/i);
    expect(canvas).toHaveAttribute('tabindex', '0');
    const before = canvas.getAttribute('data-ry');
    fireEvent.keyDown(canvas, { key: 'ArrowRight' });
    expect(canvas.getAttribute('data-ry')).not.toBe(before);
  });

  it('reduced-motion produces a static rendering with no frame loop', () => {
    const { raf } = stubAnimationFrame();
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList
    );
    render(<NetworkSphere />);
    expect(
      screen.getByLabelText(/Interactive network sphere/i)
    ).toBeInTheDocument();
    expect(raf).not.toHaveBeenCalled();
    // Drag interaction still available in static mode.
    const canvas = screen.getByLabelText(/Interactive network sphere/i);
    const before = canvas.getAttribute('data-ry');
    dispatchPointer(canvas, 'pointerdown', 50, 50);
    dispatchPointer(canvas, 'pointermove', 80, 50);
    expect(canvas.getAttribute('data-ry')).not.toBe(before);
    dispatchPointer(canvas, 'pointerup', 80, 50);
  });

  it('pauses rendering when scrolled off-screen', () => {
    const { cancel } = stubAnimationFrame();
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    render(<NetworkSphere />);
    expect(MockIntersectionObserver.instances).toHaveLength(1);
    const observer = MockIntersectionObserver.instances[0];
    act(() => observer.trigger(true));
    act(() => observer.trigger(false));
    expect(cancel).toHaveBeenCalled();
  });

  it('unmount disconnects observers and stops the loop', () => {
    const { cancel } = stubAnimationFrame();
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    const { unmount } = render(<NetworkSphere />);
    const observer = MockIntersectionObserver.instances[0];
    act(() => observer.trigger(true));
    unmount();
    expect(observer.disconnect).toHaveBeenCalled();
    expect(cancel).toHaveBeenCalled();
  });
});
