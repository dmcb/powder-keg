import React, { useRef } from "react";
import type { Mesh } from "three";
import { usePlane } from "@react-three/cannon";
import type { PlaneProps } from "@react-three/cannon";
import type { Triplet } from "@react-three/cannon";
import { boardRadius } from "config/physics";

const wallSegments = 64;
const wallWidth = 2 * boardRadius * Math.tan(Math.PI / wallSegments);

function BorderWall(props: { angle: number }) {
  // Tangent to the board's circle, facing inwards
  const position: Triplet = [
    Math.cos(props.angle) * boardRadius,
    Math.sin(props.angle) * boardRadius,
    0,
  ];
  const rotation: Triplet = [Math.PI / 2, props.angle - Math.PI / 2, 0];
  const [barrierRef] = usePlane<Mesh>(
    () =>
      ({
        mass: 0,
        position,
        rotation,
        collisionFilterGroup: 2,
        collisionFilterMask: 1,
      }) as PlaneProps,
    useRef<Mesh>(null),
  );

  return (
    <mesh ref={barrierRef} name="border">
      <planeGeometry args={[wallWidth, 1]} />
      <meshStandardMaterial visible={false} />
    </mesh>
  );
}

export default function Border() {
  return (
    <>
      {Array.from({ length: wallSegments }, (_, i) => (
        <BorderWall key={i} angle={(i / wallSegments) * Math.PI * 2} />
      ))}
      <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry
          args={[boardRadius, boardRadius, 0.1, wallSegments, 1, true]}
        />
        <meshStandardMaterial color={"blue"} side={2} />
      </mesh>
    </>
  );
}
