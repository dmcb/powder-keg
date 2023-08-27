import React, { useRef, useLayoutEffect } from "react";
import Terrain from "components/Terrain";
import Ocean from "components/Ocean";
import Sun from "components/Sun";
import Player from "components/Player";

export default function Board(props: { seed: string }) {
  const boardRef = useRef<THREE.Group>(null!);
  const surfaceRef = useRef<THREE.Group>(null!);

  useLayoutEffect(() => {
    if (boardRef.current) {
      boardRef.current.rotation.x = -Math.PI / 6;
      boardRef.current.position.y = 0.08;
    }
    if (surfaceRef.current) {
      surfaceRef.current.rotation.z = -Math.PI / 4;
    }
  }, []);

  return (
    <group ref={boardRef}>
      <group ref={surfaceRef}>
        <Player />
        <Terrain seed={props.seed} />
        <Ocean />
      </group>
      <Sun />
    </group>
  );
}
