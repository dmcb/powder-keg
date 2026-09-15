import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGamepad } from "hooks/useGamepad";
import { minSails, maxSails } from "config/physics";

export type PlayerControls = {
  sails: number;
  steer: number;
  firePort: boolean;
  fireStarboard: boolean;
};

/**
 * Reads a player's gamepad input each frame and turns it into game intents:
 * incremental sail changes, steering, and cannon fire.
 */
export function usePlayerControls(playerNumber: number): PlayerControls {
  const getInput = useGamepad(playerNumber);
  const [sails, setSails] = useState(0);
  const controls = useRef<PlayerControls>({
    sails: 0,
    steer: 0,
    firePort: false,
    fireStarboard: false,
  });

  useFrame(() => {
    const input = getInput();

    if (input.sailUp) {
      setSails((current) => Math.min(maxSails, current + 1));
    }
    if (input.sailDown) {
      setSails((current) => Math.max(minSails, current - 1));
    }

    controls.current.steer = input.steer;
    controls.current.firePort = input.firePort;
    controls.current.fireStarboard = input.fireStarboard;
  });

  controls.current.sails = sails;

  return controls.current;
}
