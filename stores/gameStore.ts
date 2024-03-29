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

type Store = {
  seed: string;
  gameScene: string;
  gameplayStarted: boolean;
  latitude: number;
  setScene: (scene: string) => void;
  setSeed: (seed: string) => void;
  startGameplay: () => void;
  setLatitude: (latitude: number) => void;
};

export const useGameStore = create<Store>()((set) => ({
  seed:
    seedAdjective[Math.floor(Math.random() * seedAdjective.length)] +
    seedNoun[Math.floor(Math.random() * seedNoun.length)],
  gameScene: "lobby",
  gameplayStarted: false,
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
  setScene: (gameScene: string) => set({ gameScene }),
  startGameplay: () => set({ gameplayStarted: true }),
  setLatitude: (latitude: number) => set({ latitude }),
}));
