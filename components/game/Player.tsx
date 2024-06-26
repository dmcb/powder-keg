import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Triplet, useCompoundBody } from "@react-three/cannon";
import { Vector3, Group } from "three";
import useSound from "use-sound";
import Ship from "components/game/Ship";
import Cannonball from "components/game/Cannonball";
import { useGamepadStore } from "stores/gamepadStore";
import { usePlayerStore } from "stores/playerStore";

const cannonCoolDown = 800;

export default function Player(props: { number: number }) {
  const gamepads = useGamepadStore((state) => state["gamepads"]);
  const player = usePlayerStore((state) => state["player" + props.number]);
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const updatePlayerHealth = usePlayerStore(
    (state) => state.updatePlayerHealth
  );
  const button0PreviouslyPressed = useRef(false);
  const button1PreviouslyPressed = useRef(false);

  const initialPosition = useMemo<Triplet>(() => {
    switch (props.number) {
      case 0:
        return [-0.92, 0.92, 0];
      case 1:
        return [0.92, -0.92, 0];
      case 2:
        return [-0.92, -0.92, 0];
      case 3:
        return [0.92, 0.92, 0];
    }
  }, [props.number]);

  const initialRotation = useMemo<Triplet>(() => {
    switch (props.number) {
      case 0:
        return [0, 0, (-3 * Math.PI) / 4];
      case 1:
        return [0, 0, Math.PI / 4];
      case 2:
        return [0, 0, -Math.PI / 4];
      case 3:
        return [0, 0, (3 * Math.PI) / 4];
    }
  }, [props.number]);

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
      rotation: initialRotation,
      position: initialPosition,
      collisionFilterGroup: 1,
      collisionFilterMask: 1 | 2,
      onCollide: (e) => {
        console.log(e);
        if (e.body.name != "border" && e.contact.impactVelocity > 0.1) {
          if (e.body.name == "terrain") {
            updatePlayerHealth(props.number, -e.contact.impactVelocity * 10);
          }
          if (e.body.name == "cannonball") {
            updatePlayerHealth(props.number, -10);
          }
        }
      },
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
  const [sails, setSails] = useState(0);

  // Player state
  const [cannonballs, setCannonballs] = useState([]);
  const state = useRef({
    timeToShoot: 0,
    position: new Vector3(),
    velocity: new Vector3(),
    rotation: 0,
    forward: new Vector3(),
    intendedDirection: 0,
    intendedPosition: new Vector3(),
  });

  useFrame((_, delta) => {
    // Set sailing speed
    const sailSpeedModifier = sails === -1 ? -0.25 : sails;
    let sailTurnModifier = 0;
    if (sails < 0) sailTurnModifier = 0.5;
    if (sails > 0) sailTurnModifier = 1;

    // Get gamepad input
    if (gamepads && gamepads[props.number]) {
      // Turn ship from gamepad input
      if (gamepads[props.number].axes[0] < -0.2) {
        api.applyTorque([0, 0, 5 * sailTurnModifier * delta]);
      }
      if (gamepads[props.number].axes[0] > 0.2) {
        api.applyTorque([0, 0, -5 * sailTurnModifier * delta]);
      }

      // Set sails from gamepad
      if (
        gamepads[props.number].buttons[0].pressed &&
        !button0PreviouslyPressed.current
      ) {
        incrementSails(1);
        button0PreviouslyPressed.current = true;
      } else if (!gamepads[props.number].buttons[0].pressed) {
        button0PreviouslyPressed.current = false;
      }
      if (
        gamepads[props.number].buttons[1].pressed &&
        !button1PreviouslyPressed.current
      ) {
        incrementSails(-1);
        button1PreviouslyPressed.current = true;
      } else if (!gamepads[props.number].buttons[1].pressed) {
        button1PreviouslyPressed.current = false;
      }

      // Fire cannons from gamepads
      if (gamepads[props.number].buttons[6].pressed) {
        fireCannon(-1);
      }
      if (gamepads[props.number].buttons[7].pressed) {
        fireCannon(1);
      }
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

    updatePlayer(props.number, {
      ...player,
      position: [state.current.position.x, state.current.position.y],
    });
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
      <Ship ref={shipRef} sails={sails} playerNumber={props.number} />
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
