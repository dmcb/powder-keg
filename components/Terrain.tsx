import React, { useRef, useLayoutEffect } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber";
import { Mesh, MathUtils } from "three";

export default function Box(props: ThreeElements["mesh"]) {
  const meshRef = useRef<Mesh>(null!);

  useLayoutEffect(() => {
    let size = 2;
    let edgePointsCount = 99;
    let innerPointsCount = 9600;
    // Start with corner points
    let points = [
      [-1, -1, 0],
      [1, -1, 0],
      [1, 1, 0],
      [-1, 1, 0],
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
        points.push([x, y, z]);
      }
    }
    // Fill in the rest
    for (let i = 0; i < innerPointsCount; i++) {
      let x = MathUtils.randFloatSpread(size * 0.95);
      let y = MathUtils.randFloatSpread(size * 0.95);
      let z = 0;
      points.push([x, y, z]);
    }
    console.log(points);
  }, []);

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"hotpink"} />
    </mesh>
  );
}
