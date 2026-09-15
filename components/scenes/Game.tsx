import GameCanvas from "components/canvas/GameCanvas";
import { usePlayerStore } from "stores/playerStore";
import { useGameStore } from "stores/gameStore";
import Scoreboard from "components/ui/Scoreboard/Scoreboard";
import Countdown from "components/ui/HUD/Countdown";
import { useCountdown } from "hooks/useCountdown";

const countdownSeconds = 3;

export default function Game(props: { debug: boolean }) {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const scene = useGameStore((state) => state.scene);
  const setScene = useGameStore((state) => state.setScene);

  const timeToStart = useCountdown(countdownSeconds, () => {
    if (scene === "countdown") setScene("playing");
  });

  return (
    <>
      <Scoreboard />
      {scene === "countdown" && <Countdown timeToStart={timeToStart} />}
      <GameCanvas debug={props.debug} players={joinedPlayers} />
    </>
  );
}
