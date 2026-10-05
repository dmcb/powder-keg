import type { Triplet } from "@react-three/cannon";

export const boardGravity: Triplet = [0, 0, -1];

export const cannonCoolDown = 800;
export const cannonballLifetime = 5000;

export const sailSpeed = 0.6;
export const reverseSailSpeedModifier = -0.25;
export const reverseSailTurnModifier = 0.5;
export const forwardSailTurnModifier = 1;
export const turnTorque = 5;

export const minSails = -1;
export const maxSails = 3;

// The board is a circle centred on the origin. Terrain falls away to seabed by
// radius 1 (see `lib/noise.ts`), leaving open water out to the border; √2 is
// the circle through the corners of the old square board.
export const boardRadius = Math.SQRT2;

// Ships are placed on the diagonals near the board's edge, facing the centre.
const spawn = (0.92 * boardRadius) / Math.SQRT2;
export const playerInitialPositions: Triplet[] = [
  [-spawn, spawn, 0],
  [spawn, -spawn, 0],
  [-spawn, -spawn, 0],
  [spawn, spawn, 0],
];

export const playerInitialRotations: Triplet[] = [
  [0, 0, (-3 * Math.PI) / 4],
  [0, 0, Math.PI / 4],
  [0, 0, -Math.PI / 4],
  [0, 0, (3 * Math.PI) / 4],
];

export const playerFlagColors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00];
