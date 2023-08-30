import React, { useRef, useLayoutEffect } from "react";
import { ThreeElements } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

export default function Border(props: ThreeElements["mesh"]) {
  const borderRef = useRef<THREE.Mesh>(null!);

  useLayoutEffect(() => {
    if (borderRef.current) {
      borderRef.current.position.z = -0.05;
    }
  }, []);

  return (
    <RigidBody type="fixed" colliders="hull" includeInvisible>
      <mesh {...props}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      <mesh {...props} ref={borderRef}>
        <planeGeometry args={[2, 0.1]} />
        <meshStandardMaterial color={"blue"} />
      </mesh>
    </RigidBody>
  );
}
