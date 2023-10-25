import { create } from "zustand";
// import cryptoRandomString from "crypto-random-string";

// const seed: string = cryptoRandomString({
//   length: 6,
//   type: "alphanumeric",
// });

type Store = {
  seed: string;
  gameStarted: boolean;
  players: [];
  startGame: (seed: string) => void;
  updatePlayers: (players: []) => void;
};

export const useGameStore = create<Store>()((set) => ({
  seed: "",
  gameStarted: false,
  players: [],
  startGame: (seed: string) => set({ gameStarted: true, seed }),
  updatePlayers: (players: []) => set({ players }),
}));
