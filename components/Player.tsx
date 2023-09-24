import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useBox } from "@react-three/cannon";
import { Vector3, Group } from "three";
import useSound from "use-sound";
import Ship from "components/Ship";
import Cannonball from "components/Cannonball";
import usePlayerCamera from "lib/usePlayerCamera";

const cannonCoolDown = 800;

export default function Player() {
  const [shipRef, api] = useBox(
    () => ({
      angularFactor: [0, 0, 1],
      linearFactor: [1, 1, 0],
      mass: 1,
      angularDamping: 1,
      linearDamping: 0.999,
      args: [0.035, 0.085, 0.1],
      position: [-0.92, -0.92, 0],
    }),
    useRef<Group>(null)
  );
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
    position: new Vector3(),
    velocity: new Vector3(),
    forward: new Vector3(),
  });

  useFrame((_, delta) => {
    const { leftward, rightward } = getKeys();

    const sailSpeedModifier = sails === -1 ? -0.25 : sails;
    let sailTurnModifier = 0;
    if (sails < 0) sailTurnModifier = 0.5;
    if (sails > 0) sailTurnModifier = 1;
    if (leftward) {
      api.applyTorque([0, 0, 5 * sailTurnModifier * delta]);
    }
    if (rightward) {
      api.applyTorque([0, 0, -5 * sailTurnModifier * delta]);
    }

    api.applyImpulse(
      [
        state.current.forward.x * 0.6 * sailSpeedModifier * delta,
        state.current.forward.y * 0.6 * sailSpeedModifier * delta,
        0,
      ],
      [0, 0, 0]
    );

    playerCamera.position.copy(state.current.position);
  });

  useEffect(() => {
    api.position.subscribe((p) => state.current.position.set(p[0], p[1], p[2]));
    api.velocity.subscribe((v) => state.current.velocity.set(v[0], v[1], v[2]));
    api.rotation.subscribe((r) => {
      const direction = new Vector3(0, 1, 0);
      direction.applyAxisAngle(new Vector3(0, 0, 1), r[2]);
      state.current.forward.copy(direction);
    });
  }, [api]);

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

  useEffect(() => {
    if (sails >= 1) {
      playSails();
    }
  }, [sails]);

  return (
    <>
      <Ship ref={shipRef} sails={sails} />
      {cannonballs.map((cannonball) => {
        return (
          <Cannonball key={cannonball.id} position={cannonball.position} />
        );
      })}
    </>
  );
}
