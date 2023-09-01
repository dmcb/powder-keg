"use client";

import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Leva } from "leva";
import Network from "components/Network";
import Board from "components/Board";
import Sun from "components/Sun";
import cryptoRandomString from "crypto-random-string";
import { useSearchParams } from "next/navigation";
import { OrbitControls, KeyboardControls, Bounds } from "@react-three/drei";
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
          { name: "cameraToggle", keys: ["KeyC"] },
        ]}
      >
        <Canvas
          shadows={true}
          camera={{ fov: 10, position: [0, -4.75, 14.25] }}
        >
          {debug && <Perf position="top-left" />}
          {debug && <OrbitControls />}
          <Suspense>
            <Network />
            <Bounds fit damping={2} observe margin={1}>
              <Board seed={seed} debug={debug} />
            </Bounds>
            <Sun />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}
