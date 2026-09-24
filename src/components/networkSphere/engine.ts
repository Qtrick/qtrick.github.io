/**
 * Imperative Canvas 2D engine for the hero network sphere.
 *
 * React owns mount/unmount, theme, and visibility. This engine owns rotation
 * state, pointer interaction, and the animation loop, so no React state
 * updates happen per frame. All DOM APIs are guarded so the logic remains
 * testable without a real 2D context (e.g. jsdom).
 */

import {
  buildLocalEdges,
  buildSphereNodes,
  projectPoint,
  rotatePoint,
  NEIGHBORS_PER_NODE,
  NODE_COUNT,
  type Rotation,
  type SphereEdge,
  type SphereNode,
} from './geometry';

export type SphereTheme = 'light' | 'dark';

export interface SphereEngineOptions {
  nodeCount?: number;
  /** Idle yaw speed, radians per second. */
  idleSpeedY?: number;
  /** Idle pitch speed, radians per second (tiny secondary drift). */
  idleSpeedX?: number;
  /** Radians of rotation per pixel of drag. */
  dragSensitivity?: number;
  theme?: SphereTheme;
  reducedMotion?: boolean;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

const THEME_COLORS: Record<SphereTheme, { node: RGB; edge: RGB }> = {
  // Ink-on-paper: charcoal nodes, whisper-thin neutral edges.
  light: { node: { r: 24, g: 26, b: 31 }, edge: { r: 24, g: 26, b: 31 } },
  dark: { node: { r: 232, g: 234, b: 238 }, edge: { r: 205, g: 210, b: 220 } },
};

/** Clamp for pitch so dragging never flips the sphere inside out. */
export const MAX_PITCH = 1.1;
/** Keyboard step, radians per arrow press. */
export const KEYBOARD_STEP = 0.12;
/** Hover pick radius, CSS pixels. */
export const HOVER_RADIUS = 14;

function rgba(c: RGB, a: number): string {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a.toFixed(3)})`;
}

export class SphereEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private nodes: SphereNode[];
  private edges: SphereEdge[];
  private rotation: Rotation = { x: 0.35, y: 0 };
  private velocity: Rotation = { x: 0, y: 0 };
  private idleWeight = 1;
  private dragging = false;
  private hover: { x: number; y: number } | null = null;
  private hoveredNode = -1;
  private idleSpeedY: number;
  private idleSpeedX: number;
  private dragSensitivity: number;
  private colors = THEME_COLORS.light;
  private reducedMotion: boolean;
  private visible = true;
  private rafId = 0;
  private running = false;
  private lastTime = 0;
  private lastPointer: { x: number; y: number } | null = null;
  private destroyed = false;

  constructor(canvas: HTMLCanvasElement, options: SphereEngineOptions = {}) {
    this.canvas = canvas;
    const ctx =
      typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null;
    this.ctx = ctx;
    const nodeCount = options.nodeCount ?? NODE_COUNT;
    this.nodes = buildSphereNodes(nodeCount);
    this.edges = buildLocalEdges(this.nodes, NEIGHBORS_PER_NODE);
    this.idleSpeedY = options.idleSpeedY ?? 0.055;
    this.idleSpeedX = options.idleSpeedX ?? 0.012;
    this.dragSensitivity = options.dragSensitivity ?? 0.005;
    this.colors = THEME_COLORS[options.theme ?? 'light'];
    this.reducedMotion = options.reducedMotion ?? false;
    this.syncDataset();
    this.attach();
    this.resize();
  }

  // -- public state -------------------------------------------------------

  getRotation(): Rotation {
    return { ...this.rotation };
  }

  isDragging(): boolean {
    return this.dragging;
  }

  isRunning(): boolean {
    return this.running;
  }

  getEdgeCount(): number {
    return this.edges.length;
  }

  getNodeCount(): number {
    return this.nodes.length;
  }

  // -- public controls ----------------------------------------------------

  /** Direct rotation, used by keyboard fallback. Redraws immediately. */
  rotateBy(dx: number, dy: number): void {
    this.rotation.y += dx;
    this.rotation.x = clampPitch(this.rotation.x + dy);
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.syncDataset();
    if (!this.running) this.draw();
  }

  setTheme(theme: SphereTheme): void {
    this.colors = THEME_COLORS[theme];
    if (!this.running) this.draw();
  }

  setReducedMotion(reduced: boolean): void {
    if (this.reducedMotion === reduced) return;
    this.reducedMotion = reduced;
    if (reduced) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.stop();
      this.draw();
    } else if (this.visible && !this.destroyed) {
      this.start();
    }
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    if (!visible) {
      this.stop();
      return;
    }
    if (this.destroyed) return;
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      this.stop();
      return;
    }
    if (this.reducedMotion) {
      this.draw();
      return;
    }
    this.start();
  }

  start(): void {
    if (this.running || this.destroyed || this.reducedMotion) return;
    if (typeof requestAnimationFrame !== 'function') return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.running = false;
    if (typeof cancelAnimationFrame === 'function' && this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = 0;
  }

  destroy(): void {
    this.destroyed = true;
    this.stop();
    this.detach();
  }

  /** Advance simulation by dt seconds without rendering. Testable seam. */
  step(dt: number): void {
    if (this.dragging) return;
    // Decaying release momentum.
    const decay = Math.exp(-4 * dt);
    this.rotation.x = clampPitch(this.rotation.x + this.velocity.x * dt);
    this.rotation.y += this.velocity.y * dt;
    this.velocity.x *= decay;
    this.velocity.y *= decay;
    if (Math.abs(this.velocity.x) < 0.0005) this.velocity.x = 0;
    if (Math.abs(this.velocity.y) < 0.0005) this.velocity.y = 0;
    // Idle rotation eases back in after release.
    this.idleWeight = Math.min(1, this.idleWeight + dt / 1.2);
    this.rotation.y += this.idleSpeedY * this.idleWeight * dt;
    this.rotation.x = clampPitch(
      this.rotation.x + this.idleSpeedX * this.idleWeight * dt
    );
  }

  // -- loop ---------------------------------------------------------------

  private frame = (t: number): void => {
    if (!this.running) return;
    const dt = Math.min(Math.max((t - this.lastTime) / 1000, 0), 0.05);
    this.lastTime = t;
    this.step(dt);
    this.draw();
    if (this.running && typeof requestAnimationFrame === 'function') {
      this.rafId = requestAnimationFrame(this.frame);
    }
  };

  // -- sizing ---------------------------------------------------------------

  resize = (): void => {
    const canvas = this.canvas;
    const rect =
      typeof canvas.getBoundingClientRect === 'function'
        ? canvas.getBoundingClientRect()
        : null;
    const cssSize = Math.max(
      1,
      Math.min(rect?.width ?? 0, rect?.height ?? 0) || 320
    );
    const dpr =
      typeof window !== 'undefined' && window.devicePixelRatio
        ? Math.min(window.devicePixelRatio, 2)
        : 1;
    const backing = Math.max(1, Math.round(cssSize * dpr));
    if (canvas.width !== backing || canvas.height !== backing) {
      canvas.width = backing;
      canvas.height = backing;
    }
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!this.running) this.draw();
  };

  // -- rendering ------------------------------------------------------------

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const canvas = this.canvas;
    const size = canvas.width > 0 ? canvas.width / this.dpr() : 320;
    const center = size / 2;
    const radius = size * 0.36;
    ctx.clearRect(0, 0, size, size);

    const projected = this.nodes.map((n) => {
      const rotated = rotatePoint(n, this.rotation);
      const p = projectPoint(rotated);
      return { ...p, sx: center + p.px * radius, sy: center + p.py * radius };
    });

    // Hover pick: nearest projected node within HOVER_RADIUS px.
    this.hoveredNode = -1;
    if (this.hover && !this.dragging) {
      let best = HOVER_RADIUS;
      for (let i = 0; i < projected.length; i++) {
        const dx = projected[i].sx - this.hover.x;
        const dy = projected[i].sy - this.hover.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < best) {
          best = d;
          this.hoveredNode = i;
        }
      }
    }

    // Edges far-first so near connections layer on top.
    const order = this.edges
      .map((e, i) => ({
        i,
        depth:
          (projected[e.a].depth + projected[e.b].depth) / 2,
      }))
      .sort((p, q) => p.depth - q.depth);
    ctx.lineWidth = 0.7;
    for (const { i } of order) {
      const e = this.edges[i];
      const a = projected[e.a];
      const b = projected[e.b];
      const depth = (a.depth + b.depth) / 2;
      const hot =
        this.hoveredNode === e.a || this.hoveredNode === e.b;
      const alpha = Math.min(0.5, (0.04 + depth * 0.14) * (hot ? 2 : 1));
      ctx.strokeStyle = rgba(this.colors.edge, alpha);
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    // Nodes far-first for correct depth layering.
    const nodeOrder = projected
      .map((p, i) => ({ i, depth: p.depth }))
      .sort((p, q) => p.depth - q.depth);
    for (const { i } of nodeOrder) {
      const p = projected[i];
      const hot = i === this.hoveredNode;
      const r = (1.1 + p.depth * 1.3) * (hot ? 1.7 : 1);
      const alpha = hot ? 1 : 0.3 + p.depth * 0.6;
      ctx.fillStyle = rgba(this.colors.node, alpha);
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private dpr(): number {
    if (typeof window !== 'undefined' && window.devicePixelRatio) {
      return Math.min(window.devicePixelRatio, 2);
    }
    return 1;
  }

  // -- interaction ----------------------------------------------------------

  private onPointerDown = (e: PointerEvent): void => {
    if (this.destroyed) return;
    this.dragging = true;
    this.idleWeight = 0;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.lastPointer = { x: e.clientX, y: e.clientY };
    try {
      this.canvas.setPointerCapture?.(e.pointerId);
    } catch {
      // setPointerCapture can throw for synthetic events; dragging still works.
    }
    this.canvas.classList.add('is-dragging');
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (this.destroyed) return;
    const rect = this.canvas.getBoundingClientRect();
    this.hover = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (!this.dragging || !this.lastPointer) {
      if (!this.running) this.draw();
      return;
    }
    const dx = e.clientX - this.lastPointer.x;
    const dy = e.clientY - this.lastPointer.y;
    this.lastPointer = { x: e.clientX, y: e.clientY };
    const stepY = dx * this.dragSensitivity;
    const stepX = dy * this.dragSensitivity;
    this.rotation.y += stepY;
    this.rotation.x = clampPitch(this.rotation.x + stepX);
    // Track release velocity with an exponential moving average.
    const dt = 1 / 60;
    const instX = stepX / dt;
    const instY = stepY / dt;
    // Cap fling speed so release never sends the sphere flying.
    const cap = 3;
    this.velocity.x = clampVelocity(
      0.75 * this.velocity.x + 0.25 * instX,
      cap
    );
    this.velocity.y = clampVelocity(
      0.75 * this.velocity.y + 0.25 * instY,
      cap
    );
    this.syncDataset();
    if (!this.running) this.draw();
  };

  private endDrag = (): void => {
    if (!this.dragging) return;
    this.dragging = false;
    this.lastPointer = null;
    this.canvas.classList.remove('is-dragging');
    // Idle rotation resumes gradually inside step(); keep current orientation.
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    const step = KEYBOARD_STEP;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.rotateBy(-step, 0);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.rotateBy(step, 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.rotateBy(0, -step);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.rotateBy(0, step);
    }
  };

  private onVisibilityChange = (): void => {
    if (typeof document === 'undefined') return;
    if (document.visibilityState === 'hidden') {
      this.stop();
    } else if (this.visible && !this.reducedMotion) {
      this.start();
    } else {
      this.draw();
    }
  };

  private attach(): void {
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.endDrag);
    this.canvas.addEventListener('pointercancel', this.endDrag);
    this.canvas.addEventListener('keydown', this.onKeyDown);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  private detach(): void {
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.endDrag);
    this.canvas.removeEventListener('pointercancel', this.endDrag);
    this.canvas.removeEventListener('keydown', this.onKeyDown);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  /** Mirror rotation into data attributes for tests/debugging (no re-render). */
  private syncDataset(): void {
    try {
      this.canvas.dataset.rx = this.rotation.x.toFixed(4);
      this.canvas.dataset.ry = this.rotation.y.toFixed(4);
    } catch {
      // dataset may be unavailable on stub canvases in tests.
    }
  }
}

function clampPitch(v: number): number {
  return Math.max(-MAX_PITCH, Math.min(MAX_PITCH, v));
}

function clampVelocity(v: number, cap: number): number {
  return Math.max(-cap, Math.min(cap, v));
}
