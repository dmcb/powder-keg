import { MathUtils } from "three";

export const waveCount = 4;

/** The user-facing wave controls, from which every wave is derived. */
export type WaveSettings = {
  amplitude: number;
  wavelength: number;
  speed: number;
  steepness: number;
  // Degrees, in the board's XY plane
  direction: number;
  // Degrees each secondary wave fans out from `direction`
  spread: number;
  // Distance from the board edge over which waves die down to flat
  edgeFalloff: number;
};

export type Wave = {
  directionX: number;
  directionY: number;
  // Wave number (2π / wavelength)
  k: number;
  amplitude: number;
  // Angular frequency
  omega: number;
};

// Each wave relative to the primary: its angle (as a multiple of `spread`),
// wavelength and amplitude. Uneven ratios keep crests from lining up into a
// visible grid.
const harmonics = [
  { angle: 0, length: 1, amplitude: 1 },
  { angle: 1, length: 0.61, amplitude: 0.55 },
  { angle: -1.4, length: 0.43, amplitude: 0.36 },
  { angle: 0.45, length: 0.27, amplitude: 0.2 },
] as const;

export function buildWaves(settings: WaveSettings): Wave[] {
  return harmonics.map((harmonic) => {
    const angle = MathUtils.degToRad(
      settings.direction + settings.spread * harmonic.angle,
    );
    const k = (Math.PI * 2) / (settings.wavelength * harmonic.length);
    return {
      directionX: Math.cos(angle),
      directionY: Math.sin(angle),
      k,
      amplitude: settings.amplitude * harmonic.amplitude,
      // Deep-water dispersion: longer waves travel faster
      omega: settings.speed * Math.sqrt(k),
    };
  });
}

/**
 * The live ocean state, written by `Ocean` whenever its controls change and
 * read by anything that rides the waves (e.g. ships bobbing). Mirrors the
 * uniforms the ocean shader displaces its vertices with.
 */
export const ocean = {
  waves: [] as Wave[],
  edgeFalloff: 0.08,
  bobbing: {
    enabled: true,
    height: 1,
    tilt: 1,
  },
};

/** 0 at the board edge, rising to 1 `falloff` in from it. */
export function waveEdgeFactor(x: number, y: number, falloff: number) {
  const distanceToEdge = 1 - Math.max(Math.abs(x), Math.abs(y));
  return MathUtils.smoothstep(distanceToEdge, 0, falloff);
}

/**
 * Wave height at a board position and game time; the CPU twin of the ocean
 * vertex shader. Ignores the Gerstner horizontal shift, which is close enough
 * for objects floating on the surface.
 */
export function waveHeight(x: number, y: number, time: number) {
  let height = 0;
  for (const wave of ocean.waves) {
    const phase =
      wave.k * (wave.directionX * x + wave.directionY * y) - wave.omega * time;
    height += wave.amplitude * Math.sin(phase);
  }
  return height * waveEdgeFactor(x, y, ocean.edgeFalloff);
}
