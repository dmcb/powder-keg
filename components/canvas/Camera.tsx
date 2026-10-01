import { Camera, Vector2, Vector3 } from "three";
import { cameraTiltDistance, cameraMaxDistance } from "config/camera";

const lookTarget = new Vector3();
const tilt = new Vector3();

/** Distance that keeps the entire board in view for the given aspect ratio. */
export function baseDistance(aspect: number) {
  return aspect < 1 ? cameraMaxDistance / aspect : cameraMaxDistance;
}

/** Positions a tilted camera looking at `target` from `distance` above. */
export function frameCamera(camera: Camera, target: Vector2, distance: number) {
  const tiltAmount = -cameraTiltDistance * (distance / cameraMaxDistance);
  camera.up.set(1, 1, 0);
  camera.position
    .set(target.x, target.y, distance)
    .add(tilt.set(tiltAmount, tiltAmount, 0));
  camera.lookAt(lookTarget.set(target.x, target.y, -0.1));
  camera.updateMatrixWorld();
}
