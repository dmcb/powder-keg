import { forwardRef, useEffect, useRef } from "react";
import type { Group } from "three";
import { audio } from "lib/audio";
import { useGameFrame } from "hooks/useGameFrame";
import { ocean, waveHeight } from "lib/waves";
import Ship from "components/entities/Player/Ship";

type PlayerShipProps = {
  sails: number;
  playerNumber: number;
};

// Half the hull's length/beam, where wave height is sampled to tilt the ship
const bobSampleDistance = 0.035;

/**
 * The visual hull for a player's ship: renders the ship mesh, bobs it on the
 * ocean's waves (visual only; the physics body stays flat) and plays the sail
 * sound when sails are raised.
 */
const PlayerShip = forwardRef<Group, PlayerShipProps>((props, ref) => {
  const bobRef = useRef<Group>(null!);

  useEffect(() => {
    if (props.sails >= 1) {
      audio.play("sail");
    }
  }, [props.sails]);

  useGameFrame((_, __, elapsed) => {
    const bob = bobRef.current;
    const body = bob.parent;
    const { enabled, height, tilt } = ocean.bobbing;
    if (!body || !enabled) {
      bob.position.z = 0;
      bob.rotation.set(0, 0, 0);
      return;
    }

    const { x, y } = body.position;
    const yaw = body.rotation.z;
    const d = bobSampleDistance;
    // Forward is the ship's local +Y, starboard its local +X
    const fx = -Math.sin(yaw) * d;
    const fy = Math.cos(yaw) * d;
    const bow = waveHeight(x + fx, y + fy, elapsed);
    const stern = waveHeight(x - fx, y - fy, elapsed);
    const starboard = waveHeight(x + fy, y - fx, elapsed);
    const port = waveHeight(x - fy, y + fx, elapsed);

    bob.position.z = ((bow + stern + starboard + port) / 4) * height;
    bob.rotation.x = Math.atan2(bow - stern, 2 * d) * tilt;
    bob.rotation.y = -Math.atan2(starboard - port, 2 * d) * tilt;
  });

  return (
    <group ref={ref}>
      <group ref={bobRef}>
        <Ship sails={props.sails} playerNumber={props.playerNumber} />
      </group>
    </group>
  );
});

PlayerShip.displayName = "PlayerShip";

export default PlayerShip;
