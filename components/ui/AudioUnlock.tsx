import { useEffect, useSyncExternalStore } from "react";
import { audio } from "lib/audio";
import { useGamepadStore } from "stores/gamepadStore";
import "./AudioUnlock.css";

const unlockEvents = ["pointerdown", "keydown", "touchend"] as const;

/**
 * Initializes the audio manager on app load and resumes it on the first user
 * activation. Gamepad presses never fire DOM events, but some browsers
 * (Chrome) count them as user activation, so we also retry on button presses.
 * Shows a hint while audio is still locked.
 */
export default function AudioUnlock() {
  const unlocked = useSyncExternalStore(
    audio.subscribe,
    () => audio.unlocked,
    () => true,
  );

  useEffect(() => {
    audio.init();
    unlockEvents.forEach((event) =>
      document.addEventListener(event, audio.unlock, true),
    );
    return () =>
      unlockEvents.forEach((event) =>
        document.removeEventListener(event, audio.unlock, true),
      );
  }, []);

  useEffect(() => {
    if (unlocked) return;
    return useGamepadStore.subscribe(({ gamepads }) => {
      const pressed = gamepads.some((gamepad) =>
        gamepad?.buttons.some((button) => button.pressed),
      );
      if (pressed && navigator.userActivation?.hasBeenActive) audio.unlock();
    });
  }, [unlocked]);

  return (
    !unlocked && (
      <div id="audio-hint">Click or press any key to enable sound</div>
    )
  );
}
