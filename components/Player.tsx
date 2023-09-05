import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useBounds } from "@react-three/drei";
import {
  RigidBody,
  RapierRigidBody,
  CuboidCollider,
  quat,
  vec3,
} from "@react-three/rapier";
import { Vector3 } from "three";
import useSound from "use-sound";
import Ship from "models/Ship";
import usePlayerCamera from "lib/usePlayerCamera";

export default function Player() {
  const rigidBody = useRef<RapierRigidBody>(null);
  const shipRef = useRef<THREE.Group>(null!);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [sails, setSails] = useState(0);
  const playerCamera = usePlayerCamera();

  const [playSails] = useSound("sounds/sail.mp3", {
    volume: 0.5,
    playbackRate: Math.random() * 0.2 + 0.9,
  });

  useFrame((_, delta) => {
    const { leftward, rightward } = getKeys();

    if (rigidBody.current) {
      const sailSpeedModifier = sails === -1 ? -0.25 : sails;
      let sailTurnModifier = 0;
      if (sails < 0) sailTurnModifier = 0.5;
      if (sails > 0) sailTurnModifier = 1;

      if (leftward) {
        rigidBody.current.applyTorqueImpulse(
          { x: 0, y: 0, z: 0.000005 * sailTurnModifier * delta },
          true
        );
      }
      if (rightward) {
        rigidBody.current.applyTorqueImpulse(
          { x: 0, y: 0, z: -0.000005 * sailTurnModifier * delta },
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

      const position = vec3(rigidBody.current.translation());
      playerCamera.position.set(position.x, position.y, position.z);
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
    subscribeKeys(
      (state) => state.cameraToggle,
      (value) => {
        if (value) {
          adjustCamera();
        }
      }
    );
  }, []);

  const adjustCamera = () => {};

  const incrementSails = (value: number) => {
    setSails((sails) => {
      const newSails = sails + value;
      if (newSails < -1) {
        return -1;
      }
      if (newSails > 3) {
        return 3;
      }
      return newSails;
    });
  };

  useEffect(() => {
    if (sails >= 1) {
      playSails();
    }
  }, [sails]);

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
