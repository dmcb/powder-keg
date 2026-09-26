import { useEffect } from "react";
import { useGameStore } from "stores/gameStore";

/**
 * Pauses the game when the tab is hidden (tab switch, minimized window). The
 * game stays paused until players resume it from the resume screen.
 */
export function usePauseOnHidden() {
  const setPaused = useGameStore((state) => state.setPaused);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) setPaused(true);
    };
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      setPaused(false);
    };
  }, [setPaused]);
}
