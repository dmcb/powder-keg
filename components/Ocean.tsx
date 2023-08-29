import { ThreeElements } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

export default function Ocean(props: ThreeElements["mesh"]) {
  return (
    <RigidBody friction={1} type="fixed">
      <mesh {...props} position={[0, 0, 0]} receiveShadow={true}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color={"blue"} transparent={true} opacity={0.7} />
      </mesh>
    </RigidBody>
  );
}
