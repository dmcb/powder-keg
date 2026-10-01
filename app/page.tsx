"use client";

import { Suspense, useEffect } from "react";
import { Leva } from "leva";
import { useSearchParams } from "next/navigation";
import Game from "components/scenes/Game";
import Lobby from "components/scenes/Lobby";
import Gamepads from "components/ui/Gamepads";
import AudioUnlock from "components/ui/AudioUnlock";
import { useGameStore } from "stores/gameStore";

function PageContent() {
  const searchParams = useSearchParams();
  const debug = searchParams.has("debug");
  const scene = useGameStore((state) => state.scene);

  useEffect(() => {
    document.body.classList.toggle("ingame", scene !== "lobby");
  }, [scene]);

  return (
    <>
      <Leva hidden={debug ? false : true} />
      <Gamepads />
      <AudioUnlock />
      {scene === "lobby" ? <Lobby debug={debug} /> : <Game debug={debug} />}
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
