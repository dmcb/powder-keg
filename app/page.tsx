"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Network from "components/Network";
import Board from "components/Board";

export default function Page() {
  return (
    <Canvas shadows={true} camera={{ fov: 10, position: [0, 0, 12] }}>
      <OrbitControls />
      <Network />
      <Board />
    </Canvas>
  );
}
