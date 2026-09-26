import { useEffect, useRef, PropsWithChildren } from "react";
import { useGamepadStore } from "stores/gamepadStore";
import ProgressButton from "components/ui/Menu/ProgressButton";

export default function ReadyButton(
  props: PropsWithChildren<{
    enabled: boolean;
    executeFunction: () => void;
    connections: number[];
  }>,
) {
  const buttonRef = useRef<HTMLButtonElement>(null);
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
        buttonRef.current?.click();
      }
    }
  }, [gamepads]);

  return (
    <ProgressButton
      ref={buttonRef}
      enabled={props.enabled}
      progress={readyProgress.current}
      onClick={props.executeFunction}
    >
      {props.children}
    </ProgressButton>
  );
}
