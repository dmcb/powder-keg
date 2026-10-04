import {
  Color,
  DataTexture,
  DataUtils,
  HalfFloatType,
  LinearFilter,
  MeshStandardMaterial,
  RedFormat,
  Texture,
  Vector4,
} from "three";
import { waveCount, type Wave } from "lib/waves";

/**
 * Uniforms shared with the ocean's shader program. Update `.value`s in place;
 * the material reads them every frame without recompiling.
 */
export function createOceanUniforms() {
  return {
    uTime: { value: 0 },
    uWaves: {
      value: Array.from({ length: waveCount }, () => new Vector4()),
    },
    uWaveOmega: { value: new Array<number>(waveCount).fill(0) },
    uWaveAmplitude: { value: 0 },
    uSteepness: { value: 0 },
    uEdgeFalloff: { value: 0.08 },
    uHeightmap: { value: null as Texture | null },
    uFaceted: { value: 0 },
    uDepthRange: { value: 0.1 },
    uDepthCurve: { value: 1 },
    uColourBands: { value: 0 },
    uMidPoint: { value: 0.5 },
    uShallowColour: { value: new Color() },
    uMidColour: { value: new Color() },
    uDeepColour: { value: new Color() },
    uShallowOpacity: { value: 0.3 },
    uDeepOpacity: { value: 0.9 },
    uFoamColour: { value: new Color() },
    uFoamOpacity: { value: 1 },
    uFoamDepth: { value: 0.006 },
    uFoamReach: { value: 0.03 },
    uFoamSpacing: { value: 0.01 },
    uFoamWidth: { value: 0.2 },
    uFoamSpeed: { value: 0.3 },
    uFoamBreakup: { value: 0.5 },
    uFoamNoiseScale: { value: 30 },
    uCrestThreshold: { value: 0.8 },
    uCrestSoftness: { value: 0.2 },
    uCrestOpacity: { value: 0.6 },
  };
}

export type OceanUniforms = ReturnType<typeof createOceanUniforms>;

export function setWaveUniforms(uniforms: OceanUniforms, waves: Wave[]) {
  waves.forEach((wave, i) => {
    uniforms.uWaves.value[i].set(
      wave.directionX,
      wave.directionY,
      wave.k,
      wave.amplitude,
    );
    uniforms.uWaveOmega.value[i] = wave.omega;
  });
  uniforms.uWaveAmplitude.value = waves.reduce(
    (sum, w) => sum + w.amplitude,
    0,
  );
}

/**
 * Bakes terrain height over the board (XY from -1 to 1) into a single-channel
 * texture, so the shader can work out water depth anywhere.
 */
export function createHeightmap(
  height: (x: number, y: number) => number,
  size: number,
) {
  const data = new Uint16Array(size * size);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const x = ((i + 0.5) / size) * 2 - 1;
      const y = ((j + 0.5) / size) * 2 - 1;
      data[j * size + i] = DataUtils.toHalfFloat(height(x, y));
    }
  }
  const texture = new DataTexture(data, size, size, RedFormat, HalfFloatType);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

const vertexCommon = /* glsl */ `
  #include <common>
  #define OCEAN_WAVE_COUNT ${waveCount}
  uniform float uTime;
  uniform vec4 uWaves[OCEAN_WAVE_COUNT];
  uniform float uWaveOmega[OCEAN_WAVE_COUNT];
  uniform float uSteepness;
  uniform float uEdgeFalloff;
  uniform sampler2D uHeightmap;
  attribute vec2 faceCentre;
  varying vec2 vOceanXY;
  varying float vFaceDepth;
  varying float vFaceWaveHeight;

  float oceanEdgeFactor(vec2 p) {
    return smoothstep(0.0, uEdgeFalloff, 1.0 - max(abs(p.x), abs(p.y)));
  }

  // Sum of Gerstner waves: z is height, xy pulls vertices towards crests,
  // sharpening them
  vec3 oceanGerstner(vec2 p, float t) {
    vec3 offset = vec3(0.0);
    for (int i = 0; i < OCEAN_WAVE_COUNT; i++) {
      vec4 wave = uWaves[i];
      float phase = wave.z * dot(wave.xy, p) - uWaveOmega[i] * t;
      float q = uSteepness / (wave.z * float(OCEAN_WAVE_COUNT));
      offset.xy += q * wave.xy * cos(phase);
      offset.z += wave.w * sin(phase);
    }
    return offset;
  }
`;

