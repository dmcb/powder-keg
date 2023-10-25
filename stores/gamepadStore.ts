import { create } from "zustand";

type Store = {
  connections: number[];
  addGamepad: (connection: number) => void;
  removeGamepad: (connection: number) => void;
};

export const useConnectionStore = create<Store>()((set) => ({
  connections: [],
  addGamepad: (connection: number) =>
    set((state) => ({ connections: [...state.connections, connection] })),
  removeGamepad: (connection: number) =>
    set((state) => ({
      connections: state.connections.filter((c) => c !== connection),
    })),
}));
