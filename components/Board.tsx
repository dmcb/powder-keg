import React, { useRef, useLayoutEffect } from "react";
import { Physics, Debug } from "@react-three/cannon";
import Terrain from "components/Terrain";
import Ocean from "components/Ocean";
import Player from "components/Player";
import Border from "components/Border";
import { Group, Vector2 } from "three";
import { useTapStore, useDragStore } from "stores/pointerStore";

const BoardPieces = (props: { seed: string }) => {
  const dragPointer = useRef(null);
  const currentDragPosition = useRef(null);
  const dragLength = useRef(0);

  const onDown = (e) => {
    if (!dragPointer.current) {
      dragPointer.current = e.pointerId;
      dragLength.current = 0;
      currentDragPosition.current = new Vector2(e.point.x, e.point.y);
    }
  };

  const onUp = (e) => {
    if (dragPointer.current === e.pointerId) {
      // Not enough movement for a drag, issue a tap
      if (dragLength.current < 0.02) {
        useTapStore.setState({ x: e.point.x, y: e.point.y });
      }
      dragPointer.current = null;
    }
  };

  const onMove = (e) => {
    if (dragPointer.current === e.pointerId) {
      if (currentDragPosition.current !== null) {
        const delta = new Vector2(e.point.x, e.point.y).sub(
          currentDragPosition.current
        );
        dragLength.current += delta.length();
        currentDragPosition.current = new Vector2(e.point.x, e.point.y);
        // Enough movement for a drag, send some dragging information
        if (dragLength.current > 0.02) {
          useDragStore.setState({ x: e.point.x, y: e.point.y });
        }
      }
    }
  };

  return (
    <>
      <Border position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Border position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Border position={[-1, 0, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
      <Border position={[1, 0, 0]} rotation={[Math.PI / 2, -Math.PI / 2, 0]} />
      <Ocean
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerMove={onMove}
        onPointerLeave={onUp}
      />
      <Terrain seed={props.seed} />
      <Player />
    </>
  );
};

export default function Board(props: { seed: string; debug: boolean }) {
  const boardRef = useRef<Group>(null!);

  return (
    <group ref={boardRef}>
      <Physics gravity={[0, 0, -1]}>
        {(props.debug && (
          <Debug color="green">
            <BoardPieces seed={props.seed} />
          </Debug>
        )) || <BoardPieces seed={props.seed} />}
      </Physics>
    </group>
  );
}
