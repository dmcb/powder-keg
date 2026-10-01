import { useEffect } from "react";
import { useGameStore } from "stores/gameStore";

/**
 * Pauses the game when the tab is hidden (tab switch, minimized window). The
 * game stays paused until players resume it from the resume screen.
 */
export function usePauseOnHidden() {
  const pause = useGameStore((state) => state.pause);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) pause();
    };
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      useGameStore.setState({ paused: false });
    };
  }, [pause]);
}
