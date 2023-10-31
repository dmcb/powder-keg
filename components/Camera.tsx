import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useLayoutEffect, useRef } from "react";
import { Object3D, Vector2, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";
import { usePlayerStore } from "stores/playerStore";

const cameraTiltDistance = 4.3;
const cameraMaxDistance = 17.0;
const cameraMinDistance = 7;

export default function Camera() {
  const { camera } = useThree();
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const players = [
    usePlayerStore((state) => state.player0),
    usePlayerStore((state) => state.player1),
    usePlayerStore((state) => state.player2),
    usePlayerStore((state) => state.player3),
  ].filter((player, index) => index in joinedPlayers);

  let aspectRatio = useRef(0);

  const cameraPosition = useMemo(() => {
    const newCamera = new Object3D();
    newCamera.position.set(0, 0, cameraMaxDistance);
    return newCamera;
  }, []);

  useFrame((state) => {
    // Check aspect ratio and keep entire board in view
    const { viewport } = state;
    if (viewport.aspect != aspectRatio.current) {
      aspectRatio.current = viewport.aspect;
      if (viewport.aspect < 1) {
        cameraPosition.position.z = cameraMaxDistance / viewport.aspect;
      } else if (viewport.aspect > 1) {
        cameraPosition.position.z = cameraMaxDistance;
      }
    }

    // Get player midpoint
    const midpoint = new Vector2();
    players.forEach((player) => {
      midpoint.add(new Vector2(player.position[0], player.position[1]));
    });
    midpoint.divideScalar(players.length);
    cameraPosition.position.x = midpoint.x;
    cameraPosition.position.y = midpoint.y;

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

    // Move camera to its position
    const cameraTarget = new Vector3(
      cameraPosition.position.x,
      cameraPosition.position.y,
      -0.1
    );
    camera.up.set(1, 1, 0);
    camera.position.copy(cameraPosition.position);

    // Tilt camera
    camera.position.add(
      new Vector3(
        -cameraTiltDistance * (cameraPosition.position.z / cameraMaxDistance),
        -cameraTiltDistance * (cameraPosition.position.z / cameraMaxDistance),
        0
      )
    );
    camera.lookAt(cameraTarget);
  });

  return <></>;
}
