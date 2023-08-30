import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import {
  RigidBody,
  RapierRigidBody,
  CuboidCollider,
  quat,
  BallCollider,
} from "@react-three/rapier";
import Ship from "models/Ship";
import { Vector3 } from "three";

export default function Player() {
  const rigidBody = useRef<RapierRigidBody>(null);

  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((_, delta) => {
    const { leftward, rightward } = getKeys();

    if (rigidBody.current) {
      if (leftward) {
        rigidBody.current.applyTorqueImpulse(
          { x: 0, y: 0, z: 0.00001 * delta },
          true
        );
      }
      if (rightward) {
        rigidBody.current.applyTorqueImpulse(
          { x: 0, y: 0, z: -0.00001 * delta },
          true
        );
      }

      const direction = new Vector3(0, 1, 0);
      const rotation = quat(rigidBody.current.rotation());
      direction.applyQuaternion(rotation);
      rigidBody.current.applyImpulse(
        {
          x: direction.x * 0.0006 * delta,
          y: direction.y * 0.0006 * delta,
          z: 0,
        },
        true
      );
    }
  });

  return (
    <RigidBody
      ref={rigidBody}
      position={[-0.92, -0.92, 0]}
      enabledRotations={[false, false, true]}
      enabledTranslations={[true, true, false]}
      angularDamping={70}
      linearDamping={70}
      restitution={8}
      scale={[0.01, 0.01, 0.01]}
      rotation={[0, 0, 0]}
    >
      <Ship />
      <CuboidCollider position={[0, 1, 1]} args={[1.8, 3.8, 1]} />
    </RigidBody>
  );
}
