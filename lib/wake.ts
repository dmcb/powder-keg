import { Vector4 } from "three";

export const wakeShips = 4;
// Per ship: the live head (index 0) plus a history of sampled positions
export const wakePoints = 12;

// A jump further than this between frames is a respawn, not sailing
const teleportDistance = 0.2;

/** Points packed as (x, y, game time sampled, strength 0–1 from speed). */
export function createWakePoints() {
  return Array.from(
    { length: wakeShips * wakePoints },
    () => new Vector4(0, 0, -1e3, 0),
  );
}

function resetTrail(points: Vector4[], start: number, x: number, y: number) {
  for (let i = 0; i < wakePoints; i++) {
    points[start + i].set(x, y, -1e3, 0);
  }
}

/**
 * Advances each ship's trail: the head follows the ship every frame, and a
 * new history point is pushed every `lifetime / (wakePoints - 2)` seconds of
 * game time, so the oldest point has always faded out by the time it drops
 * off the end.
 */
export function updateWake(
  points: Vector4[],
  positions: [number, number][],
  elapsed: number,
  lifetime: number,
  fullSpeed: number,
) {
  const interval = lifetime / (wakePoints - 2);
  for (let ship = 0; ship < wakeShips; ship++) {
    const start = ship * wakePoints;
    const [x, y] = positions[ship] ?? [0, 0];
    const head = points[start];
    const newest = points[start + 1];

    // Clock reset (new match) or teleport: start the trail afresh
    if (
      elapsed < newest.z ||
      Math.hypot(x - head.x, y - head.y) > teleportDistance
    ) {
      resetTrail(points, start, x, y);
      newest.z = elapsed;
    }

    head.set(x, y, elapsed, newest.w);

    const sinceNewest = elapsed - newest.z;
    if (sinceNewest >= interval) {
      for (let i = wakePoints - 1; i > 1; i--) {
        points[start + i].copy(points[start + i - 1]);
      }
      const speed = Math.hypot(x - newest.x, y - newest.y) / sinceNewest;
      newest.set(x, y, elapsed, Math.min(speed / fullSpeed, 1));
      head.w = newest.w;
    }
  }
}
