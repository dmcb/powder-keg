import { usePlayerStore } from "stores/playerStore";
import ScoreboardPlayer from "./ScoreboardPlayer";

export default function Scoreboard() {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);

  return (
    <div id="scoreboard">
      {joinedPlayers.map((player) => (
        <ScoreboardPlayer playerNumber={player} />
      ))}
    </div>
  );
}
