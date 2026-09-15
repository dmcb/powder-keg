import { forwardRef, useEffect } from "react";
import type { Group } from "three";
import useSound from "use-sound";
import Ship from "components/entities/Player/Ship";

type PlayerShipProps = {
  sails: number;
  playerNumber: number;
};

/**
 * The visual hull for a player's ship: renders the ship mesh and plays the
 * sail sound when sails are raised.
 */
const PlayerShip = forwardRef<Group, PlayerShipProps>((props, ref) => {
  const [playSails] = useSound("sounds/sail.mp3", {
    volume: 0.5,
    playbackRate: Math.random() * 0.4 + 0.8,
  });

  useEffect(() => {
    if (props.sails >= 1) {
      playSails();
    }
  }, [props.sails]);

  return <Ship ref={ref} sails={props.sails} playerNumber={props.playerNumber} />;
});

PlayerShip.displayName = "PlayerShip";

export default PlayerShip;
