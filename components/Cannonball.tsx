import React, { useRef, useLayoutEffect } from "react";
import { ThreeElements } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

export default function Cannonball(props: ThreeElements["mesh"]) {
  const borderRef = useRef<THREE.Mesh>(null!);

  return (
    <RigidBody colliders="hull">
      <mesh {...props}>
        <circleGeometry args={[0.05, 32]} />
        <meshStandardMaterial color={"black"} />
      </mesh>
    </RigidBody>
  );
}
