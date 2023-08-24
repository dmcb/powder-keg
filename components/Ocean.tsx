import { ThreeElements } from "@react-three/fiber";

export default function Ocean(props: ThreeElements["mesh"]) {
  return (
    <mesh {...props} position={[0, 0, 0]} receiveShadow={true}>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial color={"blue"} transparent={true} opacity={0.7} />
    </mesh>
  );
}
