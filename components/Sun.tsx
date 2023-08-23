import React, { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { AmbientLight, DirectionalLight, Group } from "three";
import kelvinToRGB from "lib/kelvin";

export default function Sun() {
  const sunRef = useRef<Group>(null!);
  const ambientRef = useRef<AmbientLight>(null!);
  const directionalRef = useRef<DirectionalLight>(null!);

  const arcLength = Math.PI * 0.65;

  useFrame((_, delta) => {
    // Rotate sun
    sunRef.current.rotation.y -= 0.15 * delta;
    if (sunRef.current.rotation.y < -arcLength) {
      sunRef.current.rotation.y = arcLength;
    }
    // Determine percentage of the day
    const dayPercentage =
      (arcLength - Math.abs(sunRef.current.rotation.y)) / arcLength;
    ambientRef.current.intensity = Math.pow(dayPercentage, 0.5) * 0.3;
    ambientRef.current.color.set(
      kelvinToRGB(Math.pow(dayPercentage, 0.7) * 5000)
    );
    directionalRef.current.color.set(
      kelvinToRGB(Math.pow(dayPercentage, 0.7) * 5000)
    );
  });

  useLayoutEffect(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y = arcLength;
    }
  }, []);

  return (
    <group ref={sunRef}>
      <ambientLight ref={ambientRef} />
      <directionalLight
        ref={directionalRef}
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
