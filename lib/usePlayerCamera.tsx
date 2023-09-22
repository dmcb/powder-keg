import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useLayoutEffect } from "react";
import { Object3D, Vector3 } from "three";

export default function usePlayerCamera() {
  const { camera } = useThree();
  const cameraMaxDistance = 15;
  const cameraMinDistance = 6;
  const attachPoint = useMemo(() => new Object3D(), []);
  const followPoint = useMemo(() => {
    const cam = new Object3D();
    cam.position.y = -4.75;
    cam.position.z = cameraMaxDistance;
    return cam;
  }, []);

  const onDocumentMouseWheel = (e) => {
    const v = followPoint.position.z + e.deltaY * 0.006;
    if (v >= cameraMinDistance && v <= cameraMaxDistance) {
      followPoint.position.z = v;
    }
    return false;
  };

  const onDocumentPinch = (e) => {
    const v = followPoint.position.z / ((e.scale - 1) * 0.02 + 1);
    if (v >= cameraMinDistance && v <= cameraMaxDistance) {
      followPoint.position.z = v;
    }
    return false;
  };

  useFrame((_, delta) => {
    const focusPoint = new Vector3(0, 0, 0);
    focusPoint.lerp(
      attachPoint.position,
      1 -
        (followPoint.position.z - cameraMinDistance) /
          (cameraMaxDistance - cameraMinDistance)
    );
    camera.position.lerp(focusPoint, 1);
    camera.position.y =
      focusPoint.y +
      followPoint.position.y * (followPoint.position.z / cameraMaxDistance);
    camera.position.z = followPoint.position.z;
    camera.lookAt(focusPoint);
  });

  useLayoutEffect(() => {
    camera.position.set(0, followPoint.position.y, followPoint.position.z);
    document.addEventListener("wheel", onDocumentMouseWheel);
    return () => {
      document.removeEventListener("wheel", onDocumentMouseWheel);
    };
  }, []);

  return attachPoint;
}
