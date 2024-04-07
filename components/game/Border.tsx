import React, { useRef, useLayoutEffect } from "react";
import type { Mesh } from "three";
import { usePlane } from "@react-three/cannon";

export default function Border(props) {
  const [barrierRef] = usePlane(
    () => ({
      mass: 0,
      ...props,
      collisionFilterGroup: 2,
      collisionFilterMask: 1,
    }),
    useRef<Mesh>(null)
  );
  const borderRef = useRef<Mesh>(null!);

  useLayoutEffect(() => {
    if (borderRef.current) {
      borderRef.current.position.z = -0.05;
    }
  }, []);

  return (
    <>
      <mesh ref={barrierRef} name="border">
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      <mesh ref={borderRef} {...props} doubleSided>
        <planeGeometry args={[2, 0.1]} />
        <meshStandardMaterial color={"blue"} side={2} />
      </mesh>
    </>
  );
}
