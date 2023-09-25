import React, { useRef, useLayoutEffect } from "react";
import { Physics, Debug } from "@react-three/cannon";
import Terrain from "components/Terrain";
import Ocean from "components/Ocean";
import Player from "components/Player";
import Border from "components/Border";
import { Group } from "three";

const BoardPieces = (props: { seed: string }) => {
  return (
    <>
      {/* <Border position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Border position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Border position={[-1, 0, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
      <Border position={[1, 0, 0]} rotation={[Math.PI / 2, -Math.PI / 2, 0]} /> */}
      <Ocean />
      <Terrain seed={props.seed} />
      <Player />
    </>
  );
};

export default function Board(props: { seed: string; debug: boolean }) {
  const boardRef = useRef<Group>(null!);

  return (
    <group ref={boardRef} onClick={() => console.log("click")}>
      <Physics gravity={[0, 0, -1]}>
        {(props.debug && (
          <Debug color="green">
            <BoardPieces seed={props.seed} />
          </Debug>
        )) || <BoardPieces seed={props.seed} />}
      </Physics>
    </group>
  );
}
