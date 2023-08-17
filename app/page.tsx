"use client";

import { Canvas } from "@react-three/fiber";
import Network from "components/Network";
import Box from "components/Box";

export default function Page() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Network />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
}
