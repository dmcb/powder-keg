import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AmbientLight, DirectionalLight, Group } from "three";
import kelvinToRGB from "lib/kelvin";
import { useControls } from "leva";
import { useGameStore } from "stores/gameStore";

export default function Sun() {
  const sunRef = useRef<Group>(null!);
  const ambientRef = useRef<AmbientLight>(null!);
  const directionalRef = useRef<DirectionalLight>(null!);
  const latitude = useGameStore((state) => state.latitude);

  const [
    {
      dayLength,
      nightLength,
      sunRotationPerDay,
      sunRotationPerNight,
      middayExaggeration,
      dayProgress,
      nightProgress,
      maxDirectBrightness,
      directColorTempGradient,
      directMaxColorTemp,
      ambientBrightnessGradient,
      maxAmbientBrightness,
      ambientColorTempGradient,
      ambientMaxColorTemp,
    },
    set,
  ] = useControls("Sun", () => ({
    dayLength: {
      value: 300,
      min: 1,
      max: 600,
      step: 1,
    },
    nightLength: {
      value: 300,
      min: 1,
      max: 600,
      step: 1,
    },
    sunRotationPerDay: {
      value: 0.5,
      min: 0.01,
      max: 1,
      step: 0.01,
    },
    sunRotationPerNight: {
      value: 0.2,
      min: 0.01,
      max: 1,
      step: 0.01,
    },
    middayExaggeration: {
      value: 0.5,
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
    nightProgress: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    maxDirectBrightness: {
      value: 1.5,
      min: 0,
      max: 2,
      step: 0.01,
    },
    directColorTempGradient: {
      value: 1.9,
      min: 0,
      max: 2,
      step: 0.01,
    },
    directMaxColorTemp: {
      value: 5800,
      min: 0,
      max: 10000,
      step: 1,
    },
    ambientBrightnessGradient: {
      value: 0.3,
      min: 0,
      max: 2,
      step: 0.01,
    },
    maxAmbientBrightness: {
      value: 0.7,
      min: 0,
      max: 2,
      step: 0.01,
    },
    ambientColorTempGradient: {
      value: 0.9,
      min: 0,
      max: 2,
      step: 0.01,
    },
    ambientMaxColorTemp: {
      value: 5800,
      min: 0,
      max: 10000,
      step: 1,
    },
  }));

  useFrame((_, delta) => {
    // Get total rotation per day
    const sunArcPerDay = sunRotationPerDay * Math.PI * 2;

    // Get time of day
    const middayness = 1 - Math.abs(0.5 - dayProgress) * 2;
    set({ dayProgress: dayProgress + delta / dayLength });
    if (dayProgress >= 1) {
      set({ dayProgress: 0 });
    }

    // Rotate sun based on latitude
    sunRef.current.rotation.x = ((latitude / 90) * Math.PI) / 2;

    // Rotate sun over the day
    sunRef.current.rotation.y =
      (dayProgress - 0.5) *
      Math.pow(sunArcPerDay, 1 + middayExaggeration * middayness) *
      -1;

    // Get height of sun in sky to determine ambient light intensity and colour
    const sunnyPercentageOfDay = Math.PI / sunArcPerDay;
    const heightOfSun = Math.max(
      sunnyPercentageOfDay * 1.3 - Math.abs(0.5 - dayProgress) * 2,
      0
    );
    ambientRef.current.intensity =
      Math.pow(heightOfSun, ambientBrightnessGradient) * maxAmbientBrightness;
    ambientRef.current.color.set(
      kelvinToRGB(
        Math.pow(heightOfSun, ambientColorTempGradient) * ambientMaxColorTemp
      )
    );
    directionalRef.current.color.set(
      kelvinToRGB(
        Math.pow(heightOfSun, directColorTempGradient) * directMaxColorTemp
      )
    );
  });

  return (
    <group ref={sunRef}>
      <ambientLight ref={ambientRef} />
      <directionalLight
        ref={directionalRef}
        position={[0, 0, 2]}
        castShadow={true}
        intensity={maxDirectBrightness}
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
