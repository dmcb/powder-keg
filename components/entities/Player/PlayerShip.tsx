import { forwardRef, useEffect } from "react";
import type { Group } from "three";
import { audio } from "lib/audio";
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
  useEffect(() => {
    if (props.sails >= 1) {
      audio.play("sail");
    }
  }, [props.sails]);

  return (
    <Ship ref={ref} sails={props.sails} playerNumber={props.playerNumber} />
  );
});

PlayerShip.displayName = "PlayerShip";

export default PlayerShip;
