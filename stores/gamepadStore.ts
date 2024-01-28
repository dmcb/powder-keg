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
  updateGamepad: (gamepad: Gamepad) => void;
};

export const useGamepadStore = create<GamepadStore>()((set) => ({
  gamepads: [],
  updateGamepad: (gamepad: Gamepad) => {
    if (gamepad.index < 4) {
      set((state) => ({
        gamepads: [
          ...state.gamepads.slice(0, gamepad.index),
          gamepad,
          ...state.gamepads.slice(gamepad.index + 1),
        ],
      }));
    }
  },
}));
