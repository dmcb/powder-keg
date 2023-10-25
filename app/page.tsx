"use client";

import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Leva } from "leva";
import Board from "components/Board";
import Sun from "components/Sun";
import { useSearchParams } from "next/navigation";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Lobby from "components/Lobby";
import Gamepads from "components/Gamepads";
import { useGameStore } from "stores/gameStore";

export default function Page() {
  const searchParams = useSearchParams();
  const debug = searchParams.has("debug");
  const seed = useGameStore((state) => state.seed);

  return (
    <>
      <Leva hidden={debug ? false : true} />
      <Canvas shadows={true} camera={{ fov: 9, position: [0, 0, 100] }}>
        {debug && <Perf position="top-left" />}
        {debug && <OrbitControls />}
        {seed && (
          <Suspense>
            <Board seed={seed} debug={debug} />
            <Sun />
          </Suspense>
        )}
        <Gamepads />
      </Canvas>
      {!seed && <Lobby />}
    </>
  );
}
