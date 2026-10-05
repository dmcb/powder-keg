import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useGameFrame } from "hooks/useGameFrame";
import { folder, useControls } from "leva";
import { BufferGeometry, Color, Float32BufferAttribute } from "three";
import type { ThreeElements } from "@react-three/fiber";
import Delaunator from "delaunator";
import Alea from "aleaprng";
import { useGameStore } from "stores/gameStore";
import { usePlayerStore } from "stores/playerStore";
import { updateWake } from "lib/wake";
import { createTerrainHeight } from "lib/noise";
import { buildWaves, ocean } from "lib/waves";
import {
  createHeightmap,
  createOceanMaterial,
  createOceanUniforms,
  setWaveUniforms,
} from "lib/oceanShader";
import { getTropicalnessFromLatitude } from "config/biomes";
import { boardRadius } from "config/physics";

// Texels per 2 units of board, matching the original -1..1 board's 256
const heightmapSize = Math.ceil(256 * boardRadius);
const scratchColour = new Color();

/**
 * Delaunay-triangulated disc over the board (radius `boardRadius`) from a
 * jittered grid with `resolution` points per 2 units, so its facets match the
 * terrain's irregular low-poly look. Non-indexed, with each vertex carrying
 * its face's centroid so the shader can colour whole faces by depth.
 */
