import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useTapStore = create(
  subscribeWithSelector(() => ({ x: 0, y: 0 }))
);
export const useDragStore = create(
  subscribeWithSelector(() => ({ x: 0, y: 0 }))
);
