import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useLayoutEffect, useRef } from "react";
import { Object3D, Vector2, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";

const cameraTiltDistance = 4.3;
const cameraMaxDistance = 17.0;
const cameraMinDistance = 7;

export default function Camera() {
  const { camera } = useThree();
  let aspectRatio = useRef(0);

  const cameraOrigin = useMemo(() => {
    const cam = new Object3D();
    cam.position.set(0, 0, cameraMaxDistance);
    return cam;
  }, []);

  useFrame((state) => {
    // Check aspect ratio and keep entire board in view
    const { viewport } = state;
    if (viewport.aspect != aspectRatio.current) {
      aspectRatio.current = viewport.aspect;
      if (viewport.aspect < 1) {
        cameraOrigin.position.z = cameraMaxDistance / viewport.aspect;
      } else if (viewport.aspect > 1) {
        cameraOrigin.position.z = cameraMaxDistance;
      }
    }

    // // Lerp to targeted camera distance
    // if (Math.abs(followPoint.position.z - targetCameraDistance.current) > 0.1) {
    //   followPoint.position.z = lerp(
    //     followPoint.position.z,
    //     targetCameraDistance.current,
    //     0.1
    //   );
    // }

    // More zoom in, more adjustment to player's position
    // focusPoint.lerp(
    //   attachPoint.position,
    //   1 -
    //     (followPoint.position.z - cameraMinDistance) /
    //       (cameraMaxDistance - cameraMinDistance)
    // );

    // Focus camera and tilt it
    const focusPoint = new Vector3(0, 0, -0.1);
    camera.up.set(1, 1, 0);
    camera.position.copy(cameraOrigin.position);
    camera.position.add(
      new Vector3(
        -cameraTiltDistance * (cameraOrigin.position.z / cameraMaxDistance),
        -cameraTiltDistance * (cameraOrigin.position.z / cameraMaxDistance),
        0
      )
    );
    camera.lookAt(focusPoint);
  });

  return <></>;
}
