"use client";

import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import Network from "components/Network";
import Board from "components/Board";
import cryptoRandomString from "crypto-random-string";

export default function Page() {
  const seed: string = cryptoRandomString({
    length: 6,
    type: "alphanumeric",
  });

  return (
    <Canvas shadows={true} camera={{ fov: 10, position: [0, 0, 14] }}>
      <Perf position={"top-left"} />
      <Network />
      <Board seed={seed} />
    </Canvas>
  );
}
