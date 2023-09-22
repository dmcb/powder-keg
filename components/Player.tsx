import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import {
  RigidBody,
  RapierRigidBody,
  CuboidCollider,
  quat,
  vec3,
} from "@react-three/rapier";
import { Vector3, Group } from "three";
import useSound from "use-sound";
import Ship from "components/Ship";
import Cannonball from "components/Cannonball";
import usePlayerCamera from "lib/usePlayerCamera";

const cannonCoolDown = 800;

export default function Player() {
  const rigidBody = useRef<RapierRigidBody>(null);
  const shipRef = useRef<Group>(null!);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [sails, setSails] = useState(0);
  const playerCamera = usePlayerCamera();

  const [playSails] = useSound("sounds/sail.mp3", {
    volume: 0.5,
    playbackRate: Math.random() * 0.2 + 0.9,
  });

  // Player state
  const [cannonballs, setCannonballs] = useState([]);
  const state = useRef({
    timeToShoot: 0,
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
      (state) => state.cannonleft,
      (value) => {
        if (value) {
          fireCannon(-1);
        }
      }
    );
    subscribeKeys(
      (state) => state.cannonright,
      (value) => {
        if (value) {
          fireCannon(-1);
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

  const fireCannon = (direction: number) => {
    const now = Date.now();
    if (now >= state.current.timeToShoot) {
      console.log("cannon fired at ", now);
      state.current.timeToShoot = now + cannonCoolDown;
      setCannonballs((cannonballs) => [
        ...cannonballs,
        {
          id: now + "a",
          position: [
            shipRef.current.position.x,
            shipRef.current.position.y,
            shipRef.current.position.z,
          ],
        },
        {
          id: now + "b",
          position: [
            shipRef.current.position.x,
            shipRef.current.position.y + 1,
            shipRef.current.position.z,
          ],
        },
      ]);
    }
  };

  const onCollisionEnter = (e) => {
    console.log("collision enter");
    const impactNormal = vec3(e.manifold.normal());
    // // Apply reflected impulse to ship off impactNormal
    // const impulse = vec3(e.manifold.local_ni);
    // const impulseMagnitude = impulse.length();
    // impulse.normalize();
    // const reflected = vec3(impactNormal);
    // reflected.scale(-2 * impulse.dot(impactNormal));
    // impulse.add(reflected);
    // impulse.scale(impulseMagnitude);
    // rigidBody.current.applyImpulse(impulse, true);
  };

  const onCollisionExit = (e) => {
    console.log("collision exit", e);
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
      {cannonballs.map((cannonball) => {
        return (
          <Cannonball key={cannonball.id} position={cannonball.position} />
        );
      })}
      <CuboidCollider
        position={[0, 1, 1]}
        args={[1.8, 3.8, 1]}
        onCollisionEnter={onCollisionEnter}
        onCollisionExit={onCollisionExit}
      />
    </RigidBody>
  );
}
