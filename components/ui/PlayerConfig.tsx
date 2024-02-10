import { useEffect, useState } from "react";
import { useGamepadStore } from "stores/gamepadStore";
import GamepadButtonHelper from "components/ui/GamepadButtonHelper";

const nameAdjective = [
  "captain",
  "salty",
  "stormy",
  "white",
  "red",
  "black",
  "gold",
  "silver",
  "cannon",
  "shark",
  "jolly",
  "scurvy",
  "sea",
  "dagger",
  "skull",
  "iron",
  "stone",
  "stinky",
  "rusty",
  "rapier",
  "cutlass",
  "saber",
  "buccaneer",
  "coral",
  "madame",
  "sir",
  "wooden",
  "barnacle",
  "commodore",
  "kid",
  "mad",
  "rum",
  "rogue",
  "death",
  "sunken",
  "scar",
  "long",
  "scarlett",
  "feather",
  "blunder",
  "stumpy",
  "blind",
  "shifty",
  "rip",
  "thirsty",
];
const nameNoun = [
  "beard",
  "buckle",
  "hook",
  "crusher",
  "wolf",
  "bones",
  "tooth",
  "sword",
  "heart",
  "treader",
  "jack",
  "reef",
  "eye",
  "pegleg",
  "boot",
  "dog",
  "sparrow",
  "morgan",
  "flint",
  "kraken",
  "nose",
  "crimson",
  "maiden",
  "corsair",
  "patch",
  "dreadnought",
  "scourge",
  "barrel",
  "hand",
  "mark",
  "flag",
  "wave",
  "malone",
  "quill",
  "belly",
  "squall",
  "roger",
  "tide",
  "runner",
  "calico",
];

export default function PlayerConfig(props: {
  number: number;
  joined: boolean;
  updatePlayerName: (name: string, number: number) => void;
}) {
  const [playerName, setPlayerName] = useState("");
  const gamepads = useGamepadStore((state) => state["gamepads"]);
  const [button1Pressed, setButton1Pressed] = useState(false);

  const generateName = () => {
    setPlayerName(
      nameAdjective[Math.floor(Math.random() * nameAdjective.length)] +
        nameNoun[Math.floor(Math.random() * nameNoun.length)]
    );
  };

  useEffect(() => {
    props.updatePlayerName(playerName, props.number);
  }, [playerName]);

  useEffect(() => {
    if (!props.joined) setPlayerName("");
    else {
      console.log("Player joined, generating name");
      generateName();
    }
  }, [props.joined]);

  useEffect(() => {
    if (gamepads) {
      if (gamepads[props.number]?.buttons[1]?.pressed) {
        if (!button1Pressed) {
          setButton1Pressed(true);
          generateName();
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
