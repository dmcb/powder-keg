import React, { useRef, useLayoutEffect } from "react";
import { RigidBody, Physics } from "@react-three/rapier";
import Terrain from "components/Terrain";
import Ocean from "components/Ocean";
import Sun from "components/Sun";
import Player from "components/Player";
import Border from "components/Border";

export default function Board(props: { seed: string; debug: boolean }) {
  const boardRef = useRef<THREE.Group>(null!);
  const surfaceRef = useRef<THREE.Group>(null!);

  useLayoutEffect(() => {
    if (boardRef.current) {
      boardRef.current.position.y = 0.08;
    }
    if (surfaceRef.current) {
      surfaceRef.current.rotation.z = -Math.PI / 4;
    }
  }, []);

  return (
    <group ref={boardRef}>
      <group ref={surfaceRef} onClick={() => console.log("click")}>
        <Physics colliders={false} gravity={[0, 0, 0]}>
          <Player />
          <Border position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]} />
          <Border position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} />
          <Border
            position={[-1, 0, 0]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
          />
          <Border
            position={[1, 0, 0]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
          />
          <Terrain seed={props.seed} />
        </Physics>
        <Ocean />
      </group>
      <Sun />
    </group>
  );
}
