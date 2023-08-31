import { useRef, useEffect, useState } from "react";
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
  const shipRef = useRef<THREE.Group>(null!);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [sails, setSails] = useState(0);

  useFrame((_, delta) => {
    const { leftward, rightward } = getKeys();

    if (rigidBody.current) {
      const sailSpeedModifier = sails === -1 ? -0.25 : sails;

      if (leftward) {
        rigidBody.current.applyTorqueImpulse(
          { x: 0, y: 0, z: 0.000005 * sailSpeedModifier * delta },
          true
        );
      }
      if (rightward) {
        rigidBody.current.applyTorqueImpulse(
          { x: 0, y: 0, z: -0.000005 * sailSpeedModifier * delta },
          true
        );
      }

      const direction = new Vector3(0, 1, 0);
      const rotation = quat(rigidBody.current.rotation());
      direction.applyQuaternion(rotation);
      rigidBody.current.applyImpulse(
        {
          x: direction.x * 0.0003 * sailSpeedModifier * delta,
          y: direction.y * 0.0003 * sailSpeedModifier * delta,
          z: 0,
        },
        true
      );
    }
  });

  useEffect(() => {
    subscribeKeys(
      (state) => state.forward,
      (value) => {
        if (value) {
          incrementSails(1);
        }
      }
    );
    subscribeKeys(
      (state) => state.backward,
      (value) => {
        if (value) {
          incrementSails(-1);
        }
      }
    );
  }, []);

  const incrementSails = (value: number) => {
    setSails((sails) => {
      const newSails = sails + value;
      if (newSails < -1) {
        return -1;
      }
      if (newSails > 2) {
        return 2;
      }
      return newSails;
    });
  };

  // useEffect(() => {
  //   if (shipRef.current) {
  //     shipRef.current.setSails(sails);
  //   }
  // }, [sails]);

  return (
    <RigidBody
      ref={rigidBody}
      position={[-0.92, -0.92, 0]}
      enabledRotations={[false, false, true]}
      enabledTranslations={[true, true, false]}
      angularDamping={70}
      linearDamping={70}
      restitution={0}
      scale={[0.01, 0.01, 0.01]}
      rotation={[0, 0, 0]}
    >
      <Ship ref={shipRef} sails={sails} />
      <CuboidCollider position={[0, 1, 1]} args={[1.8, 3.8, 1]} />
    </RigidBody>
  );
}
