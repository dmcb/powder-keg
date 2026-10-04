import { Vector2 } from "three";
import { createNoise2D, NoiseFunction2D } from "simplex-noise";
import Alea from "aleaprng";

/** The inputs that fully determine the terrain's height field. */
export type TerrainParams = {
  seed: string;
  amplitude: number;
  frequency: number;
  octaves: number;
  gradientEdge: number;
};

/**
 * Terrain height at any board position, using the same seeded noise that
 * `Terrain` builds its mesh from (a fresh PRNG for the seed feeds the noise).
 */
export function createTerrainHeight(params: TerrainParams) {
  const noise2D = createNoise2D(new Alea(params.seed));
  return (x: number, y: number) =>
    baseNoise(
      noise2D,
      params.amplitude,
      params.frequency,
      params.octaves,
      params.gradientEdge,
      x,
      y,
    );
}

export default function baseNoise(
  noise2D: NoiseFunction2D,
  amplitude: number,
  frequency: number,
  octaves: number,
  gradientEdge: number,
  x: number,
  y: number,
) {
  // Generate noise
  const position = new Vector2(x, y);
  let adjustedAmp = amplitude;
  let adjustedFreq = frequency;
  let value = 0;
  for (let i = 0; i < octaves; i++) {
    value += adjustedAmp * noise2D(x * adjustedFreq, y * adjustedFreq);
    adjustedAmp *= 0.5;
    adjustedFreq *= 2;
  }

  // Drop off the edges
  let gradient = 1;
  let dropoff = 0.5;
  let closenessToEdge = 0;
  const distance = position.distanceTo(new Vector2(0, 0));
  if (distance - gradientEdge > 0) {
    closenessToEdge = Math.min(
      1,
      (distance - gradientEdge) / (1 - gradientEdge),
    );
  }
  dropoff *= closenessToEdge;
  gradient = Math.pow(1 - closenessToEdge, 0.1);
  return Math.max(-0.1, value * gradient - dropoff);
}
