import Board from "components/game/Board";
import Sun from "components/game/Sun";
import Camera from "components/game/Camera";
import { useEffect, useState } from "react";
import { usePlayerStore } from "stores/playerStore";
import { useGameStore } from "stores/gameStore";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { OrbitControls } from "@react-three/drei";
import Scoreboard from "components/ui/Scoreboard";

export default function Game(props: { debug: boolean }) {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const [timeToStart, setTimeToStart] = useState(3);
  const setStartGameplay = useGameStore((state) => state.startGameplay);

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      setTimeToStart((timeToStart) => timeToStart - 1);
    }, 1000);
    if (timeToStart === 0) {
      clearInterval(interval);
    }
    if (timeToStart === 0) {
      setStartGameplay();
    }
    return () => clearInterval(interval);
  }, [timeToStart]);

  return (
    <>
      <Scoreboard />
      <Canvas
        shadows={true}
        camera={{ fov: 9, position: [0, 0, 17] }}
        style={{ height: "100svh" }}
      >
        {props.debug && <Perf position="top-left" />}
        {props.debug && <OrbitControls />}
        <Board debug={props.debug} players={joinedPlayers} />
        <Sun />
        <Camera />
      </Canvas>
    </>
  );
}
