import React, { useRef } from "react";
import { Physics, Debug } from "@react-three/cannon";
import Terrain from "components/environment/Terrain";
import Ocean from "components/environment/Ocean";
import Player from "components/entities/Player/Player";
import Border from "components/environment/Border";
import { Group } from "three";
import { useControls } from "leva";
import { isFrozen, useGameStore } from "stores/gameStore";
import { boardGravity } from "config/physics";

const BoardPieces = (props: { seed: string; players: number[] }) => {
  return (
    <>
      <Border />
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
  const frozen = useGameStore(isFrozen);

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
      <Physics gravity={boardGravity} isPaused={frozen}>
        {(props.debug && physicsOverlay && (
          <Debug color="green" key={seed}>
            <BoardPieces seed={seed} players={props.players} />
          </Debug>
        )) || <BoardPieces seed={seed} players={props.players} />}
      </Physics>
    </group>
  );
}
