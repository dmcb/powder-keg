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

// Ships are placed at the four corners of the board, facing the centre.
export const playerInitialPositions: Triplet[] = [
  [-0.92, 0.92, 0],
  [0.92, -0.92, 0],
  [-0.92, -0.92, 0],
  [0.92, 0.92, 0],
];

export const playerInitialRotations: Triplet[] = [
  [0, 0, (-3 * Math.PI) / 4],
  [0, 0, Math.PI / 4],
  [0, 0, -Math.PI / 4],
  [0, 0, (3 * Math.PI) / 4],
];

export const playerFlagColors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00];
