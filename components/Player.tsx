import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useCompoundBody, useDistanceConstraint } from "@react-three/cannon";
import { Vector3, Group } from "three";
import useSound from "use-sound";
import Ship from "components/Ship";
import Cannonball from "components/Cannonball";
import usePlayerCamera from "hooks/usePlayerCamera";
import { useTapStore, useDragStore } from "stores/pointerStore";

const cannonCoolDown = 800;

export default function Player() {
  const [playSails] = useSound("sounds/sail.mp3", {
    volume: 0.5,
    playbackRate: Math.random() * 0.4 + 0.8,
  });

  const [playCannonShot] = useSound("sounds/cannon-shot.mp3", {
    volume: 0.5,
    playbackRate: Math.random() * 0.4 + 0.8,
  });

  const [shipRef, api] = useCompoundBody(
    () => ({
      angularFactor: [0, 0, 1],
      linearFactor: [1, 1, 0],
      mass: 1,
      type: "Dynamic",
      angularDamping: 1,
      linearDamping: 0.999,
      rotation: [0, 0, -Math.PI / 4],
      position: [-0.92, -0.92, 0],
      collisionFilterGroup: 1,
      collisionFilterMask: 1 | 2,
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
    useRef<Group>(null)
  );
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [sails, setSails] = useState(0);
  const playerCamera = usePlayerCamera();

  // Player state
  const [cannonballs, setCannonballs] = useState([]);
  const state = useRef({
    timeToShoot: 0,
    position: new Vector3(),
    velocity: new Vector3(),
    rotation: 0,
    forward: new Vector3(),
    intendedDirection: 0,
    intendedDifferenceInAngle: 0,
    intendedPosition: new Vector3(),
  });

  useFrame((_, delta) => {
    // Move ship
    const { leftward, rightward } = getKeys();

    const sailSpeedModifier = sails === -1 ? -0.25 : sails;
    let sailTurnModifier = 0;
    if (sails < 0) sailTurnModifier = 0.5;
    if (sails > 0) sailTurnModifier = 1;

    // Turn ship according to keys
    if (leftward) {
      state.current.intendedDifferenceInAngle = 0;
      api.applyTorque([0, 0, 5 * sailTurnModifier * delta]);
    }
    if (rightward) {
      state.current.intendedDifferenceInAngle = 0;
      api.applyTorque([0, 0, -5 * sailTurnModifier * delta]);
    }
    // Turn ship according to click
    if (state.current.intendedDifferenceInAngle > 0.1) {
      api.applyTorque([
        0,
        0,
        state.current.intendedDirection * -5 * sailTurnModifier * delta,
      ]);
      state.current.intendedDifferenceInAngle =
        state.current.intendedPosition.angleTo(state.current.forward);
    } else {
      state.current.intendedDifferenceInAngle = 0;
    }

    // Move ship forward
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

  // Set state from physics
  useEffect(() => {
    api.position.subscribe((p) => state.current.position.set(p[0], p[1], p[2]));
    api.velocity.subscribe((v) => state.current.velocity.set(v[0], v[1], v[2]));
    api.rotation.subscribe((r) => {
      state.current.rotation = r[2];
      const direction = new Vector3(0, 1, 0);
      direction.applyAxisAngle(new Vector3(0, 0, 1), state.current.rotation);
      state.current.forward.copy(direction);
    });
  }, [api]);

  // Listen to keys and clicks
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
          fireCannon(1);
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
    useTapStore.subscribe((store) => {
      // Determine click position relative to ship
      const clickLocation = new Vector3(store.x, store.y, 0);
      const clickLocationRelativeToShip = new Vector3()
        .copy(clickLocation)
        .sub(
          new Vector3(state.current.position.x, state.current.position.y, 0)
        );
      const clickAngleRelativeToShip = clickLocationRelativeToShip.angleTo(
        state.current.forward
      );
      let clickOrientationRelativeToShip =
        clickLocationRelativeToShip.x * state.current.forward.y -
        clickLocationRelativeToShip.y * state.current.forward.x;
      if (clickOrientationRelativeToShip > 0) {
        clickOrientationRelativeToShip = 1;
      } else {
        clickOrientationRelativeToShip = -1;
      }

      // If tap is behind, lower sails
      if (clickAngleRelativeToShip > Math.PI - Math.PI / 4) {
        incrementSails(-1);
      }
      // If tap is ahead, raise sails
      else if (clickAngleRelativeToShip < Math.PI / 4) {
        incrementSails(1);
      }
      // Otherwise, fire cannons
      else {
        fireCannon(clickOrientationRelativeToShip);
      }
    });

    useDragStore.subscribe((store) => {
      // Determine click position relative to ship
      const clickLocation = new Vector3(store.x, store.y, 0);
      const clickLocationRelativeToShip = new Vector3()
        .copy(clickLocation)
        .sub(
          new Vector3(state.current.position.x, state.current.position.y, 0)
        );
      const clickAngleRelativeToShip = clickLocationRelativeToShip.angleTo(
        state.current.forward
      );
      let clickOrientationRelativeToShip =
        clickLocationRelativeToShip.x * state.current.forward.y -
        clickLocationRelativeToShip.y * state.current.forward.x;
      if (clickOrientationRelativeToShip > 0) {
        clickOrientationRelativeToShip = 1;
      } else {
        clickOrientationRelativeToShip = -1;
      }

      state.current.intendedDirection = clickOrientationRelativeToShip;
      state.current.intendedDifferenceInAngle = clickAngleRelativeToShip;
      state.current.intendedPosition = clickLocationRelativeToShip;
    });
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
      state.current.timeToShoot = now + cannonCoolDown;
      const velocity = new Vector3().copy(state.current.forward);
      velocity.applyAxisAngle(new Vector3(0, 0, -direction), Math.PI / 2);
      velocity.multiplyScalar(0.3);
      const position1 = new Vector3(
        direction * 0.02,
        -0.005,
        0.02
      ).applyAxisAngle(new Vector3(0, 0, 1), state.current.rotation);
      position1.add(state.current.position);
      const position2 = new Vector3(
        direction * 0.02,
        0.015,
        0.02
      ).applyAxisAngle(new Vector3(0, 0, 1), state.current.rotation);
      position2.add(state.current.position);
      setCannonballs((cannonballs) => [
        ...cannonballs.filter((cannonball) => now - cannonball.fired < 5000),
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
    }
  };

  useEffect(() => {
    if (sails >= 1) {
      playSails();
    }
  }, [sails]);

  useEffect(() => {
    if (cannonballs.length > 0) {
      playCannonShot();
    }
  }, [cannonballs]);

  return (
    <>
      <Ship ref={shipRef} sails={sails} />
      {cannonballs.map((cannonball) => {
        return (
          <Cannonball
            key={cannonball.id}
            position={cannonball.position}
            velocity={cannonball.velocity}
          />
        );
      })}
    </>
  );
}
