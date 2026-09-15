import { create } from "zustand";

export type Player = {
  name: string;
  health: number;
  position: [number, number];
};

const createDefaultPlayer = (): Player => ({
  name: "",
  health: 100,
  position: [0, 0],
});

type PlayerStore = {
  players: Player[];
  joinedPlayers: number[];
  updateJoinedPlayers: (joinedPlayers: number[]) => void;
  updatePlayer: (index: number, data: Partial<Player>) => void;
  updatePlayerHealth: (index: number, delta: number) => void;
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  joinedPlayers: [],
  players: [
    createDefaultPlayer(),
    createDefaultPlayer(),
    createDefaultPlayer(),
    createDefaultPlayer(),
  ],
  updateJoinedPlayers: (joinedPlayers: number[]) => {
    set({ joinedPlayers });
  },
  updatePlayer: (index: number, data: Partial<Player>) => {
    set((state) => ({
      players: state.players.map((player, playerIndex) =>
        playerIndex === index ? { ...player, ...data } : player,
      ),
    }));
  },
  updatePlayerHealth: (index: number, delta: number) => {
    const player = get().players[index];
    const health = Math.max(0, player.health + delta);
    get().updatePlayer(index, { health });
  },
}));
