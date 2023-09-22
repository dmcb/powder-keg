import { ThreeElements } from "@react-three/fiber";

export default function Cannonball(props: ThreeElements["mesh"]) {
  return (
    <mesh {...props} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 16, 16]} />
      <meshStandardMaterial color={"black"} />
    </mesh>
  );
}
