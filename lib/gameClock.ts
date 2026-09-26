// Largest step a single frame may advance game time, so a stalled or
// throttled frame can't make the game lurch forward.
const maxDelta = 0.1;

/**
 * Game time, in seconds. Unlike the R3F clock (wall time), this only advances
 * while the game is unpaused. Ticked once per frame by `GameClock` before any
 * other frame callback; read it via `useGameFrame` or directly.
 */
export const gameClock = {
  elapsed: 0,
  delta: 0,
  reset() {
    this.elapsed = 0;
    this.delta = 0;
  },
  tick(realDelta: number, paused: boolean) {
    this.delta = paused ? 0 : Math.min(realDelta, maxDelta);
    this.elapsed += this.delta;
  },
};
