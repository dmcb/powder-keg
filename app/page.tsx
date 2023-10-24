"use client";

import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Leva } from "leva";
import Network from "components/GameCount";
import Board from "components/Board";
import Sun from "components/Sun";
import cryptoRandomString from "crypto-random-string";
import { useSearchParams } from "next/navigation";
import { OrbitControls, KeyboardControls } from "@react-three/drei";
import { Suspense } from "react";
import Interface from "components/Interface";

export default function Page() {
  const searchParams = useSearchParams();
  const debug = searchParams.has("debug");

  const playerName: string = cryptoRandomString({
    length: 6,
    type: "alphanumeric",
  });

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
          { name: "cannonleft", keys: ["KeyQ"] },
          { name: "cannonright", keys: ["KeyE"] },
          { name: "cameraToggle", keys: ["KeyC"] },
        ]}
      >
        <Canvas shadows={true} camera={{ fov: 9, position: [0, 0, 100] }}>
          {debug && <Perf position="top-left" />}
          {debug && <OrbitControls />}
          <Suspense>
            <Board seed={seed} debug={debug} />
            <Sun />
          </Suspense>
        </Canvas>
        <Interface />
      </KeyboardControls>
    </>
  );
}
