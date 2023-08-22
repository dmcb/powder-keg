import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

export default function Sun() {
  const sunRef = useRef<Group>(null!);

  useFrame((_, delta) => {
    sunRef.current.rotation.y -= 0.1 * delta;
    if (Math.abs(sunRef.current.rotation.y) > Math.PI) {
      sunRef.current.rotation.y = 0;
    }
  });

  return (
    <group ref={sunRef}>
      <directionalLight
        position={[10, 0, 0]}
        color="white"
        castShadow={true}
        shadow-mapSize={[4096, 4096]}
        shadow-radius={0}
        shadow-normalBias={0.000001}
        shadow-camera-left={-1}
        shadow-camera-right={1}
        shadow-camera-top={1}
        shadow-camera-bottom={-1}
      />
    </group>
  );
}
