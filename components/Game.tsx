import Board from "components/Board";
import Sun from "components/Sun";
import Camera from "components/Camera";
import { usePlayerStore } from "stores/playerStore";

export default function Game(props: { debug: boolean }) {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);

  return (
    <>
      <Board debug={props.debug} players={joinedPlayers} />
      <Sun />
      <Camera />
    </>
  );
}
