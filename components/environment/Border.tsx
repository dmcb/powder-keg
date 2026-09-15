import React, { useRef, useLayoutEffect } from "react";
import type { Mesh } from "three";
import { usePlane } from "@react-three/cannon";
import type { PlaneProps } from "@react-three/cannon";
import type { Triplet } from "@react-three/cannon";

type BorderProps = {
  position: Triplet;
  rotation: Triplet;
};

export default function Border(props: BorderProps) {
  const [barrierRef] = usePlane<Mesh>(
    () =>
      ({
        mass: 0,
        ...props,
        collisionFilterGroup: 2,
        collisionFilterMask: 1,
      }) as PlaneProps,
    useRef<Mesh>(null),
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
      <mesh ref={borderRef} {...props}>
        <planeGeometry args={[2, 0.1]} />
        <meshStandardMaterial color={"blue"} side={2} />
      </mesh>
    </>
  );
}
