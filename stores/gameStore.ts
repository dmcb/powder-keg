import { create } from "zustand";
import cryptoRandomString from "crypto-random-string";
import { generateGameSeed } from "config/seeds";

export type GameScene = "lobby" | "countdown" | "playing" | "results";

type GameStore = {
  seed: string;
  scene: GameScene;
  latitude: number;
  setScene: (scene: GameScene) => void;
  setSeed: (seed: string) => void;
  setLatitude: (latitude: number) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  seed: generateGameSeed(),
  scene: "lobby",
  latitude: 0,
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
}));
