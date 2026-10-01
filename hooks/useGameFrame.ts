import { useFrame, type RootState } from "@react-three/fiber";
import { gameClock } from "lib/gameClock";

/**
 * `useFrame` for game logic, given game time (`delta`/`elapsed` from
 * `gameClock`) instead of wall time. It still runs while the game is frozen
 * (paused or counting down) so derived state like lighting and player
 * positions is in place before play starts, but with `delta` 0 and `elapsed`
 * held, so time-scaled logic makes no progress. Anything not scaled by time
 * (e.g. firing) must be gated by player input, which is locked while frozen.
 */
export function useGameFrame(
  callback: (state: RootState, delta: number, elapsed: number) => void,
  priority?: number,
) {
  useFrame((state) => {
    callback(state, gameClock.delta, gameClock.elapsed);
  }, priority);
}
