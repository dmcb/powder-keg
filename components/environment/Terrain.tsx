import React, { useRef, useLayoutEffect, useMemo } from "react";
import { Vector3, BufferGeometry, Float32BufferAttribute } from "three";
import Delaunator from "delaunator";
import { createNoise2D } from "simplex-noise";
import Alea from "aleaprng";
import { useControls } from "leva";
import type { Mesh } from "three";
import { useTrimesh } from "@react-three/cannon";
import { useGameStore } from "stores/gameStore";
import baseNoise from "lib/noise";
import {
  getBiomeColorScale,
  getBiomeFromLatitude,
  terrainAmplitudeRange,
} from "config/biomes";

const { min: minAmplitude, max: maxAmplitude } = terrainAmplitudeRange;

export default function Terrain(props: { seed: string }) {
  // State hooks
  const setLatitude = useGameStore((state) => state.setLatitude);

  // Refs
  const [trimeshRef, trimeshApi] = useTrimesh(
    () => ({
      args: [points, meshIndex],
      mass: 0,
      collisionFilterGroup: 1,
      collisionFilterMask: 1,
    }),
    useRef<Mesh>(null),
  );
  const geometryRef = useRef<BufferGeometry>(null!);

  // Initialize terrain with seed
  const {
    prng,
    initialLatitude,
    initialBiome,
    initialAmplitude,
    initialFrequency,
    initialGradientEdge,
    initialOctaves,
  } = useMemo(() => {
    const prng = new Alea(props.seed);
    const initialLatitude = prng() * 180 - 90;
    prng.restart();
    return {
      prng: prng,
      initialLatitude: initialLatitude,
      initialBiome: getBiomeFromLatitude(initialLatitude),
      initialAmplitude: prng() * (maxAmplitude - minAmplitude) + minAmplitude,
      initialFrequency: prng() * 0.7 + 1,
      initialGradientEdge: prng() * 0.36 + 0.5,
      initialOctaves: 3,
    };
  }, [props.seed]);

  // Debug controls
  const [
    { latitude, biome, amplitude, frequency, gradientEdge, octaves },
    set,
  ] = useControls("Terrain", () => ({
    latitude: {
      value: initialLatitude,
      min: -90,
      max: 90,
      step: 1,
    },
    biome: {
      value: initialBiome,
      min: 0,
      max: 2,
      step: 1,
    },
    amplitude: {
      value: initialAmplitude,
      min: minAmplitude,
      max: maxAmplitude,
      step: 0.01,
    },
    frequency: {
      value: initialFrequency,
      min: 1,
      max: 1.7,
      step: 0.01,
    },
    gradientEdge: {
      value: initialGradientEdge,
      min: 0.5,
      max: 0.86,
      step: 0.01,
    },
    octaves: {
      value: initialOctaves,
      min: 1,
      max: 8,
      step: 1,
    },
  }));

  const points: number[] = useMemo(() => {
    prng.restart();
    const noise2D = createNoise2D(prng);
    const insidePointsCount = 8000;
    const edgePointsCount = 449;
    const size = 2;

    // Start with corner points
    const points = [
      -1,
      -1,
      baseNoise(noise2D, amplitude, frequency, octaves, gradientEdge, -1, -1),
      1,
      -1,
      baseNoise(noise2D, amplitude, frequency, octaves, gradientEdge, 1, -1),
      1,
      1,
      baseNoise(noise2D, amplitude, frequency, octaves, gradientEdge, 1, 1),
      -1,
      1,
      baseNoise(noise2D, amplitude, frequency, octaves, gradientEdge, -1, 1),
    ];

    // Add edges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < edgePointsCount; j++) {
        let x = prng() * size - size / 2;
        let y = prng() * size - size / 2;
        switch (i) {
          case 0:
            y = -1;
            break;
          case 1:
            x = 1;
            break;
          case 2:
            y = 1;
            break;
          case 3:
            x = -1;
            break;
        }
        points.push(
          x,
          y,
          baseNoise(noise2D, amplitude, frequency, octaves, gradientEdge, x, y),
        );
      }
    }

    // Fill in the rest
    for (let i = 0; i < insidePointsCount; i++) {
      let x = prng() * size * 0.98 - (size * 0.98) / 2;
      let y = prng() * size * 0.98 - (size * 0.98) / 2;
      points.push(
        x,
        y,
        baseNoise(noise2D, amplitude, frequency, octaves, gradientEdge, x, y),
      );
    }

    return points;
  }, [props.seed, octaves, amplitude, frequency, gradientEdge]);

  const meshIndex: number[] = useMemo(() => {
    // Triangulate
    const pointsAs2D: [number, number][] = [];
    for (let i = 0; i < points.length; i += 3) {
      pointsAs2D.push([points[i], points[i + 1]]);
    }
    const delaunayIndex = Delaunator.from(pointsAs2D);

    // Create faces
    return Array.from(delaunayIndex.triangles).reverse();
  }, [points]);

  const colourScale = useMemo(() => getBiomeColorScale(biome), [biome]);

  // Changes in latitude effect sun and biome
  const previousLatitude = useRef(latitude);
  useLayoutEffect(() => {
    // Skip the redundant initial set(); the Leva inputs are not registered
    // yet on mount and the control already holds the initial value.
    if (previousLatitude.current !== latitude) {
      set({ biome: getBiomeFromLatitude(latitude) });
    }
    previousLatitude.current = latitude;
    setLatitude(latitude);
  }, [latitude]);

  // Changes in seed update debug controls
  const previousSeed = useRef(props.seed);
  useLayoutEffect(() => {
    if (previousSeed.current === props.seed) return;
    previousSeed.current = props.seed;
    set({
      latitude: initialLatitude,
      biome: initialBiome,
      amplitude: initialAmplitude,
      frequency: initialFrequency,
      gradientEdge: initialGradientEdge,
      octaves: initialOctaves,
    });
  }, [props.seed]);

  const pointsAsVector3 = useMemo(() => {
    const pointsAsVector3: Vector3[] = [];
    for (let i = 0; i < points.length; i += 3) {
      pointsAsVector3.push(
        new Vector3(points[i], points[i + 1], points[i + 2]),
      );
    }
    return pointsAsVector3;
  }, [points]);

  // Update geometry with points and faces
  useLayoutEffect(() => {
    if (geometryRef.current) {
      // Build a fresh geometry: setFromPoints() iterates an existing position
      // attribute's count, so reusing the non-indexed geometry (whose vertex
      // count exceeds the source points) reads past the end of the array.
      const geometry = new BufferGeometry();
      geometry.setFromPoints(pointsAsVector3);
      geometry.setIndex(meshIndex);
      geometry.computeVertexNormals();
      const nonIndexed = geometry.toNonIndexed();
      geometryRef.current.copy(nonIndexed);
      geometry.dispose();
      nonIndexed.dispose();

      // Reset trimesh
      // Is there a way to dynamically update the trimesh geometry?
    }
  }, [pointsAsVector3, meshIndex]);

  // Update face colours
  useLayoutEffect(() => {
    const positionAttribute = geometryRef.current?.getAttribute("position");
    if (!positionAttribute) return;

    const colours: number[] = [];
    for (let i = 0; i < positionAttribute.count; i += 3) {
      const avgHeightOfFace =
        (positionAttribute.getZ(i) +
          positionAttribute.getZ(i + 1) +
          positionAttribute.getZ(i + 2)) /
        3 /
        maxAmplitude;
      const [r, g, b] = colourScale(avgHeightOfFace).rgb();
      colours.push(r / 255, g / 255, b / 255);
      colours.push(r / 255, g / 255, b / 255);
      colours.push(r / 255, g / 255, b / 255);
    }
    geometryRef.current.setAttribute(
      "color",
      new Float32BufferAttribute(colours, 3),
    );
  }, [pointsAsVector3, colourScale]);

  return (
    <mesh
      name="terrain"
      key={props.seed}
      ref={trimeshRef}
      castShadow={true}
      receiveShadow={true}
      {...props}
    >
      <bufferGeometry ref={geometryRef} />
      <meshStandardMaterial flatShading={true} vertexColors={true} />
    </mesh>
  );
}
