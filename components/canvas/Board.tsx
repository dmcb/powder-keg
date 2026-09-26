import React, { useRef } from "react";
import { Physics, Debug } from "@react-three/cannon";
import Terrain from "components/environment/Terrain";
import Ocean from "components/environment/Ocean";
import Player from "components/entities/Player/Player";
import Border from "components/environment/Border";
import { Group } from "three";
import { useControls } from "leva";
import { useGameStore } from "stores/gameStore";
import { boardGravity } from "config/physics";

const BoardPieces = (props: { seed: string; players: number[] }) => {
  return (
    <>
      <Border position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Border position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Border position={[-1, 0, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
      <Border position={[1, 0, 0]} rotation={[Math.PI / 2, -Math.PI / 2, 0]} />
      <Ocean />
      <Terrain seed={props.seed} />
      {props.players.map((player, index) => {
        return <Player key={index} number={index} />;
      })}
    </>
  );
};

export default function Board(props: { debug: boolean; players: number[] }) {
  const boardRef = useRef<Group>(null!);
  const initialSeed = useGameStore((state) => state.seed);
  const paused = useGameStore((state) => state.paused);

  const { physicsOverlay, seed } = useControls("Game", {
    physicsOverlay: {
      value: true,
    },
    seed: {
      value: initialSeed,
    },
  });

  return (
    <group ref={boardRef}>
      <Physics gravity={boardGravity} isPaused={paused}>
        {(props.debug && physicsOverlay && (
          <Debug color="green" key={seed}>
            <BoardPieces seed={seed} players={props.players} />
          </Debug>
        )) || <BoardPieces seed={seed} players={props.players} />}
      </Physics>
    </group>
  );
}
