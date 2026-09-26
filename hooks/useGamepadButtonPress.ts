import { useEffect, useRef } from "react";
import { useGamepadStore } from "stores/gamepadStore";

/**
 * Tracks one button on a player's gamepad and calls `onPress` on each new
 * press. A button already held when the hook mounts is ignored until it is
 * released. Returns whether the button is currently held.
 */
export function useGamepadButtonPress(
  playerNumber: number,
  button: number,
  onPress: () => void,
) {
  const pressed = useGamepadStore(
    (state) => state.gamepads[playerNumber]?.buttons[button]?.pressed ?? false,
  );
  const armed = useRef(!pressed);

  useEffect(() => {
    if (!pressed) {
      armed.current = true;
    } else if (armed.current) {
      armed.current = false;
      onPress();
    }
  }, [pressed]);

  return pressed;
}
