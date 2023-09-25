import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useLayoutEffect, useRef, use } from "react";
import { Object3D, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";

const cameraMaxDistance = 16.25;
const cameraMinDistance = 6;

export default function usePlayerCamera() {
  const { camera } = useThree();
  const attachPoint = useMemo(() => new Object3D(), []);
  const followPoint = useMemo(() => {
    const cam = new Object3D();
    cam.position.z = cameraMaxDistance;
    return cam;
  }, []);

  let targetCameraDistance = useRef(cameraMaxDistance);
  let aspectRatio = useRef(0);
  let initialDistance = null;

  const onWheel = (e) => {
    const v = followPoint.position.z + e.deltaY * 0.06;
    if (v >= cameraMinDistance && v <= cameraMaxDistance) {
      targetCameraDistance.current = v;
    }
    return false;
  };

  const touchstart = (e) => {
    if (e.touches.length === 2) {
      const [touch1, touch2] = e.touches;
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      initialDistance = distance;
    }
  };

  const touchmove = (e) => {
    if (e.touches.length === 2 && initialDistance !== null) {
      const [touch1, touch2] = e.touches;
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const pinchScale = currentDistance / initialDistance;

      const v = followPoint.position.z / Math.pow(pinchScale, 0.02);
      if (v >= cameraMinDistance && v <= cameraMaxDistance) {
        targetCameraDistance.current = v;
      }
    }
  };

  const touchend = () => {
    initialDistance = null;
  };

  useFrame((state) => {
    // Check aspect ratio and update zoom leel
    const { viewport } = state;
    if (viewport.aspect != aspectRatio.current) {
      console.log(viewport.aspect);
      aspectRatio.current = viewport.aspect;
      if (viewport.aspect < 1) {
        const minimumAspectRatio = 0.6;
        let normalizedRange =
          Math.max(viewport.aspect - minimumAspectRatio, 0) *
          (1 / (1 - minimumAspectRatio));
        normalizedRange = Math.pow(normalizedRange, 0.8);
        console.log(normalizedRange);
        targetCameraDistance.current =
          normalizedRange * (cameraMaxDistance - cameraMinDistance) +
          cameraMinDistance;
      } else if (viewport.aspect > 1) {
        const maximumAspectRatio = 2.5;
        let normalizedRange =
          Math.max(maximumAspectRatio - viewport.aspect, 0) *
          (1 / (maximumAspectRatio - 1));
        normalizedRange = Math.pow(normalizedRange, 0.8);
        targetCameraDistance.current =
          normalizedRange * (cameraMaxDistance - cameraMinDistance) +
          cameraMinDistance;
      } else {
        targetCameraDistance.current = cameraMaxDistance;
      }
    }

    // Lerp to targeted camera distance
    if (Math.abs(followPoint.position.z - targetCameraDistance.current) > 0.1) {
      followPoint.position.z = lerp(
        followPoint.position.z,
        targetCameraDistance.current,
        0.1
      );
    }

    // More zoom in, more adjustment to player's position
    const focusPoint = new Vector3(0, 0, 0);
    focusPoint.lerp(
      attachPoint.position,
      1 -
        (followPoint.position.z - cameraMinDistance) /
          (cameraMaxDistance - cameraMinDistance)
    );
    camera.position.lerp(focusPoint, 1);
    camera.position.z = followPoint.position.z;
    camera.up.set(0, 1, 0);
    camera.lookAt(focusPoint);
    camera.rotateOnAxis(new Vector3(0, 0, 1), Math.PI / 4);
  });

  useLayoutEffect(() => {
    followPoint.position.z = cameraMaxDistance;
    camera.position.z = cameraMaxDistance;
    document.addEventListener("wheel", onWheel);
    document.addEventListener("touchstart", touchstart);
    document.addEventListener("touchmove", touchmove);
    document.addEventListener("touchend", touchend);
    return () => {
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchstart", touchstart);
      document.removeEventListener("touchmove", touchmove);
      document.removeEventListener("touchend", touchend);
    };
  }, []);

  return attachPoint;
}
