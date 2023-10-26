import { create } from "zustand";
import cryptoRandomString from "crypto-random-string";

const seedAdjective = [
  "blackened",
  "broken",
  "concealed",
  "dreaded",
  "fancy",
  "grand",
  "hidden",
  "mystic",
  "plentiful",
  "ravaged",
  "royal",
  "salted",
  "scorched",
  "secluded",
  "secret",
  "splendid",
  "stolen",
  "sunken",
  "sweet",
  "wrecked",
  "barracudas",
  "captains",
  "dragons",
  "guilds",
  "hunters",
  "krakens",
  "maidens",
  "mermaids",
  "parrots",
  "raiders",
  "sailors",
  "sharks",
  "shipwrecks",
  "sirens",
  "storms",
  "thieves",
  "tritons",
  "turtles",
  "wanderers",
];
const seedNoun = [
  "asylum",
  "bounty",
  "den",
  "fort",
  "gem",
  "harbor",
  "haven",
  "hideout",
  "hold",
  "jewel",
  "keep",
  "port",
  "refuge",
  "rest",
  "retreat",
  "sanctuary",
  "shelter",
  "stronghold",
  "treasure",
  "trove",
  "archipelago",
  "atoll",
  "bay",
  "bluff",
  "cliff",
  "cove",
  "crag",
  "enclave",
  "grove",
  "hollow",
  "island",
  "isle",
  "lagoon",
  "peninsula",
  "reef",
  "ridge",
  "rock",
  "sand",
  "shallow",
  "shore",
];

type Player = {
  index: number;
  name: string;
  connected: boolean;
};

type Store = {
  seed: string;
  gameStarted: boolean;
  players: Player[];
  setSeed: (seed: string) => void;
  startGame: () => void;
  updatePlayers: (players: Player[]) => void;
};

export const useGameStore = create<Store>()((set) => ({
  seed:
    seedAdjective[Math.floor(Math.random() * seedAdjective.length)] +
    seedNoun[Math.floor(Math.random() * seedNoun.length)],
  gameStarted: false,
  players: [
    { index: 0, name: "", connected: false },
    { index: 1, name: "", connected: false },
    { index: 2, name: "", connected: false },
    { index: 3, name: "", connected: false },
  ],
  setSeed: (seed: string) => {
    if (seed.trim() === "") {
      seed = cryptoRandomString({
        length: 6,
        type: "alphanumeric",
      }).toUpperCase();
    }
    set({ seed });
  },
  startGame: () => set({ gameStarted: true }),
  updatePlayers: (players: []) => set({ players }),
}));
