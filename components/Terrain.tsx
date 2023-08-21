import React, { useRef, useLayoutEffect, useMemo } from "react";
import { ThreeElements } from "@react-three/fiber";
import { MathUtils, Vector3, BufferGeometry } from "three";
import Delaunator from "delaunator";
import { createNoise2D } from "simplex-noise";

export default function Box(props: ThreeElements["mesh"]) {
  const geometryRef = useRef<BufferGeometry>(null!);

  const points: Vector3[] = useMemo(() => {
    const noise2D = createNoise2D();

    let size = 2;
    let edgePointsCount = 49;
    let innerPointsCount = 4800;

    // Start with corner points
    let points = [
      new Vector3(-1, -1, 0.3 * noise2D(-1, -1)),
      new Vector3(1, -1, 0.3 * noise2D(1, -1)),
      new Vector3(1, 1, 0.3 * noise2D(1, 1)),
      new Vector3(-1, 1, 0.3 * noise2D(-1, 1)),
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
        points.push(new Vector3(x, y, 0.3 * noise2D(x, y)));
      }
    }

    // Fill in the rest
    for (let i = 0; i < innerPointsCount; i++) {
      let x = MathUtils.randFloatSpread(size * 0.98);
      let y = MathUtils.randFloatSpread(size * 0.98);
      let z = 0;
      points.push(new Vector3(x, y, 0.3 * noise2D(x, y)));
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

    return meshIndex;
  }, [points]);

  useLayoutEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setFromPoints(points);
      geometryRef.current.setIndex(meshIndex);
      geometryRef.current.computeVertexNormals();
    }
  }, []);

  return (
    <mesh {...props}>
      <bufferGeometry ref={geometryRef} />
      <meshStandardMaterial wireframe={true} color={"hotpink"} />
    </mesh>
  );
}
