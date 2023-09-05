export default function Ocean(props: THREE.Mesh) {
  return (
    <mesh {...props} position={[0, 0, 0]} receiveShadow={true}>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial color={"blue"} transparent={true} opacity={0.85} />
    </mesh>
  );
}
