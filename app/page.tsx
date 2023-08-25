"use client";

import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Leva } from "leva";
import Network from "components/Network";
import Board from "components/Board";
import cryptoRandomString from "crypto-random-string";

export default function Page() {
  const queryString = new URLSearchParams(window.location.hash.slice(1));
  const debug = queryString.has("debug");

  const seed: string = cryptoRandomString({
    length: 6,
    type: "alphanumeric",
  });

  return (
    <>
      <Leva hidden={debug ? false : true} collapsed />
      <Canvas shadows={true} camera={{ fov: 10, position: [0, 0, 14] }}>
        {debug && <Perf position="top-left" />}
        <Network />
        <Board seed={seed} />
      </Canvas>
    </>
  );
}
