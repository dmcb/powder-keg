import { usePlayerControls } from "components/entities/Player/usePlayerControls";
import { usePlayerPhysics } from "components/entities/Player/usePlayerPhysics";
import PlayerShip from "components/entities/Player/PlayerShip";
import PlayerCannon from "components/entities/Player/PlayerCannon";

export default function Player(props: { number: number }) {
  const controls = usePlayerControls(props.number);
  const { shipRef, physics } = usePlayerPhysics(props.number, controls);

  return (
    <>
      <PlayerShip
        ref={shipRef}
        sails={controls.sails}
        playerNumber={props.number}
      />
      <PlayerCannon
        firePort={controls.firePort}
        fireStarboard={controls.fireStarboard}
        physics={physics}
      />
    </>
  );
}
