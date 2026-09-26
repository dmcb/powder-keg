import { useFrame, type RootState } from "@react-three/fiber";
import { gameClock } from "lib/gameClock";
import { useGameStore } from "stores/gameStore";

/**
 * `useFrame` for game logic: skipped entirely while paused, and given game
 * time (`delta`/`elapsed` from `gameClock`) instead of wall time. Use plain
 * `useFrame` only for work that must keep running while paused (rendering,
 * input edge tracking).
 */
export function useGameFrame(
  callback: (state: RootState, delta: number, elapsed: number) => void,
  priority?: number,
) {
  useFrame((state) => {
    if (useGameStore.getState().paused) return;
    callback(state, gameClock.delta, gameClock.elapsed);
  }, priority);
}
