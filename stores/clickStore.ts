import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useStore = create(subscribeWithSelector(() => ({ x: 0, y: 0 })));
