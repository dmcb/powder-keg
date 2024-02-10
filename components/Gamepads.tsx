import { useFrame } from "@react-three/fiber";
import { useConnectionStore, useGamepadStore } from "stores/gamepadStore";

export default function Gamepads() {
  const connections = useConnectionStore((state) => state.connections);
  const addGamepad = useConnectionStore((state) => state.addGamepad);
  const removeGamepad = useConnectionStore((state) => state.removeGamepad);
  const updateGamepad = useGamepadStore((state) => state.updateGamepad);

  useFrame((_, delta) => {
    const detectedGamepads = navigator.getGamepads();
    console.log("detectedGamepads", detectedGamepads);
    for (var i = 0; i < detectedGamepads.length; i++) {
      const gamepad = detectedGamepads[i];
      if (gamepad && gamepad !== null) {
        if (gamepad.index in connections) {
          updateGamepad(gamepad);
        } else {
          console.log("Gamepad connected", gamepad.index);
          addGamepad(gamepad.index);
          updateGamepad(gamepad);
        }
      } else if (connections.includes(i)) {
        console.log("Gamepad disconnected", i);
        removeGamepad(i);
      }
    }
  });

  return <></>;
}