const vertexDisplace = /* glsl */ `
  #include <begin_vertex>
  vec3 oceanOffset =
    oceanGerstner(transformed.xy, uTime) * oceanEdgeFactor(transformed.xy);
  transformed += oceanOffset;
  vOceanXY = transformed.xy;
  // Wave height at the face's centre, so whitecaps cover whole facets
  vFaceWaveHeight =
    oceanGerstner(faceCentre, uTime).z * oceanEdgeFactor(faceCentre);
  vFaceDepth = -texture2D(uHeightmap, faceCentre * 0.5 + 0.5).r;
`;

const fragmentCommon = /* glsl */ `
  #include <common>
  uniform float uTime;
  uniform sampler2D uHeightmap;
  uniform float uWaveAmplitude;
  uniform float uFaceted;
  uniform float uDepthRange;
  uniform float uDepthCurve;
  uniform float uColourBands;
  uniform float uMidPoint;
  uniform vec3 uShallowColour;
  uniform vec3 uMidColour;
  uniform vec3 uDeepColour;
  uniform float uShallowOpacity;
  uniform float uDeepOpacity;
  uniform vec3 uFoamColour;
  uniform float uFoamOpacity;
  uniform float uFoamDepth;
  uniform float uFoamReach;
  uniform float uFoamSpacing;
  uniform float uFoamWidth;
  uniform float uFoamSpeed;
  uniform float uFoamBreakup;
  uniform float uFoamNoiseScale;
  uniform float uCrestThreshold;
  uniform float uCrestSoftness;
  uniform float uCrestOpacity;
  varying vec2 vOceanXY;
  varying float vFaceDepth;
  varying float vFaceWaveHeight;

  float oceanHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float oceanNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(oceanHash(i), oceanHash(i + vec2(1.0, 0.0)), f.x),
      mix(oceanHash(i + vec2(0.0, 1.0)), oceanHash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
`;

const fragmentColour = /* glsl */ `
  float oceanSmoothDepth = -texture2D(uHeightmap, vOceanXY * 0.5 + 0.5).r;
  float oceanDepth = max(mix(oceanSmoothDepth, vFaceDepth, uFaceted), 0.0);

  // Depth -> 0 (shallow) to 1 (deep), optionally stepped into bands
  float oceanT = pow(clamp(oceanDepth / uDepthRange, 0.0, 1.0), uDepthCurve);
  if (uColourBands >= 2.0) {
    oceanT = min(floor(oceanT * uColourBands) / (uColourBands - 1.0), 1.0);
  }
  vec3 oceanColour = oceanT < uMidPoint
    ? mix(uShallowColour, uMidColour, oceanT / max(uMidPoint, 1e-4))
    : mix(uMidColour, uDeepColour, (oceanT - uMidPoint) / max(1.0 - uMidPoint, 1e-4));
  float oceanAlpha = mix(uShallowOpacity, uDeepOpacity, oceanT);

  // Foam: a solid band along the shore, lines rippling out from it that thin
  // as the water deepens, and caps on the highest crests
  float oceanBreakup =
    (oceanNoise(vOceanXY * uFoamNoiseScale + uTime * 0.05) - 0.5) * uFoamBreakup;
  float oceanShore = 1.0 - step(uFoamDepth * (1.0 + oceanBreakup), oceanDepth);
  float oceanFade = 1.0 - clamp(oceanDepth / max(uFoamReach, 1e-4), 0.0, 1.0);
  float oceanRipple = step(
    fract(oceanDepth / max(uFoamSpacing, 1e-4) - uTime * uFoamSpeed + oceanBreakup),
    uFoamWidth * oceanFade
  );
  float oceanCrest = smoothstep(
    uCrestThreshold,
    uCrestThreshold + uCrestSoftness,
    vFaceWaveHeight / max(uWaveAmplitude, 1e-5)
  ) * uCrestOpacity;
  float oceanFoam = max(max(oceanShore, oceanRipple), oceanCrest);

  vec4 diffuseColor = vec4(
    mix(oceanColour, uFoamColour, oceanFoam),
    mix(oceanAlpha, uFoamOpacity, oceanFoam)
  );
`;

/**
 * A flat-shaded `MeshStandardMaterial` (so it keeps the sun's lighting and
 * shadows) whose shader displaces vertices with Gerstner waves and colours
 * the water by depth, with foam.
 */
export function createOceanMaterial(uniforms: OceanUniforms) {
  const material = new MeshStandardMaterial({
    flatShading: true,
    transparent: true,
    metalness: 0,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", vertexCommon)
      .replace("#include <begin_vertex>", vertexDisplace);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", fragmentCommon)
      .replace("vec4 diffuseColor = vec4( diffuse, opacity );", fragmentColour);
  };
  material.customProgramCacheKey = () => "ocean";
  return material;
}
