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
  gamepads: Gamepad[];
  updateGamepads: (gamepads: Gamepad[]) => void;
};

export const useGamepadStore = create<GamepadStore>()((set) => ({
  gamepads: [],
  updateGamepads: (gamepads: Gamepad[]) =>
    set((state) => ({
      gamepads: gamepads,
    })),
}));
