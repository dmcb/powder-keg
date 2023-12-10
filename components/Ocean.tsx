import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

function Ocean(props) {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Debug controls
  const [
    {
      colour,
      points,
      deltaAmplifier,
      amplitude,
      frequency,
      roughness,
      opacity,
    },
    set,
  ] = useControls("Ocean", () => ({
    colour: "#0000ff",
    points: {
      value: 50,
      min: 2,
      max: 100,
      step: 1,
    },
    deltaAmplifier: {
      value: 1,
      min: 0,
      max: 2,
      step: 0.1,
    },
    amplitude: {
      value: 0,
      min: 0,
      max: 0.1,
      step: 0.001,
    },
    frequency: {
      value: 5,
      min: 1,
      max: 20,
      step: 0.1,
    },
    roughness: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    opacity: {
      value: 0.885,
      min: 0,
      max: 1,
      step: 0.01,
    },
  }));

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] =
        Math.sin(positions[i] * frequency + time * deltaAmplifier) *
        Math.cos(positions[i + 1] * frequency + time * deltaAmplifier) *
        amplitude;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <mesh {...props} position={[0, 0, 0]} receiveShadow={true} ref={meshRef}>
      <planeGeometry args={[2, 2, points, points]} />
      <meshStandardMaterial
        color={colour}
        flatShading={true}
        transparent={true}
        opacity={opacity}
        roughness={roughness}
      />
    </mesh>
  );
}

export default Ocean;
