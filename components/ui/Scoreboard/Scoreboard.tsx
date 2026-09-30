import { usePlayerStore } from "stores/playerStore";
import ScoreboardPlayer from "components/ui/Scoreboard/ScoreboardPlayer";
import "./Scoreboard.css";

export default function Scoreboard() {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);

  return (
    <div id="scoreboard">
      {joinedPlayers.map((playerNumber) => (
        <ScoreboardPlayer key={playerNumber} playerNumber={playerNumber} />
      ))}
    </div>
  );
}
