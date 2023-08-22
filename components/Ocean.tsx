import { ThreeElements } from "@react-three/fiber";

export default function Ocean(props: ThreeElements["mesh"]) {
  return (
    <mesh {...props} position={[0, 0, 0.0625]}>
      <boxGeometry args={[2, 2, 0.125]} />
      <meshStandardMaterial color={"blue"} transparent={true} opacity={0.5} />
    </mesh>
  );
}
