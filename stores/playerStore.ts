import { create } from "zustand";

type Player = {
  name: string;
  health: number;
  position: [number, number];
};

type Store = {
  joinedPlayers: number[];
  player0: Player;
  player1: Player;
  player2: Player;
  player3: Player;
  updateJoinedPlayers: (joinedPlayers: number[]) => void;
  updatePlayer: (number: number, player: Player) => void;
  updatePlayerHealth: (number: number, health: number) => void;
};

export const usePlayerStore = create<Store>()((set) => ({
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
  updateJoinedPlayers: (joinedPlayers: number[]) => {
    console.log("Updating joined players", joinedPlayers);
    set({ joinedPlayers });
  },
  updatePlayer: (number: number, player: Player) => {
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
  updatePlayerHealth: (number: number, delta: number) => {
    const player = { ...usePlayerStore.getState()["player" + number] };
    player.health += delta;
    usePlayerStore.getState().updatePlayer(number, player);
  },
}));
