import { useEffect, useState } from "react";
import { useGamepadStore } from "stores/gamepadStore";
import GamepadButtonHelper from "components/ui/Lobby/GamepadButtonHelper";
import { generatePlayerName } from "config/seeds";

export default function PlayerConfig(props: {
  number: number;
  joined: boolean;
  updatePlayerName: (name: string, number: number) => void;
}) {
  const [playerName, setPlayerName] = useState("");
  const gamepads = useGamepadStore((state) => state.gamepads);
  const [button1Pressed, setButton1Pressed] = useState(false);

  useEffect(() => {
    props.updatePlayerName(playerName, props.number);
  }, [playerName]);

  useEffect(() => {
    if (!props.joined) setPlayerName("");
    else {
      setPlayerName(generatePlayerName());
    }
  }, [props.joined]);

  useEffect(() => {
    if (gamepads) {
      if (gamepads[props.number]?.buttons[1]?.pressed) {
        if (!button1Pressed) {
          setButton1Pressed(true);
          setPlayerName(generatePlayerName());
        }
      } else {
        setButton1Pressed(false);
      }
    }
  }, [gamepads]);

  const conditionalPlayerLabel = props.joined
    ? "Player " + (props.number + 1)
    : "Connect gamepad";

  return (
    <fieldset>
      <label htmlFor="playername">{conditionalPlayerLabel}</label>
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
    </fieldset>
  );
}
