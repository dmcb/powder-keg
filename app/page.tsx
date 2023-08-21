"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Network from "components/Network";
import Terrain from "components/Terrain";

export default function Page() {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Network />
      <Terrain />
    </Canvas>
  );
}
