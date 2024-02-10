import Board from "components/Board";
import Sun from "components/Sun";
import Camera from "components/Camera";
import { useEffect, useState } from "react";
import { usePlayerStore } from "stores/playerStore";
import { useGameStore } from "stores/gameStore";

export default function Game(props: { debug: boolean }) {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const [timeToStart, setTimeToStart] = useState(3);
  const gameStarted = useGameStore((state) => state.gameStarted);
  const setStartGameplay = useGameStore((state) => state.startGameplay);

  useEffect(() => {
    let interval = null;
    if (gameStarted) {
      interval = setInterval(() => {
        setTimeToStart((timeToStart) => timeToStart - 1);
      }, 1000);
    } else if (!gameStarted || timeToStart === 0) {
      clearInterval(interval);
    }
    if (timeToStart === 0) {
      setStartGameplay();
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeToStart]);

  return (
    <>
      <Board debug={props.debug} players={joinedPlayers} />
      <Sun />
      <Camera />
    </>
  );
}
