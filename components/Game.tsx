import Board from "components/Board";
import Sun from "components/Sun";
import Camera from "components/Camera";
import { useGameStore } from "stores/gameStore";

export default function Game(props: { seed: string; debug: boolean }) {
  const joinedPlayers = useGameStore((state) => state.joinedPlayers);

  return (
    <>
      <Board seed={props.seed} debug={props.debug} players={joinedPlayers} />
      <Sun />
      <Camera />
    </>
  );
}
