import React, { useRef, useLayoutEffect, useMemo } from "react";
import { ThreeElements } from "@react-three/fiber";
import { MathUtils, Vector2, Vector3, BufferGeometry } from "three";
import Delaunator from "delaunator";
import { NoiseFunction2D, createNoise2D } from "simplex-noise";

const baseNoise = (noiseFunction: NoiseFunction2D, x: number, y: number) => {
  const position = new Vector2(x, y);
  const octaves = 8;
  const gradientSharpness = 0.8;
  const gradientEdge = 1;
  let value = 0;
  let amplitude = 0.3;
  let frequency = 0.3;
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
  return value * (gradient + 0.1);
};

export default function Box(props: ThreeElements["mesh"]) {
  const geometryRef = useRef<BufferGeometry>(null!);

  const points: Vector3[] = useMemo(() => {
    const noise2D = createNoise2D();

    let size = 2;
    let edgePointsCount = 24;
    let innerPointsCount = 2900;

    // Start with corner points
    let points = [
      new Vector3(-1, -1, baseNoise(noise2D, -1, -1)),
      new Vector3(1, -1, baseNoise(noise2D, 1, -1)),
      new Vector3(1, 1, baseNoise(noise2D, 1, 1)),
      new Vector3(-1, 1, baseNoise(noise2D, -1, 1)),
    ];

    // Add edges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < edgePointsCount; j++) {
        let x = MathUtils.randFloatSpread(size);
        let y = MathUtils.randFloatSpread(size);
        let z = 0;
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
        points.push(new Vector3(x, y, baseNoise(noise2D, x, y)));
      }
    }

    // Fill in the rest
    for (let i = 0; i < innerPointsCount; i++) {
      let x = MathUtils.randFloatSpread(size * 0.98);
      let y = MathUtils.randFloatSpread(size * 0.98);
      let z = 0;
      points.push(new Vector3(x, y, baseNoise(noise2D, x, y)));
    }

    return points;
  }, []);

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
  }, []);

  return (
    <mesh {...props} castShadow={true} receiveShadow={true}>
      <bufferGeometry ref={geometryRef} />
      <meshStandardMaterial color={"beige"} flatShading={true} />
    </mesh>
  );
}
