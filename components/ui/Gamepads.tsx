import { useEffect, useRef } from "react";
import { useConnectionStore, useGamepadStore } from "stores/gamepadStore";

const useAnimationFrame = (callback) => {
  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);

  const frame = (time) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(frame);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
};

export default function Gamepads() {
  const connections = useConnectionStore((state) => state.connections);
  const gamepads = useGamepadStore((state) => state.gamepads);
  const addGamepad = useConnectionStore((state) => state.addGamepad);
  const removeGamepad = useConnectionStore((state) => state.removeGamepad);
  const updateGamepads = useGamepadStore((state) => state.updateGamepads);

  const pollGamepads = (delta) => {
    const detectedGamepads = navigator.getGamepads();
    updateGamepads(detectedGamepads, delta);
  };

  useAnimationFrame((delta) => {
    pollGamepads(delta);
  });

  useEffect(() => {
    for (var i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (gamepad && gamepad !== null) {
        if (!connections.includes(gamepad.index)) {
          addGamepad(gamepad.index);
        }
      } else if (connections.includes(i)) {
        removeGamepad(i);
      }
    }
  }, [gamepads]);

  return <></>;
}
