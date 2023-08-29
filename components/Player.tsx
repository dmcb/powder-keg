import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import Ship from "models/Ship";
import { Vector3 } from "three";

export default function Player() {
  const rigidBody = useRef<RapierRigidBody>(null);
  let direction = new Vector3(1, 1, 0);

  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((_, delta) => {
    const { leftward, rightward } = getKeys();

    if (leftward) {
      rigidBody.current.applyTorqueImpulse(
        { x: 0, y: 0, z: 0.00008 * delta },
        true
      );
    }
    if (rightward) {
      rigidBody.current.applyTorqueImpulse(
        { x: 0, y: 0, z: -0.00008 * delta },
        true
      );
    }

    // if (rigidBody.current) {
    //   rigidBody.current.applyImpulse(
    //     {
    //       x: direction.x * 0.0003 * delta,
    //       y: direction.y * 0.0003 * delta,
    //       z: 0,
    //     },
    //     true
    //   );
    // }
  });

  return (
    <RigidBody
      ref={rigidBody}
      position={[-0.92, -0.92, 0]}
      rotation={[Math.PI / 2, Math.PI - Math.PI / 4, 0]}
      friction={0.7}
    >
      <Ship scale={[0.015, 0.015, 0.015]} />
    </RigidBody>
  );
}
