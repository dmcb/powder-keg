import { ThreeElements } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

export default function Barrier(props: ThreeElements["mesh"]) {
  return (
    <RigidBody type="fixed" colliders="hull" includeInvisible>
      <mesh {...props}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial visible={false} />
      </mesh>
    </RigidBody>
  );
}
