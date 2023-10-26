import { create } from "zustand";

type ConnectionStore = {
  connections: number[];
  addGamepad: (connection: number) => void;
  removeGamepad: (connection: number) => void;
};

export const useConnectionStore = create<ConnectionStore>()((set) => ({
  connections: [],
  addGamepad: (connection: number) =>
    set((state) => ({ connections: [...state.connections, connection] })),
  removeGamepad: (connection: number) =>
    set((state) => ({
      connections: state.connections.filter((c) => c !== connection),
    })),
}));

type GamepadStore = {
  gamepad0: Gamepad;
  gamepad1: Gamepad;
  gamepad2: Gamepad;
  gamepad3: Gamepad;
  updateGamepad: (gamepad: Gamepad) => void;
};

export const useGamepadStore = create<GamepadStore>()((set) => ({
  gamepad0: null,
  gamepad1: null,
  gamepad2: null,
  gamepad3: null,
  updateGamepad: (gamepad: Gamepad) => {
    if (gamepad.index == 0) {
      set({ gamepad0: gamepad });
    } else if (gamepad.index == 1) {
      set({ gamepad1: gamepad });
    } else if (gamepad.index == 2) {
      set({ gamepad2: gamepad });
    } else if (gamepad.index == 3) {
      set({ gamepad3: gamepad });
    }
  },
}));
