import React, { useRef } from "react";
import { Physics, Debug } from "@react-three/cannon";
import Terrain from "components/Terrain";
import Ocean from "components/Ocean";
import Player from "components/Player";
import Border from "components/Border";
import { Group } from "three";
import { useControls } from "leva";

const BoardPieces = (props: {
  seed: string;
  players: { index: number; joined: boolean }[];
}) => {
  return (
    <>
      <Border position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Border position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Border position={[-1, 0, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
      <Border position={[1, 0, 0]} rotation={[Math.PI / 2, -Math.PI / 2, 0]} />
      <Ocean />
      <Terrain seed={props.seed} />
      {props.players
        .filter((player) => player.joined)
        .map((player) => {
          return <Player key={player.index} playerNumber={player.index} />;
        })}
    </>
  );
};

export default function Board(props: {
  seed: string;
  debug: boolean;
  players: { index: number; joined: boolean }[];
}) {
  const boardRef = useRef<Group>(null!);

  const { physicsOverlay } = useControls("Physics Overlay", {
    physicsOverlay: true,
  });

  return (
    <group ref={boardRef}>
      <Physics gravity={[0, 0, -1]}>
        {(props.debug && physicsOverlay && (
          <Debug color="green">
            <BoardPieces seed={props.seed} players={props.players} />
          </Debug>
        )) || <BoardPieces seed={props.seed} players={props.players} />}
      </Physics>
    </group>
  );
}
