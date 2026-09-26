import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { audio } from "lib/audio";
import Cannonball from "components/entities/Cannonball";
import type { PhysicsState } from "hooks/usePhysicsSubscription";
import { cannonCoolDown, cannonballLifetime } from "config/physics";

type CannonballState = {
  id: string;
  fired: number;
  velocity: [number, number, number];
  position: [number, number, number];
};

type PlayerCannonProps = {
  firePort: boolean;
  fireStarboard: boolean;
  physics: { current: PhysicsState };
};

/**
 * Spawns and tracks a player's cannonballs, applying cooldown and lifetime.
 */
export default function PlayerCannon(props: PlayerCannonProps) {
  const [cannonballs, setCannonballs] = useState<CannonballState[]>([]);
  const timeToShoot = useRef(0);

  const fireCannon = (direction: number) => {
    const now = Date.now();
    if (now < timeToShoot.current) return;
    timeToShoot.current = now + cannonCoolDown;
    audio.play("cannonShot");

    const { position, rotation, forward } = props.physics.current;
    const velocity = new Vector3()
      .copy(forward)
      .applyAxisAngle(new Vector3(0, 0, -direction), Math.PI / 2)
      .multiplyScalar(0.3);

    const position1 = new Vector3(direction * 0.02, -0.005, 0.02)
      .applyAxisAngle(new Vector3(0, 0, 1), rotation)
      .add(position);
    const position2 = new Vector3(direction * 0.02, 0.015, 0.02)
      .applyAxisAngle(new Vector3(0, 0, 1), rotation)
      .add(position);

    setCannonballs((current) => [
      ...current.filter(
        (cannonball) => now - cannonball.fired < cannonballLifetime,
      ),
      {
        id: now + "a",
        fired: now,
        velocity: [velocity.x, velocity.y, 0.4],
        position: [position1.x, position1.y, position1.z],
      },
      {
        id: now + "b",
        fired: now,
        velocity: [velocity.x, velocity.y, 0.4],
        position: [position2.x, position2.y, position1.z],
      },
    ]);
  };

  useFrame(() => {
    if (props.firePort) fireCannon(-1);
    if (props.fireStarboard) fireCannon(1);
  });

  return (
    <>
      {cannonballs.map((cannonball) => (
        <Cannonball
          key={cannonball.id}
          position={cannonball.position}
          velocity={cannonball.velocity}
        />
      ))}
    </>
  );
}
