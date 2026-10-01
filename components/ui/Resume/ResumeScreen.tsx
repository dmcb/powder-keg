import PlayerConnectMenu from "components/ui/Menu/PlayerConnectMenu";
import { useGameStore } from "stores/gameStore";
import "./ResumeScreen.css";

/**
 * Shown while the game is paused. Resumes once the joined, connected players
 * have held their ready buttons long enough, or when the button is clicked.
 */
export default function ResumeScreen() {
  const setPaused = useGameStore((state) => state.setPaused);

  return (
    <div id="resume">
      <PlayerConnectMenu action="resume" onComplete={() => setPaused(false)} />
    </div>
  );
}
