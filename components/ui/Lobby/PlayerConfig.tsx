import { useEffect, useState } from "react";
import GamepadButtonHelper from "components/ui/Menu/GamepadButtonHelper";
import PlayerSlot from "components/ui/Menu/PlayerSlot";
import { useGamepadButtonPress } from "hooks/useGamepadButtonPress";
import { generatePlayerName } from "config/seeds";

export default function PlayerConfig(props: {
  number: number;
  joined: boolean;
  updatePlayerName: (name: string, number: number) => void;
}) {
  const [playerName, setPlayerName] = useState("");
  const button1Pressed = useGamepadButtonPress(props.number, 1, () =>
    setPlayerName(generatePlayerName()),
  );

  useEffect(() => {
    props.updatePlayerName(playerName, props.number);
  }, [playerName]);

  useEffect(() => {
    if (!props.joined) setPlayerName("");
    else {
      setPlayerName(generatePlayerName());
    }
  }, [props.joined]);

  const conditionalPlayerLabel = props.joined
    ? "Player " + (props.number + 1)
    : "Connect gamepad";

  return (
    <PlayerSlot label={conditionalPlayerLabel} htmlFor="playername">
      <input
        value={playerName}
        type="text"
        id="playername"
        disabled={!props.joined}
        autoComplete="off"
        autoCorrect="off"
        onChange={(e) => {
          setPlayerName(e.target.value);
        }}
      />
      {props.joined && (
        <GamepadButtonHelper buttonToPress={1} pressed={button1Pressed} />
      )}
    </PlayerSlot>
  );
}
