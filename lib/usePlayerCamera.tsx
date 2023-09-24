import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useLayoutEffect, useState } from "react";
import { Object3D, Vector3 } from "three";

const cameraMaxDistance = 16.25;
const cameraMinDistance = 6;
const cameraStartingDistance = 12;

export default function usePlayerCamera() {
  const { camera } = useThree();
  const attachPoint = useMemo(() => new Object3D(), []);
  const followPoint = useMemo(() => {
    const cam = new Object3D();
    cam.position.z = cameraStartingDistance;
    return cam;
  }, []);

  let initialDistance = null;

  const onWheel = (e) => {
    const v = followPoint.position.z + e.deltaY * 0.006;
    if (v >= cameraMinDistance && v <= cameraMaxDistance) {
      followPoint.position.z = v;
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
        followPoint.position.z = v;
      }
    }
  };

  const touchend = () => {
    initialDistance = null;
  };

  useFrame(() => {
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
    camera.position.set(0, 0, 0);
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
