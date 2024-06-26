import React, { useEffect, useRef, PropsWithChildren } from "react";
import { useGamepadStore } from "stores/gamepadStore";

export default function ReadyButton(
  props: PropsWithChildren<{
    enabled: boolean;
    executeFunction: () => void;
    connections: any[];
  }>
) {
  const buttonRef = useRef(null);
  const gamepads = useGamepadStore((state) => state.gamepads);
  const delta = useGamepadStore((state) => state.delta);
  const readyProgress = useRef(0);

  // When controllers hold ready button, update ready progress
  useEffect(() => {
    if (props.enabled && gamepads && gamepads.length) {
      let readyChange = 0;
      gamepads.forEach((gamepad) => {
        readyChange -= (0.125 * delta) / 1000;
        if (gamepad && gamepad.buttons[0].pressed) {
          readyChange += delta / 1000;
        }
      });
      readyProgress.current += readyChange / props.connections.length;
      if (readyProgress.current < 0) readyProgress.current = 0;
      else if (readyProgress.current >= 1) {
        buttonRef.current.click();
      }
    }
  }, [gamepads]);

  // Execute function when button is pressed
  const execute = (e) => {
    e.preventDefault();
    props.executeFunction();
  };

  return (
    <button
      ref={buttonRef}
      type="submit"
      disabled={!props.enabled}
      onClick={execute}
      style={{
        background: `linear-gradient(90deg, #498207 ${
          readyProgress.current * 100
        }%, #433a32 ${readyProgress.current * 100}%)`,
      }}
    >
      {props.children}
    </button>
  );
}
