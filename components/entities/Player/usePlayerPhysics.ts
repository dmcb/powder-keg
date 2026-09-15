import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useCompoundBody } from "@react-three/cannon";
import type { Group } from "three";
import { usePhysicsSubscription } from "hooks/usePhysicsSubscription";
import { usePlayerStore } from "stores/playerStore";
import {
  playerInitialPositions,
  playerInitialRotations,
  reverseSailSpeedModifier,
  reverseSailTurnModifier,
  forwardSailTurnModifier,
  turnTorque,
  sailSpeed,
} from "config/physics";
import type { PlayerControls } from "./usePlayerControls";

/**
 * Owns the physics body for a player's ship: applies steering torque and
 * sail-driven thrust from `controls`, and reports collisions as damage.
 */
export function usePlayerPhysics(
  playerNumber: number,
  controls: PlayerControls,
) {
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const updatePlayerHealth = usePlayerStore(
    (state) => state.updatePlayerHealth,
  );

  const [shipRef, api] = useCompoundBody(
    () => ({
      angularFactor: [0, 0, 1],
      linearFactor: [1, 1, 0],
      mass: 1,
      type: "Dynamic",
      angularDamping: 1,
      linearDamping: 0.999,
      rotation: playerInitialRotations[playerNumber],
      position: playerInitialPositions[playerNumber],
      collisionFilterGroup: 1,
      collisionFilterMask: 1 | 2,
      onCollide: (e) => {
        if (e.body.name != "border" && e.contact.impactVelocity > 0.1) {
          if (e.body.name == "terrain") {
            updatePlayerHealth(playerNumber, -e.contact.impactVelocity * 10);
          }
          if (e.body.name == "cannonball") {
            updatePlayerHealth(playerNumber, -10);
          }
        }
      },
      shapes: [
        {
          args: [0.035, 0.085, 0.1],
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          type: "Box",
        },
        {
          args: [0.015],
          position: [0, 0.03, 0.01],
          rotation: [0, 0, 0],
          type: "Sphere",
        },
        {
          args: [0.015],
          position: [0, -0.03, 0.01],
          rotation: [0, 0, 0],
          type: "Sphere",
        },
      ],
    }),
    useRef<Group>(null),
  );

  const physics = usePhysicsSubscription(api);

  useFrame((_, delta) => {
    const { sails, steer } = controls;

    const sailSpeedModifier = sails === -1 ? reverseSailSpeedModifier : sails;
    let sailTurnModifier = 0;
    if (sails < 0) sailTurnModifier = reverseSailTurnModifier;
    if (sails > 0) sailTurnModifier = forwardSailTurnModifier;

    if (steer < 0) {
      api.applyTorque([0, 0, turnTorque * sailTurnModifier * delta]);
    }
    if (steer > 0) {
      api.applyTorque([0, 0, -turnTorque * sailTurnModifier * delta]);
    }

    const forward = physics.current.forward;
    api.applyImpulse(
      [
        forward.x * sailSpeed * sailSpeedModifier * delta,
        forward.y * sailSpeed * sailSpeedModifier * delta,
        0,
      ],
      [0, 0, 0],
    );

    const position = physics.current.position;
    updatePlayer(playerNumber, {
      position: [position.x, position.y],
    });
  });

  return { shipRef, api, physics };
}
