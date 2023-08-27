import { useRef, useLayoutEffect, Suspense } from "react";
import Ship from "models/Ship";

export default function Player() {
  return (
    <>
      <Suspense fallback={null}>
        <Ship
          scale={[0.015, 0.015, 0.015]}
          position={[-0.92, -0.92, -0.005]}
          rotation={[Math.PI / 2, Math.PI - Math.PI / 4, 0]}
        />
      </Suspense>
    </>
  );
}
