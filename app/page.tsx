"use client";

import { Canvas } from "@react-three/fiber";
import Network from "components/Network";
import Terrain from "components/Terrain";

export default function Page() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Network />
      <Terrain />
    </Canvas>
  );
}
