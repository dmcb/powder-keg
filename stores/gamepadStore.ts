import { create } from "zustand";

type ConnectionStore = {
  connections: number[];
  addGamepad: (connection: number) => void;
  removeGamepad: (connection: number) => void;
};

export const useConnectionStore = create<ConnectionStore>()((set) => ({
  connections: [],
  addGamepad: (connection: number) => {
    console.log("Adding gamepad", connection);
    set((state) => ({ connections: [...state.connections, connection] }));
  },
  removeGamepad: (connection: number) => {
    console.log("Gamepad disconnected", connection);
    set((state) => ({
      connections: state.connections.filter((c) => c !== connection),
    }));
  },
}));

type GamepadStore = {
  gamepads: Gamepad[];
  delta: number;
  updateGamepads: (gamepads: Gamepad[], delta: number) => void;
};

export const useGamepadStore = create<GamepadStore>()((set) => ({
  gamepads: [],
  delta: 0,
  updateGamepads: (gamepads: Gamepad[], delta: number) =>
    set((state) => ({
      gamepads: gamepads,
      delta: delta,
    })),
}));
