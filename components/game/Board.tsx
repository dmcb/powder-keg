import React, { useRef } from "react";
import { Physics, Debug } from "@react-three/cannon";
import Terrain from "components/game/Terrain";
import Ocean from "components/game/Ocean";
import Player from "components/game/Player";
import Border from "components/game/Border";
import { Group } from "three";
import { useControls } from "leva";
import { useGameStore } from "stores/gameStore";

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
      <Physics gravity={[0, 0, -1]}>
        {(props.debug && physicsOverlay && (
          <Debug color="green" key={seed}>
            <BoardPieces seed={seed} players={props.players} />
          </Debug>
        )) || <BoardPieces seed={seed} players={props.players} />}
      </Physics>
    </group>
  );
}
