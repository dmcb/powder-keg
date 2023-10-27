import { useState } from "react";

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
  playerNumber: number;
  joined: boolean;
}) {
  const [playerName, setPlayerName] = useState(
    nameAdjective[Math.floor(Math.random() * nameAdjective.length)] +
      nameNoun[Math.floor(Math.random() * nameNoun.length)]
  );

  const conditionalPlayerLabel = props.joined
    ? "Player " + props.playerNumber
    : "Connect gamepad";
  const conditionalPlayerName = props.joined ? playerName : "";

  return (
    <fieldset>
      <label htmlFor="playername">{conditionalPlayerLabel}</label>
      <input
        value={conditionalPlayerName}
        type="text"
        id="playername"
        disabled={!props.joined}
        autoComplete="off"
        autoCorrect="off"
        onChange={(e) => setPlayerName(e.target.value)}
      />
    </fieldset>
  );
}
