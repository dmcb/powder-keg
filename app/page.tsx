"use client";

import { Leva } from "leva";
import { useSearchParams } from "next/navigation";
import Game from "components/scenes/Game";
import Lobby from "components/scenes/Lobby";
import Gamepads from "components/ui/Gamepads";
import { useGameStore } from "stores/gameStore";

export default function Page() {
  const searchParams = useSearchParams();
  const debug = searchParams.has("debug");
  const gameScene = useGameStore((state) => state.gameScene);

  return (
    <>
      <Leva hidden={debug ? false : true} />
      <Gamepads />
      {gameScene === "lobby" && <Lobby debug={debug} />}
      {gameScene === "game" && <Game debug={debug} />}
    </>
  );
}
