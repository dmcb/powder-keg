import PlayerConnectMenu from "components/ui/Menu/PlayerConnectMenu";
import { useGameStore } from "stores/gameStore";
import Borders from "components/ui/Decoration/Borders";
import "./ResumeScreen.css";

/**
 * Shown while the game is paused. Resumes once the joined, connected players
 * have held their ready buttons long enough, or when the button is clicked.
 */
export default function ResumeScreen() {
  const setPaused = useGameStore((state) => state.setPaused);

  return (
    <div id="resume">
      <Borders />
      <PlayerConnectMenu
        speed={2}
        action="resume"
        onComplete={() => setPaused(false)}
      />
    </div>
  );
}
