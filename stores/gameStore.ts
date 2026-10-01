import { create } from "zustand";
import cryptoRandomString from "crypto-random-string";
import { generateGameSeed } from "config/seeds";
import { countdownSeconds } from "config/match";
import { gameClock } from "lib/gameClock";

export type GameScene = "lobby" | "playing" | "results";

type GameStore = {
  seed: string;
  scene: GameScene;
  latitude: number;
  paused: boolean;
  // Seconds left before play (re)starts; counts down after starting or resuming
  countdown: number;
  // Whether the countdown is resuming from pause, rather than starting a game
  resuming: boolean;
  setScene: (scene: GameScene) => void;
  setSeed: (seed: string) => void;
  setLatitude: (latitude: number) => void;
  startGame: () => void;
  pause: () => void;
  resume: () => void;
  tickCountdown: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  seed: generateGameSeed(),
  scene: "lobby",
  latitude: 0,
  paused: false,
  countdown: 0,
  resuming: false,
  setSeed: (seed: string) => {
    if (seed.trim() === "") {
      seed = cryptoRandomString({
        length: 6,
        type: "alphanumeric",
      }).toUpperCase();
    }
    set({ seed });
  },
  setScene: (scene: GameScene) => set({ scene }),
  setLatitude: (latitude: number) => set({ latitude }),
  startGame: () =>
    set({
      scene: "playing",
      paused: false,
      countdown: countdownSeconds,
      resuming: false,
    }),
  pause: () => set({ paused: true }),
  resume: () => {
    const { countdown, resuming } = get();
    // Paused during the start countdown: restart the match from sunrise, so
    // every match runs the same length of game time
    const restart = countdown > 0 && !resuming;
    if (restart) gameClock.reset();
    set({ paused: false, countdown: countdownSeconds, resuming: !restart });
  },
  tickCountdown: () =>
    set((state) => ({ countdown: Math.max(0, state.countdown - 1) })),
}));

/**
 * Game time and physics are stopped: while paused, and during the countdown
 * after resuming. The world runs during the countdown at the start of a game.
 */
export const isFrozen = (state: GameStore) =>
  state.paused || (state.resuming && state.countdown > 0);

/** Player input is ignored: while frozen, and during any countdown. */
export const areControlsLocked = (state: GameStore) =>
  state.paused || state.countdown > 0;
