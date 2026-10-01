import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import type { PublicApi, Triplet } from "@react-three/cannon";

export type PhysicsState = {
  position: Vector3;
  velocity: Vector3;
  rotation: number;
  forward: Vector3;
};

/**
 * Mirrors a cannon body's position/velocity/rotation into a plain object that
 * can be read synchronously from `useFrame`, without triggering re-renders.
 * Starts from the body's initial `position`/`rotation`, since the physics
 * world doesn't report anything until it first steps.
 */
export function usePhysicsSubscription(
  api: PublicApi,
  initial: { position: Triplet; rotation: Triplet },
) {
  const state = useRef<PhysicsState>({
    position: new Vector3(...initial.position),
    velocity: new Vector3(),
    rotation: initial.rotation[2],
    forward: new Vector3(0, 1, 0).applyAxisAngle(
      new Vector3(0, 0, 1),
      initial.rotation[2],
    ),
  });

  useEffect(() => {
    const unsubscribers = [
      api.position.subscribe((p) =>
        state.current.position.set(p[0], p[1], p[2]),
      ),
      api.velocity.subscribe((v) =>
        state.current.velocity.set(v[0], v[1], v[2]),
      ),
      api.rotation.subscribe((r) => {
        state.current.rotation = r[2];
        state.current.forward
          .set(0, 1, 0)
          .applyAxisAngle(new Vector3(0, 0, 1), state.current.rotation);
      }),
    ];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [api]);

  return state;
}
