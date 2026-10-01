import GameCanvas from "components/canvas/GameCanvas";
import { usePlayerStore } from "stores/playerStore";
import { useGameStore } from "stores/gameStore";
import HUD from "components/ui/HUD/HUD";
import ResumeScreen from "components/ui/Resume/ResumeScreen";
import { usePauseOnHidden } from "hooks/usePauseOnHidden";

export default function Game(props: { debug: boolean }) {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const paused = useGameStore((state) => state.paused);

  usePauseOnHidden();

  return (
    <>
      <HUD />
      <ResumeScreen open={paused} />
      <GameCanvas debug={props.debug} players={joinedPlayers} />
    </>
  );
}
