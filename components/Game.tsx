import Board from "components/Board";
import Sun from "components/Sun";
import { useGameStore } from "stores/gameStore";

export default function Game(props: { seed: string; debug: boolean }) {
  const players = useGameStore((state) => state.players);

  return (
    <>
      <Board seed={props.seed} debug={props.debug} players={players} />
      <Sun />
    </>
  );
}
