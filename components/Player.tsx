import { useRef, useEffect, Suspense } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import Ship from "models/Ship";

export default function Player() {
  const rigidBody = useRef<RapierRigidBody>(null);

  useEffect(() => {
    if (rigidBody.current) {
      // rigidBody.current.addForce({ x: 0, y: 0.1, z: 0 }, true);
    }
  }, []);

  return (
    <RigidBody ref={rigidBody}>
      <Suspense fallback={null}>
        <Ship
          scale={[0.015, 0.015, 0.015]}
          position={[-0.92, -0.92, 0]}
          rotation={[Math.PI / 2, Math.PI - Math.PI / 4, 0]}
        />
      </Suspense>
    </RigidBody>
  );
}
