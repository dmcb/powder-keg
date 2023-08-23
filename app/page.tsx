"use client";

import { Canvas } from "@react-three/fiber";
import Network from "components/Network";
import Board from "components/Board";
import Sun from "components/Sun";

export default function Page() {
  const crypto = require("crypto");
  const seed = crypto.randomBytes(16).toString("hex");

  return (
    <Canvas shadows={true} camera={{ fov: 10, position: [0, 0, 14] }}>
      <Network />
      <Board seed={seed} />
      <Sun />
    </Canvas>
  );
}
