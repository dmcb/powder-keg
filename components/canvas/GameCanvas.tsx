import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { OrbitControls } from "@react-three/drei";
import Board from "components/canvas/Board";
import Sun from "components/environment/Sun";
import SplitScreen from "components/canvas/SplitScreen";
import GameClock from "components/canvas/GameClock";

type GameCanvasProps = {
  debug: boolean;
  players: number[];
};

/**
 * R3F canvas wrapper for the active game board: physics world, lighting,
 * and camera, plus optional debug overlays.
 */
export default function GameCanvas(props: GameCanvasProps) {
  return (
    <Canvas
      shadows={true}
      camera={{ fov: 9, position: [0, 0, 17] }}
      style={{ height: "100svh" }}
    >
      <GameClock />
      {props.debug && <Perf position="top-left" />}
      {props.debug && <OrbitControls />}
      <Board debug={props.debug} players={props.players} />
      <Sun />
      <SplitScreen debug={props.debug} />
    </Canvas>
  );
}
