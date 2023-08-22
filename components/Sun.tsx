import React, { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

export default function Sun() {
  const sunRef = useRef<Group>(null!);

  useFrame((_, delta) => {
    sunRef.current.rotation.y -= 0.1 * delta;
    if (sunRef.current.rotation.y < Math.PI * -0.7) {
      sunRef.current.rotation.y = Math.PI * 0.7;
    }
  });

  useLayoutEffect(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y = Math.PI * 0.7;
    }
  }, []);

  return (
    <group ref={sunRef}>
      <directionalLight
        position={[0, 0, 2]}
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
