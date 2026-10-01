import GameCanvas from "components/canvas/GameCanvas";
import { usePlayerStore } from "stores/playerStore";
import { useGameStore } from "stores/gameStore";
import Scoreboard from "components/ui/Scoreboard/Scoreboard";
import Countdown from "components/ui/HUD/Countdown";
import ResumeScreen from "components/ui/Resume/ResumeScreen";
import { usePauseOnHidden } from "hooks/usePauseOnHidden";

export default function Game(props: { debug: boolean }) {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const paused = useGameStore((state) => state.paused);

  usePauseOnHidden();

  return (
    <>
      <Scoreboard />
      {!paused && <Countdown />}
      <ResumeScreen open={paused} />
      <GameCanvas debug={props.debug} players={joinedPlayers} />
    </>
  );
}
