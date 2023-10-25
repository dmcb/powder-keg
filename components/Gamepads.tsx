import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useConnectionStore } from "stores/gamepadStore";

export default function Gamepads() {
  const gamepads = useRef([]);
  const addGamepadConnection = useConnectionStore((state) => state.addGamepad);
  const removeGamepadConnection = useConnectionStore(
    (state) => state.removeGamepad
  );

  const updateGamepad = (gamepad: Gamepad) => {
    gamepads.current = {
      ...gamepads.current,
      [gamepad.index]: gamepad,
    };
  };

  const addGamepad = (gamepad: Gamepad) => {
    console.log("Gamepad " + gamepad.index + " connected");
    addGamepadConnection(gamepad.index);
    updateGamepad(gamepad);
  };

  const removeGamepad = (index: number) => {
    console.log("Gamepad " + index + " disconnected");
    removeGamepadConnection(index);
    delete gamepads.current[index];
  };

  useFrame((_, delta) => {
    const detectedGamepads = navigator.getGamepads();
    for (var i = 0; i < detectedGamepads.length; i++) {
      const gamePad = detectedGamepads[i];
      if (gamePad && gamePad !== null) {
        if (gamePad.index in gamepads.current) {
          updateGamepad(gamePad);
        } else {
          addGamepad(gamePad);
        }
      } else if (i in gamepads.current) {
        removeGamepad(i);
      }
    }
  });

  return <></>;
}
