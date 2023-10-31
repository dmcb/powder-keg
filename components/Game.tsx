import Board from "components/Board";
import Sun from "components/Sun";
import Camera from "components/Camera";
import { usePlayerStore } from "stores/playerStore";

export default function Game(props: { seed: string; debug: boolean }) {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);

  return (
    <>
      <Board seed={props.seed} debug={props.debug} players={joinedPlayers} />
      <Sun />
      <Camera />
    </>
  );
}
