import GameCanvas from "components/canvas/GameCanvas";
import { usePlayerStore } from "stores/playerStore";
import { useGameStore } from "stores/gameStore";
import Scoreboard from "components/ui/Scoreboard/Scoreboard";
import Countdown from "components/ui/HUD/Countdown";
import ResumeScreen from "components/ui/Resume/ResumeScreen";
import { useCountdown } from "hooks/useCountdown";
import { usePauseOnHidden } from "hooks/usePauseOnHidden";

const countdownSeconds = 3;

export default function Game(props: { debug: boolean }) {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const scene = useGameStore((state) => state.scene);
  const setScene = useGameStore((state) => state.setScene);
  const paused = useGameStore((state) => state.paused);

  usePauseOnHidden();

  const timeToStart = useCountdown(
    countdownSeconds,
    () => {
      if (scene === "countdown") setScene("playing");
    },
    paused,
  );

  return (
    <>
      <Scoreboard />
      {scene === "countdown" && !paused && (
        <Countdown timeToStart={timeToStart} />
      )}
      <ResumeScreen open={paused} />
      <GameCanvas debug={props.debug} players={joinedPlayers} />
    </>
  );
}
