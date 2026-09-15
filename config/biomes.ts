import chroma from "chroma-js";

// Terrain elevation -> colour scales, indexed by biome (derived from latitude).
export const biomeColorScales = [
  chroma
    .scale(["dcd39f", "749909", "215322", "152A15", "746354", "FFFFFF"])
    .domain([0.0, 0.1, 0.2, 0.6, 0.95, 1.0])
    .classes(20),
  chroma
    .scale(["FBD5A2", "F8D0AE", "A06743", "754228", "451304", "FFFFFF"])
    .domain([0.0, 0.05, 0.2, 0.3, 0.9, 1.0])
    .classes(20),
  chroma
    .scale(["827369", "54596D", "BED6DB", "F4F5F6", "FFFFFF"])
    .domain([0.0, 0.1, 0.2, 0.6, 0.8])
    .classes(20),
] as const;

export function getBiomeColorScale(
  biome: number,
): (typeof biomeColorScales)[number] {
  return (
    biomeColorScales[Math.floor(biome)] ??
    biomeColorScales[biomeColorScales.length - 1]
  );
}

export function getBiomeFromLatitude(latitude: number): number {
  return Math.min(
    Math.floor(Math.abs(latitude) / 30),
    biomeColorScales.length - 1,
  );
}

export const terrainAmplitudeRange = {
  min: 0.1,
  max: 0.4,
};
