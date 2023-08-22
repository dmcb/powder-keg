"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Network from "components/Network";
import Terrain from "components/Terrain";
import Ocean from "components/Ocean";
import Sun from "components/Sun";

export default function Page() {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.1} />
      <Network />
      <Terrain />
      <Ocean />
      <Sun />
    </Canvas>
  );
}
