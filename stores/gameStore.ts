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
  name: string;
  health: number;
  position: [number, number];
};

type Store = {
  seed: string;
  gameStarted: boolean;
  joinedPlayers: number[];
  player0: Player;
  player1: Player;
  player2: Player;
  player3: Player;
  setSeed: (seed: string) => void;
  startGame: () => void;
  updateJoinedPlayers: (joinedPlayers: number[]) => void;
  updatePlayer: (player: Player, number: number) => void;
};

export const useGameStore = create<Store>()((set) => ({
  seed:
    seedAdjective[Math.floor(Math.random() * seedAdjective.length)] +
    seedNoun[Math.floor(Math.random() * seedNoun.length)],
  gameStarted: false,
  joinedPlayers: [],
  player0: {
    name: "",
    health: 100,
    position: [0, 0],
  },
  player1: {
    name: "",
    health: 100,
    position: [0, 0],
  },
  player2: {
    name: "",
    health: 100,
    position: [0, 0],
  },
  player3: {
    name: "",
    health: 100,
    position: [0, 0],
  },
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
  updateJoinedPlayers: (joinedPlayers: number[]) => set({ joinedPlayers }),
  updatePlayer: (player: Player, number: number) => {
    if (number == 0) {
      set({ player0: player });
    } else if (number == 1) {
      set({ player1: player });
    } else if (number == 2) {
      set({ player2: player });
    } else if (number == 3) {
      set({ player3: player });
    }
  },
}));
