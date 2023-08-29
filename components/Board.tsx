import React, { useRef, useEffect } from "react";
import { RigidBody, Physics } from "@react-three/rapier";
import Terrain from "components/Terrain";
import Ocean from "components/Ocean";
import Sun from "components/Sun";
import Player from "components/Player";
import Barrier from "components/Barrier";

export default function Board(props: { seed: string; debug: boolean }) {
  const boardRef = useRef<THREE.Group>(null!);
  const surfaceRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.position.y = 0.08;
    }
    if (surfaceRef.current) {
      surfaceRef.current.rotation.z = -Math.PI / 4;
    }
  }, []);

  return (
    <group ref={boardRef}>
      <group ref={surfaceRef}>
        <Physics
          colliders={false}
          gravity={[0, 0, 0]}
          debug={props.debug ? true : false}
        >
          <Player />
          <Barrier position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]} />
          <Barrier position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} />
          <Barrier
            position={[-1, 0, 0]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
          />
          <Barrier
            position={[1, 0, 0]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
          />
        </Physics>
        <Ocean />
        <Terrain seed={props.seed} />
      </group>
      <Sun />
    </group>
  );
}
