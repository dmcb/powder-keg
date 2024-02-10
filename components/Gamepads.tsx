import { useFrame } from "@react-three/fiber";
import { useConnectionStore, useGamepadStore } from "stores/gamepadStore";

export default function Gamepads() {
  const connections = useConnectionStore((state) => state.connections);
  const addGamepad = useConnectionStore((state) => state.addGamepad);
  const removeGamepad = useConnectionStore((state) => state.removeGamepad);
  const updateGamepads = useGamepadStore((state) => state.updateGamepads);

  useFrame((_, delta) => {
    const detectedGamepads = navigator.getGamepads();
    for (var i = 0; i < detectedGamepads.length; i++) {
      const gamepad = detectedGamepads[i];
      if (gamepad && gamepad !== null) {
        if (!connections.includes(gamepad.index)) {
          console.log("Gamepad connected", gamepad.index);
          addGamepad(gamepad.index);
        }
      } else if (connections.includes(i)) {
        console.log("Gamepad disconnected", i);
        removeGamepad(i);
      }
    }
    updateGamepads(detectedGamepads);
  });

  return <></>;
}
