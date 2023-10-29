"use client";

import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Leva } from "leva";
import { useSearchParams } from "next/navigation";
import { OrbitControls } from "@react-three/drei";
import Game from "components/Game";
import Lobby from "components/Lobby";
import Gamepads from "components/Gamepads";
import { useGameStore } from "stores/gameStore";

export default function Page() {
  const searchParams = useSearchParams();
  const debug = searchParams.has("debug");
  const gameStarted = useGameStore((state) => state.gameStarted);
  const seed = useGameStore((state) => state.seed);

  return (
    <>
      <Leva hidden={debug ? false : true} />
      <Canvas shadows={true} camera={{ fov: 9, position: [0, 0, 16.5] }}>
        {debug && <Perf position="top-left" />}
        {debug && <OrbitControls />}
        {gameStarted && <Game seed={seed} debug={debug} />}
        <Gamepads />
      </Canvas>
      {!gameStarted && <Lobby debug={debug} />}
    </>
  );
}
