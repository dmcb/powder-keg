"use client";

import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Leva } from "leva";
import Network from "components/Network";
import Board from "components/Board";
import cryptoRandomString from "crypto-random-string";
import { useSearchParams } from "next/navigation";
import { OrbitControls, KeyboardControls } from "@react-three/drei";
import { Suspense } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const debug = searchParams.has("debug");

  const seed: string = cryptoRandomString({
    length: 6,
    type: "alphanumeric",
  });

  return (
    <>
      <Leva hidden={debug ? false : true} />
      <KeyboardControls
        map={[
          { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
          { name: "rightward", keys: ["ArrowRight", "KeyD"] },
          { name: "forward", keys: ["ArrowUp", "KeyW"] },
          { name: "backward", keys: ["ArrowDown", "KeyS"] },
        ]}
      >
        <Canvas
          shadows={true}
          camera={{ fov: 10, position: [0, -5.75, 14.25] }}
        >
          {debug && <Perf position="top-left" />}
          {debug && <OrbitControls />}
          <Suspense>
            <Network />
            <Board seed={seed} debug={debug} />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}
