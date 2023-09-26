import { useSphere } from "@react-three/cannon";
import { useRef } from "react";
import type { Mesh } from "three";

export default function Cannonball(Props) {
  const [sphereRef] = useSphere(
    () => ({
      args: [0.004],
      mass: 0.1,
      collisionFilterGroup: 1,
      collisionFilterMask: 1,
      position: Props.position,
      velocity: Props.velocity,
    }),
    useRef<Mesh>(null)
  );

  return (
    <mesh ref={sphereRef} castShadow>
      <sphereGeometry args={[0.004, 16, 16]} />
      <meshStandardMaterial color={"black"} />
    </mesh>
  );
}
