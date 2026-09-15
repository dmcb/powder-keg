import { useRef } from "react";
import { useGamepadStore } from "stores/gamepadStore";

const steerDeadzone = 0.2;

export type PlayerInput = {
  steer: number; // -1 to 1
  sailUp: boolean;
  sailDown: boolean;
  firePort: boolean;
  fireStarboard: boolean;
};

const neutralInput: PlayerInput = {
  steer: 0,
  sailUp: false,
  sailDown: false,
  firePort: false,
  fireStarboard: false,
};

/**
 * Normalizes a single player's gamepad state into intent-based input, so
 * other input sources (keyboard, touch, network) can plug into the same
 * shape later. `sailUp`/`sailDown` are edge-triggered (true only on the
 * frame the button is first pressed).
 */
export function useGamepad(playerNumber: number): () => PlayerInput {
  const gamepads = useGamepadStore((state) => state.gamepads);
  const sailUpPreviouslyPressed = useRef(false);
  const sailDownPreviouslyPressed = useRef(false);

  return () => {
    const gamepad = gamepads[playerNumber];
    if (!gamepad) {
      sailUpPreviouslyPressed.current = false;
      sailDownPreviouslyPressed.current = false;
      return neutralInput;
    }

    const steer = gamepad.axes[0];
    const sailUpPressed = gamepad.buttons[0].pressed;
    const sailDownPressed = gamepad.buttons[1].pressed;
    const sailUp = sailUpPressed && !sailUpPreviouslyPressed.current;
    const sailDown = sailDownPressed && !sailDownPreviouslyPressed.current;
    sailUpPreviouslyPressed.current = sailUpPressed;
    sailDownPreviouslyPressed.current = sailDownPressed;

    return {
      steer: Math.abs(steer) > steerDeadzone ? steer : 0,
      sailUp,
      sailDown,
      firePort: gamepad.buttons[6].pressed,
      fireStarboard: gamepad.buttons[7].pressed,
    };
  };
}
