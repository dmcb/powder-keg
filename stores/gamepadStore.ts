import { create } from "zustand";

type ConnectionStore = {
  connections: number[];
  addGamepad: (connection: number) => void;
  removeGamepad: (connection: number) => void;
};

export const useConnectionStore = create<ConnectionStore>((set) => ({
  connections: [],
  addGamepad: (connection: number) => {
    set((state) => ({ connections: [...state.connections, connection] }));
  },
  removeGamepad: (connection: number) => {
    set((state) => ({
      connections: state.connections.filter((c) => c !== connection),
    }));
  },
}));

type GamepadStore = {
  gamepads: (Gamepad | null)[];
  delta: number;
  updateGamepads: (gamepads: (Gamepad | null)[], delta: number) => void;
};

export const useGamepadStore = create<GamepadStore>((set) => ({
  gamepads: [],
  delta: 0,
  updateGamepads: (gamepads: (Gamepad | null)[], delta: number) =>
    set({ gamepads, delta }),
}));
