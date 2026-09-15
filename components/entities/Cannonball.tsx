import { useSphere } from "@react-three/cannon";
import { useRef } from "react";
import type { Mesh } from "three";
import type { Triplet } from "@react-three/cannon";

type CannonballProps = {
  position: Triplet;
  velocity: Triplet;
};

export default function Cannonball(props: CannonballProps) {
  const [sphereRef] = useSphere(
    () => ({
      allowSleep: true,
      args: [0.004],
      mass: 0.1,
      collisionFilterGroup: 1,
      collisionFilterMask: 1,
      position: props.position,
      velocity: props.velocity,
    }),
    useRef<Mesh>(null),
  );

  return (
    <mesh ref={sphereRef} castShadow name="cannonball">
      <sphereGeometry args={[0.004, 16, 16]} />
      <meshStandardMaterial color={"black"} />
    </mesh>
  );
}
