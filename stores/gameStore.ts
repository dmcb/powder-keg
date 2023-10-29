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
  joined: boolean;
};

type Store = {
  seed: string;
  gameStarted: boolean;
  players: Player[];
  setSeed: (seed: string) => void;
  startGame: () => void;
  updatePlayer: (player: Player) => void;
  updatePlayers: (players: Player[]) => void;
};

export const useGameStore = create<Store>()((set) => ({
  seed:
    seedAdjective[Math.floor(Math.random() * seedAdjective.length)] +
    seedNoun[Math.floor(Math.random() * seedNoun.length)],
  gameStarted: false,
  players: [
    { index: 0, name: "", joined: false },
    { index: 1, name: "", joined: false },
    { index: 2, name: "", joined: false },
    { index: 3, name: "", joined: false },
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
  updatePlayer: (player: Player) => {
    set((state) => {
      const players = state.players.map((p) => {
        if (p.index === player.index) {
          return player;
        }
        return p;
      });
      return { players };
    });
  },
  updatePlayers: (players: Player[]) => set({ players }),
}));
