/**
 * Deterministic spherical geometry for the hero network sphere.
 *
 * All functions here are pure and DOM-free so they can be unit tested.
 * No Math.random() anywhere: the same inputs always produce the same layout.
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SphereNode extends Vec3 {
  id: number;
}

export interface SphereEdge {
  a: number;
  b: number;
}

export interface Rotation {
  /** Rotation around the X axis, radians. */
  x: number;
  /** Rotation around the Y axis, radians. */
  y: number;
}

export interface ProjectedPoint {
  /** 2D canvas offset from the sphere center, in units of sphere radius. */
  px: number;
  py: number;
  /** Depth in [0, 1]: 0 = far side, 1 = near side. */
  depth: number;
}

/** Number of nodes in the hero sphere. */
export const NODE_COUNT = 72;

/** Each node connects to this many nearest neighbors (deduplicated). */
export const NEIGHBORS_PER_NODE = 2;

/**
 * Safety cap on edge length (chord on the unit sphere). Nearest-neighbor
 * edges are far below this; it only guards against degenerate long lines.
 */
export const MAX_EDGE_LENGTH = 0.8;

/** Weak perspective strength. Keeps the sphere diagrammatic, not fish-eyed. */
export const PERSPECTIVE = 0.25;

/**
 * Deterministic pseudo-random value in [0, 1) derived from an integer seed.
 * A small integer hash, so node layout is stable across renders and machines.
 */
export function hash01(seed: number): number {
  let h = (seed * 2654435761) >>> 0;
  h ^= h >>> 15;
  h = (h * 2246822519) >>> 0;
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/**
 * Uniform deterministic point distribution over the unit sphere using the
 * Fibonacci lattice. Point `i` is always at the same position.
 */
export function buildSphereNodes(count: number = NODE_COUNT): SphereNode[] {
  const nodes: SphereNode[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    // y runs pole to pole; radiusJitter keeps the surface slightly organic.
    const y = 1 - (2 * (i + 0.5)) / count;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    const jitter = 1 + (hash01(i + 1) - 0.5) * 0.08;
    const x = Math.cos(theta) * ringRadius * jitter;
    const z = Math.sin(theta) * ringRadius * jitter;
    const len = Math.sqrt(x * x + y * y + z * z);
    nodes.push({ id: i, x: x / len, y: y / len, z: z / len });
  }
  return nodes;
}

function distance3(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Deterministic local graph: each node links to its nearest neighbors on the
 * sphere. Edges stay local, so the result reads as a mesh wrapped around a
 * globe rather than a hairball of crossing lines.
 */
export function buildLocalEdges(
  nodes: SphereNode[],
  neighborsPerNode: number = NEIGHBORS_PER_NODE,
  maxLength: number = MAX_EDGE_LENGTH
): SphereEdge[] {
  const seen = new Set<string>();
  const edges: SphereEdge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const ranked: Array<{ index: number; dist: number }> = [];
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue;
      ranked.push({ index: j, dist: distance3(nodes[i], nodes[j]) });
    }
    ranked.sort((p, q) => p.dist - q.dist);
    for (let k = 0; k < Math.min(neighborsPerNode, ranked.length); k++) {
      const j = ranked[k].index;
      if (ranked[k].dist > maxLength) continue;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a: Math.min(i, j), b: Math.max(i, j) });
    }
  }
  return edges;
}

/** Rotate a point: yaw around Y, then pitch around X. */
export function rotatePoint(p: Vec3, rot: Rotation): Vec3 {
  const cosY = Math.cos(rot.y);
  const sinY = Math.sin(rot.y);
  const x1 = p.x * cosY + p.z * sinY;
  const z1 = -p.x * sinY + p.z * cosY;
  const cosX = Math.cos(rot.x);
  const sinX = Math.sin(rot.x);
  const y2 = p.y * cosX - z1 * sinX;
  const z2 = p.y * sinX + z1 * cosX;
  return { x: x1, y: y2, z: z2 };
}

/**
 * Project a rotated unit-sphere point to 2D with weak perspective.
 * +z faces the viewer. Returns offsets in units of sphere radius.
 */
export function projectPoint(
  p: Vec3,
  perspective: number = PERSPECTIVE
): ProjectedPoint {
  const depth = (p.z + 1) / 2;
  // Weak perspective: near side slightly expanded, far side slightly compressed.
  const s = 1 / (1 + perspective * (0.5 - depth));
  return { px: p.x * s, py: p.y * s, depth };
}
