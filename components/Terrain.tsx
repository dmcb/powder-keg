import React, { useRef, useLayoutEffect, useMemo } from "react";
import { Vector3, BufferGeometry, Float32BufferAttribute } from "three";
import Delaunator from "delaunator";
import { createNoise2D } from "simplex-noise";
import Alea from "aleaprng";
import chroma from "chroma-js";
import { useControls } from "leva";
import type { Mesh } from "three";
import { useTrimesh } from "@react-three/cannon";
import { useGameStore } from "stores/gameStore";
import baseNoise from "lib/baseNoise";

const minAmplitude = 0.1;
const maxAmplitude = 0.4;

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
    useRef<Mesh>(null)
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
    console.log("Initializing terrain with " + props.seed);
    const prng = new Alea(props.seed);
    const initialLatitude = prng() * 180 - 90;
    prng.restart();
    return {
      prng: prng,
      initialLatitude: initialLatitude,
      initialBiome: Math.floor(Math.abs(initialLatitude) / 30),
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
          baseNoise(noise2D, amplitude, frequency, octaves, gradientEdge, x, y)
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
        baseNoise(noise2D, amplitude, frequency, octaves, gradientEdge, x, y)
      );
    }

    return points;
  }, [props.seed, octaves, amplitude, frequency, gradientEdge]);

  const meshIndex: number[] = useMemo(() => {
    // Triangulate
    const pointsAs2D = [];
    for (let i = 0; i < points.length; i += 3) {
      pointsAs2D.push([points[i], points[i + 1]]);
    }
    const delaunayIndex = Delaunator.from(pointsAs2D);

    // Create faces
    const meshIndex = [];
    for (let i = 0; i < delaunayIndex.triangles.length; i++) {
      meshIndex.push(delaunayIndex.triangles[i]);
    }

    return meshIndex.reverse();
  }, [points]);

  const colourScale: chroma = useMemo(() => {
    switch (biome) {
      case 0:
        return chroma
          .scale(["dcd39f", "749909", "215322", "152A15", "746354", "FFFFFF"])
          .domain([0.0, 0.1, 0.2, 0.6, 0.95, 1.0])
          .classes(20);
      case 1:
        return chroma
          .scale(["FBD5A2", "F8D0AE", "A06743", "754228", "451304", "FFFFFF"])
          .domain([0.0, 0.05, 0.2, 0.3, 0.9, 1.0])
          .classes(20);
      case 2:
        return chroma
          .scale(["827369", "54596D", "BED6DB", "F4F5F6", "FFFFFF"])
          .domain([0.0, 0.1, 0.2, 0.6, 0.8])
          .classes(20);
    }
  }, [biome]);

  // Changes in latitude effect sun and biome
  useLayoutEffect(() => {
    set({ biome: Math.floor(Math.abs(latitude) / 30) });
    setLatitude(latitude);
  }, [latitude]);

  // Changes in initial value update debug controls
  useLayoutEffect(() => {
    set({
      latitude: initialLatitude,
      biome: initialBiome,
      amplitude: initialAmplitude,
      frequency: initialFrequency,
      gradientEdge: initialGradientEdge,
      octaves: initialOctaves,
    });
  }, [props.seed]);

  // Update geometry with points, faces, and colouring
  useLayoutEffect(() => {
    if (geometryRef.current) {
      const pointsAsVector3 = [];
      for (let i = 0; i < points.length; i += 3) {
        pointsAsVector3.push(
          new Vector3(points[i], points[i + 1], points[i + 2])
        );
      }
      geometryRef.current.setFromPoints(pointsAsVector3);
      geometryRef.current.setIndex(meshIndex);
      geometryRef.current.computeVertexNormals();
      geometryRef.current.copy(geometryRef.current.toNonIndexed());

      // Set colours per face
      const positionAttribute = geometryRef.current.getAttribute("position");
      const colours = [];
      for (let i = 0; i < positionAttribute.count; i += 3) {
        const avgHeightOfFace =
          (positionAttribute.getZ(i) +
            positionAttribute.getZ(i + 1) +
            positionAttribute.getZ(i + 2)) /
          3 /
          maxAmplitude;
        const [r, g, b] = colourScale(avgHeightOfFace).get("rgb");
        colours.push(r / 255, g / 255, b / 255);
        colours.push(r / 255, g / 255, b / 255);
        colours.push(r / 255, g / 255, b / 255);
      }
      geometryRef.current.setAttribute(
        "color",
        new Float32BufferAttribute(colours, 3)
      );

      // Reset trimesh
      // Is there a way to dynamically update the trimesh geometry?
    }
  }, [props.seed, biome, octaves, amplitude, frequency, gradientEdge]);

  return (
    <mesh
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
