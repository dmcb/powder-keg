import React, { useRef, useLayoutEffect } from "react";
import { Group } from "three";
import Terrain from "components/Terrain";
import Ocean from "components/Ocean";
import Sun from "components/Sun";

export default function Board(props: { seed: string }) {
  const boardRef = useRef<Group>(null!);
  const surfaceRef = useRef<Group>(null!);

  useLayoutEffect(() => {
    if (boardRef.current) {
      boardRef.current.rotation.x = -Math.PI / 4.5;
    }
    if (surfaceRef.current) {
      surfaceRef.current.rotation.z = -Math.PI / 4;
    }
  }, []);

  return (
    <group ref={boardRef}>
      <group ref={surfaceRef}>
        <Terrain seed={props.seed} />
        <Ocean />
      </group>
      <Sun />
    </group>
  );
}
