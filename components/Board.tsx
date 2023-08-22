import React, { useRef, useLayoutEffect } from "react";
import { Group } from "three";
import Terrain from "components/Terrain";
import Ocean from "components/Ocean";
import Sun from "components/Sun";

export default function Board(props: { seed: string }) {
  const boardRef = useRef<Group>(null!);

  useLayoutEffect(() => {
    if (boardRef.current) {
      boardRef.current.rotation.z = -Math.PI / 4;
      boardRef.current.rotation.x = -Math.PI / 4.5;
    }
  }, []);

  return (
    <group ref={boardRef}>
      <ambientLight intensity={0.5} />
      <Terrain seed={props.seed} />
      <Ocean />
      <Sun />
    </group>
  );
}