function createOceanGeometry(resolution: number, jitter: number) {
  const prng = new Alea("ocean");
  const step = 2 / resolution;
  const cells = Math.ceil((2 * boardRadius) / step);
  const points: [number, number][] = [];
  // Keep inner points clear of the rim so faces there don't become slivers
  const innerRadius = boardRadius - step * 0.75;
  for (let j = 0; j <= cells; j++) {
    for (let i = 0; i <= cells; i++) {
      const x = -boardRadius + (i + (prng() - 0.5) * jitter) * step;
      const y = -boardRadius + (j + (prng() - 0.5) * jitter) * step;
      if (Math.hypot(x, y) < innerRadius) points.push([x, y]);
    }
  }
  // Evenly spaced rim points keep the board covered out to the border
  const rimPoints = Math.ceil((2 * Math.PI * boardRadius) / step);
  for (let i = 0; i < rimPoints; i++) {
    const angle = (i / rimPoints) * Math.PI * 2;
    points.push([Math.cos(angle) * boardRadius, Math.sin(angle) * boardRadius]);
  }
  const triangles = Delaunator.from(points).triangles;

  const positions: number[] = [];
  const centroids: number[] = [];
  for (let t = 0; t < triangles.length; t += 3) {
    const face = [triangles[t], triangles[t + 2], triangles[t + 1]];
    const cx = face.reduce((sum, p) => sum + points[p][0], 0) / 3;
    const cy = face.reduce((sum, p) => sum + points[p][1], 0) / 3;
    for (const p of face) {
      positions.push(points[p][0], points[p][1], 0);
      centroids.push(cx, cy);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("faceCentre", new Float32BufferAttribute(centroids, 2));
  geometry.computeVertexNormals();
  return geometry;
}

function Ocean(props: ThreeElements["mesh"]) {
  const latitude = useGameStore((state) => state.latitude);
  const terrain = useGameStore((state) => state.terrain);

  // Debug controls
  const [controls, set] = useControls("Ocean", () => ({
    Waves: folder({
      amplitude: { value: 0.004, min: 0, max: 0.03, step: 0.0005 },
      wavelength: { value: 0.35, min: 0.05, max: 2, step: 0.01 },
      speed: { value: 0.1, min: 0, max: 3, step: 0.01 },
      steepness: { value: 0.6, min: 0, max: 1, step: 0.01 },
      direction: { value: 30, min: -180, max: 180, step: 1 },
      spread: { value: 35, min: 0, max: 90, step: 1 },
      edgeFalloff: { value: 0.08, min: 0.001, max: 0.5, step: 0.001 },
    }),
    Colour: folder({
      tropicalness: {
        value: getTropicalnessFromLatitude(latitude),
        min: 0,
        max: 1,
        step: 0.01,
      },
      tropicalShallow: "#8ff7e4",
      tropicalMid: "#1ec8c8",
      tropicalDeep: "#0a6fa8",
      coldShallow: "#7a9aa0",
      coldMid: "#3f6577",
      coldDeep: "#2b445f",
      depthRange: { value: 0.1, min: 0.01, max: 0.3, step: 0.001 },
      depthCurve: { value: 0.7, min: 0.1, max: 3, step: 0.01 },
      midPoint: { value: 0.35, min: 0, max: 1, step: 0.01 },
      colourBands: { value: 6, min: 0, max: 20, step: 1 },
      faceted: { value: 0.6, min: 0, max: 1, step: 0.01 },
      roughness: { value: 0.35, min: 0, max: 1, step: 0.01 },
    }),
    Transparency: folder({
      tropicalShallowOpacity: { value: 0.4, min: 0, max: 1, step: 0.01 },
      coldShallowOpacity: { value: 0.6, min: 0, max: 1, step: 0.01 },
      deepOpacity: { value: 0.92, min: 0, max: 1, step: 0.01 },
    }),
    Foam: folder({
      foamColour: "#ffffff",
      foamOpacity: { value: 0.95, min: 0, max: 1, step: 0.01 },
      foamDepth: { value: 0.004, min: 0, max: 0.03, step: 0.0005 },
      foamReach: { value: 0.025, min: 0, max: 0.1, step: 0.001 },
      foamSpacing: { value: 0.004, min: 0.001, max: 0.05, step: 0.0005 },
      foamWidth: { value: 0.35, min: 0, max: 1, step: 0.01 },
      foamSpeed: { value: 0.35, min: -2, max: 2, step: 0.01 },
      foamBreakup: { value: 0.6, min: 0, max: 2, step: 0.01 },
      foamNoiseScale: { value: 25, min: 1, max: 100, step: 1 },
      crestThreshold: { value: 0.85, min: 0, max: 1.5, step: 0.01 },
      crestSoftness: { value: 0.25, min: 0, max: 1, step: 0.01 },
      crestOpacity: { value: 0.15, min: 0, max: 1, step: 0.01 },
    }),
    Wake: folder({
      wakeLifetime: { value: 1.6, min: 0.1, max: 5, step: 0.05 },
      wakeWidth: { value: 0.012, min: 0, max: 0.05, step: 0.0005 },
      wakeSpread: { value: 2.5, min: 0, max: 8, step: 0.05 },
      wakeLineWidth: { value: 0.008, min: 0.001, max: 0.03, step: 0.0005 },
      wakeChurn: { value: 0.15, min: 0, max: 1, step: 0.01 },
      wakeOpacity: { value: 0.9, min: 0, max: 1, step: 0.01 },
      wakeFullSpeed: { value: 0.15, min: 0.01, max: 1, step: 0.01 },
    }),
    Geometry: folder({
      resolution: { value: 110, min: 10, max: 250, step: 1 },
      jitter: { value: 0.8, min: 0, max: 1, step: 0.01 },
    }),
    Bobbing: folder({
      bob: true,
      bobHeight: { value: 1, min: 0, max: 3, step: 0.01 },
      bobTilt: { value: 1, min: 0, max: 3, step: 0.01 },
    }),
  }));

  // Changes in latitude reset tropicalness (it can still be tweaked after)
  const previousLatitude = useRef(latitude);
  useLayoutEffect(() => {
    if (previousLatitude.current === latitude) return;
    previousLatitude.current = latitude;
    set({ tropicalness: getTropicalnessFromLatitude(latitude) });
  }, [latitude]);

  const uniforms = useMemo(createOceanUniforms, []);
  const material = useMemo(() => createOceanMaterial(uniforms), [uniforms]);
  useEffect(() => () => material.dispose(), [material]);

  const geometry = useMemo(
    () => createOceanGeometry(controls.resolution, controls.jitter),
    [controls.resolution, controls.jitter],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  const heightmap = useMemo(
    () =>
      terrain && createHeightmap(createTerrainHeight(terrain), heightmapSize),
    [terrain],
  );
  useEffect(() => () => heightmap?.dispose(), [heightmap]);

  // Push controls into the shader uniforms and the shared wave state
  useLayoutEffect(() => {
    const c = controls;
    const t = c.tropicalness;
    const u = uniforms;

    ocean.waves = buildWaves(c);
    ocean.edgeFalloff = c.edgeFalloff;
    ocean.bobbing = { enabled: c.bob, height: c.bobHeight, tilt: c.bobTilt };
    setWaveUniforms(u, ocean.waves);
    u.uSteepness.value = c.steepness;
    u.uEdgeFalloff.value = c.edgeFalloff;

    u.uShallowColour.value
      .set(c.coldShallow)
      .lerp(scratchColour.set(c.tropicalShallow), t);
    u.uMidColour.value.set(c.coldMid).lerp(scratchColour.set(c.tropicalMid), t);
    u.uDeepColour.value
      .set(c.coldDeep)
      .lerp(scratchColour.set(c.tropicalDeep), t);
    u.uFoamColour.value.set(c.foamColour);
    u.uDepthRange.value = c.depthRange;
    u.uDepthCurve.value = c.depthCurve;
    u.uMidPoint.value = c.midPoint;
    u.uColourBands.value = c.colourBands;
    u.uFaceted.value = c.faceted;
    material.roughness = c.roughness;

    u.uShallowOpacity.value =
      c.coldShallowOpacity +
      (c.tropicalShallowOpacity - c.coldShallowOpacity) * t;
    u.uDeepOpacity.value = c.deepOpacity;

    u.uFoamOpacity.value = c.foamOpacity;
    u.uFoamDepth.value = c.foamDepth;
    u.uFoamReach.value = c.foamReach;
    u.uFoamSpacing.value = c.foamSpacing;
    u.uFoamWidth.value = c.foamWidth;
    u.uFoamSpeed.value = c.foamSpeed;
    u.uFoamBreakup.value = c.foamBreakup;
    u.uFoamNoiseScale.value = c.foamNoiseScale;
    u.uCrestThreshold.value = c.crestThreshold;
    u.uCrestSoftness.value = c.crestSoftness;
    u.uCrestOpacity.value = c.crestOpacity;

    u.uWakeLifetime.value = c.wakeLifetime;
    u.uWakeWidth.value = c.wakeWidth;
    u.uWakeSpread.value = c.wakeSpread;
    u.uWakeLineWidth.value = c.wakeLineWidth;
    u.uWakeChurn.value = c.wakeChurn;
    u.uWakeOpacity.value = c.wakeOpacity;
  }, [controls, uniforms, material]);

  useLayoutEffect(() => {
    uniforms.uHeightmap.value = heightmap;
  }, [heightmap, uniforms]);

  useGameFrame((_, __, elapsed) => {
    uniforms.uTime.value = elapsed;
    updateWake(
      uniforms.uWake.value,
      usePlayerStore.getState().players.map((player) => player.position),
      elapsed,
      controls.wakeLifetime,
      controls.wakeFullSpeed,
    );
  });

  // Nothing to colour by until the terrain has published its height field
  if (!heightmap) return null;

  return (
    <mesh
      {...props}
      name="ocean"
      position={[0, 0, 0]}
      receiveShadow={true}
      geometry={geometry}
      material={material}
    />
  );
}

export default Ocean;
