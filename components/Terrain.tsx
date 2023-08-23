import React, { useRef, useLayoutEffect, useMemo } from "react";
import { ThreeElements } from "@react-three/fiber";
import { MathUtils, Vector2, Vector3, BufferGeometry } from "three";
import Delaunator from "delaunator";
import { NoiseFunction2D, createNoise2D } from "simplex-noise";
import Alea from "alea";
import { useControls } from "leva";

const baseNoise = (
  noiseFunction: NoiseFunction2D,
  octaves: number,
  amplitude: number,
  frequency: number,
  gradientSharpness: number,
  gradientEdge: number,
  x: number,
  y: number
) => {
  const position = new Vector2(x, y);
  let value = 0;
  for (let i = 0; i < octaves; i++) {
    value +=
      amplitude *
      Math.abs(noiseFunction((x + 1) * frequency, (y + 1) * frequency));
    amplitude *= 0.5;
    frequency *= 2;
  }
  const distance = position.distanceTo(new Vector2(0, 0));
  const gradient = Math.pow(
    Math.max(0, gradientEdge - distance),
    gradientSharpness
  );
  return value * gradient;
};

export default function Terrain(props: { seed: string }) {
  const geometryRef = useRef<BufferGeometry>(null!);

  const [
    { seed, octaves, amplitude, frequency, gradientSharpness, gradientEdge },
    set,
  ] = useControls(() => ({
    seed: {
      value: props.seed,
    },
    octaves: {
      value: 3,
      min: 1,
      max: 8,
      step: 1,
    },
    amplitude: {
      value: 0.5,
      min: 0.2,
      max: 1,
      step: 0.01,
    },
    frequency: {
      value: 0.5,
      min: 0.15,
      max: 1,
      step: 0.01,
    },
    gradientSharpness: {
      value: 1,
      min: 0.5,
      max: 2,
      step: 0.01,
    },
    gradientEdge: {
      value: 0.7,
      min: 0.5,
      max: 0.85,
      step: 0.01,
    },
  }));

  const points: Vector3[] = useMemo(() => {
    const prng = Alea(seed);
    const noise2D = createNoise2D(prng);

    const insidePointsCount = 1600;
    const edgePointsCount = 99;
    const size = 2;

    // Start with corner points
    const points = [
      new Vector3(
        -1,
        -1,
        baseNoise(
          noise2D,
          octaves,
          amplitude,
          frequency,
          gradientSharpness,
          gradientEdge,
          -1,
          -1
        )
      ),
      new Vector3(
        1,
        -1,
        baseNoise(
          noise2D,
          octaves,
          amplitude,
          frequency,
          gradientSharpness,
          gradientEdge,
          1,
          -1
        )
      ),
      new Vector3(
        1,
        1,
        baseNoise(
          noise2D,
          octaves,
          amplitude,
          frequency,
          gradientSharpness,
          gradientEdge,
          1,
          1
        )
      ),
      new Vector3(
        -1,
        1,
        baseNoise(
          noise2D,
          octaves,
          amplitude,
          frequency,
          gradientSharpness,
          gradientEdge,
          -1,
          1
        )
      ),
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
          new Vector3(
            x,
            y,
            baseNoise(
              noise2D,
              octaves,
              amplitude,
              frequency,
              gradientSharpness,
              gradientEdge,
              x,
              y
            )
          )
        );
      }
    }

    // Fill in the rest
    for (let i = 0; i < insidePointsCount; i++) {
      let x = prng() * size * 0.98 - (size * 0.98) / 2;
      let y = prng() * size * 0.98 - (size * 0.98) / 2;
      points.push(
        new Vector3(
          x,
          y,
          baseNoise(
            noise2D,
            octaves,
            amplitude,
            frequency,
            gradientSharpness,
            gradientEdge,
            x,
            y
          )
        )
      );
    }

    return points;
  }, [seed, octaves, amplitude, frequency, gradientSharpness, gradientEdge]);

  const meshIndex: number[] = useMemo(() => {
    // Triangulate
    const delaunayIndex = Delaunator.from(
      points.map((v) => {
        return [v.x, v.y];
      })
    );

    // Create faces
    const meshIndex = [];
    for (let i = 0; i < delaunayIndex.triangles.length; i++) {
      meshIndex.push(delaunayIndex.triangles[i]);
    }

    return meshIndex.reverse();
  }, [points]);

  useLayoutEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setFromPoints(points);
      geometryRef.current.setIndex(meshIndex);
      geometryRef.current.computeVertexNormals();
    }
  }, [seed, octaves, amplitude, frequency, gradientSharpness, gradientEdge]);

  return (
    <mesh {...props} castShadow={true} receiveShadow={true}>
      <bufferGeometry ref={geometryRef} />
      <meshStandardMaterial color={"beige"} flatShading={true} />
    </mesh>
  );
}
