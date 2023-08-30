import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AmbientLight, DirectionalLight, Group } from "three";
import kelvinToRGB from "lib/kelvin";
import { useControls } from "leva";

export default function Sun() {
  const sunRef = useRef<Group>(null!);
  const ambientRef = useRef<AmbientLight>(null!);
  const directionalRef = useRef<DirectionalLight>(null!);

  const [
    {
      dayLength,
      sunRotationsPerDay,
      middayExaggeration,
      dayProgress,
      ambientBrightnessGradient,
      colorTempGradient,
    },
    set,
  ] = useControls(() => ({
    dayLength: {
      value: 6,
      min: 1,
      max: 600,
      step: 1,
    },
    sunRotationsPerDay: {
      value: 0.65,
      min: 0.01,
      max: 1,
      step: 0.01,
    },
    middayExaggeration: {
      value: 0.8,
      min: 0,
      max: 1,
      step: 0.01,
    },
    dayProgress: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    ambientBrightnessGradient: {
      value: 0.3,
      min: 0,
      max: 2,
      step: 0.01,
    },
    colorTempGradient: {
      value: 0.8,
      min: 0,
      max: 2,
      step: 0.01,
    },
  }));

  useFrame((_, delta) => {
    // Get total rotation per day
    const sunArcPerDay = sunRotationsPerDay * Math.PI * 2;

    // Get time of day
    const middayness = 1 - Math.abs(0.5 - dayProgress) * 2;
    set({
      dayProgress:
        dayProgress +
        Math.pow(delta / dayLength, 1 + middayExaggeration * middayness),
    });
    if (dayProgress >= 1) {
      set({ dayProgress: 0 });
    }

    // Rotate sun
    sunRef.current.rotation.y = (dayProgress - 0.5) * sunArcPerDay * -1;

    // Get height of sun in sky to determine ambient light intensity and colour
    const sunnyPercentageOfDay = Math.PI / sunArcPerDay;
    const heightOfSun = Math.max(
      sunnyPercentageOfDay * 1.3 - Math.abs(0.5 - dayProgress) * 2,
      0
    );
    ambientRef.current.intensity =
      Math.pow(heightOfSun, ambientBrightnessGradient) * 0.4;
    ambientRef.current.color.set(
      kelvinToRGB(Math.pow(heightOfSun, colorTempGradient) * 5800)
    );
    directionalRef.current.color.set(
      kelvinToRGB(Math.pow(heightOfSun, colorTempGradient) * 5800)
    );
  });

  return (
    <group ref={sunRef}>
      <ambientLight ref={ambientRef} />
      <directionalLight
        ref={directionalRef}
        position={[0, 0, 2]}
        castShadow={true}
        shadow-mapSize={[2048, 2048]}
        shadow-radius={0}
        shadow-normalBias={0.000001}
        shadow-camera-left={-1.3}
        shadow-camera-right={1.3}
        shadow-camera-top={1.5}
        shadow-camera-bottom={-1.3}
      />
    </group>
  );
}
