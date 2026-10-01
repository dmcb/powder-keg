import { create } from "zustand";
import cryptoRandomString from "crypto-random-string";
import { generateGameSeed } from "config/seeds";

export type GameScene = "lobby" | "playing" | "results";

const countdownSeconds = 3;

type GameStore = {
  seed: string;
  scene: GameScene;
  latitude: number;
  paused: boolean;
  // Seconds left before play (re)starts; counts down after starting or resuming
  countdown: number;
  setScene: (scene: GameScene) => void;
  setSeed: (seed: string) => void;
  setLatitude: (latitude: number) => void;
  startGame: () => void;
  pause: () => void;
  resume: () => void;
  tickCountdown: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  seed: generateGameSeed(),
  scene: "lobby",
  latitude: 0,
  paused: false,
  countdown: 0,
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
    set({ scene: "playing", paused: false, countdown: countdownSeconds }),
  pause: () => set({ paused: true }),
  resume: () => set({ paused: false, countdown: countdownSeconds }),
  tickCountdown: () =>
    set((state) => ({ countdown: Math.max(0, state.countdown - 1) })),
}));

/**
 * Game time, physics, game logic and player input are stopped: while paused,
 * and during the countdown after starting or resuming.
 */
export const isFrozen = (state: GameStore) =>
  state.paused || state.countdown > 0;
