import React, { useRef, useLayoutEffect } from "react";
import { Physics } from "@react-three/rapier";
import Terrain from "components/Terrain";
import Ocean from "components/Ocean";
import Player from "components/Player";
import Border from "components/Border";

export default function Board(props: { seed: string; debug: boolean }) {
  const boardRef = useRef<THREE.Group>(null!);

  useLayoutEffect(() => {
    if (boardRef.current) {
      boardRef.current.rotation.z = -Math.PI / 4;
    }
  }, []);

  return (
    <group ref={boardRef} onClick={() => console.log("click")}>
      <Physics colliders={false} gravity={[0, 0, 0]}>
        <Player />
        <Border position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]} />
        <Border position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} />
        <Border
          position={[-1, 0, 0]}
          rotation={[Math.PI / 2, Math.PI / 2, 0]}
        />
        <Border position={[1, 0, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
        <Terrain seed={props.seed} />
      </Physics>
      <Ocean />
    </group>
  );
}
