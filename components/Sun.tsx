import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

export default function Sun() {
  const sunRef = useRef<Group>(null!);

  useFrame((_, delta) => {
    sunRef.current.rotation.y += 0.05 * delta;
  });

  return (
    <group ref={sunRef}>
      <directionalLight
        position={[-10, 0, 0]}
        color="white"
        castShadow={true}
      />
    </group>
  );
}
