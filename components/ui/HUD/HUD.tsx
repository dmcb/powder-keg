import { usePlayerStore } from "stores/playerStore";
import { useGameStore } from "stores/gameStore";
import HUDPlayer from "components/ui/HUD/HUDPlayer";
import HUDTimer from "components/ui/HUD/HUDTimer";
import Countdown from "components/ui/HUD/Countdown";
import "./HUD.css";

/** In-game overlay: player panels in the corners, match timer and countdown. */
export default function HUD() {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const paused = useGameStore((state) => state.paused);

  return (
    <div id="hud">
      {joinedPlayers.map((playerNumber) => (
        <HUDPlayer key={playerNumber} playerNumber={playerNumber} />
      ))}
      <HUDTimer />
      {!paused && <Countdown />}
    </div>
  );
}
