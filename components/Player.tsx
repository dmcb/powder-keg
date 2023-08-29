import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, RapierRigidBody, vec3 } from "@react-three/rapier";
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

      // const rotation = vec3(rigidBody.current.rotation());
      // console.log(rotation);
      // rigidBody.current.applyImpulse(
      //   {
      //     x: Math.sin(rotation.z) * 0.0003 * delta,
      //     y: Math.cos(rotation.z) * 0.0003 * delta,
      //     z: 0,
      //   },
      //   true
      // );
    }
  });

  return (
    <RigidBody
      ref={rigidBody}
      position={[-0.92, -0.92, 0]}
      friction={1.5}
      enabledRotations={[false, false, true]}
      enabledTranslations={[true, true, false]}
      angularDamping={10}
      linearDamping={10}
      rotation={[Math.PI / 2, Math.PI - Math.PI / 4, 0]}
      scale={[0.015, 0.015, 0.015]}
    >
      <Ship />
    </RigidBody>
  );
}
