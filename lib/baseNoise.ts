import { Vector2 } from "three";
import { NoiseFunction2D } from "simplex-noise";

export default function baseNoise(
  noise2D: NoiseFunction2D,
  amplitude: number,
  frequency: number,
  octaves: number,
  gradientEdge: number,
  x: number,
  y: number
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
      (distance - gradientEdge) / (1 - gradientEdge)
    );
  }
  dropoff *= closenessToEdge;
  gradient = Math.pow(1 - closenessToEdge, 0.1);
  return Math.max(-0.1, value * gradient - dropoff);
}
