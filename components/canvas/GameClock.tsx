import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { gameClock } from "lib/gameClock";
import { isFrozen, useGameStore } from "stores/gameStore";

/**
 * Drives `gameClock` from the R3F frame loop. Runs at a negative priority so
 * game time is updated before any other frame callback reads it.
 */
export default function GameClock() {
  useEffect(() => gameClock.reset(), []);

  useFrame((_, delta) => {
    gameClock.tick(delta, isFrozen(useGameStore.getState()));
  }, -1);

  return null;
}
