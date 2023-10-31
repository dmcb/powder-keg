import { useEffect, useState } from "react";

const nameAdjective = [
  "captain",
  "salty",
  "stormy",
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
  "barrel",
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
];

export default function PlayerConfig(props: {
  number: number;
  joined: boolean;
  updatePlayerName: (name: string, number: number) => void;
}) {
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    props.updatePlayerName(playerName, props.number - 1);
  }, [playerName]);

  useEffect(() => {
    if (!props.joined) setPlayerName("");
    else {
      console.log("Player joined, generating name");
      setPlayerName(
        nameAdjective[Math.floor(Math.random() * nameAdjective.length)] +
          nameNoun[Math.floor(Math.random() * nameNoun.length)]
      );
    }
  }, [props.joined]);

  const conditionalPlayerLabel = props.joined
    ? "Player " + props.number
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
    </fieldset>
  );
}
