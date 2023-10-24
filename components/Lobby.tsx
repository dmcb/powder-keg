import React, { useState } from "react";
import GameCount from "components/GameCount";

const seedAdjective = [
  "blackened",
  "broken",
  "concealed",
  "dreaded",
  "fancy",
  "grand",
  "hidden",
  "mystic",
  "plentiful",
  "ravaged",
  "royal",
  "salted",
  "scorched",
  "secluded",
  "secret",
  "splendid",
  "stolen",
  "sunken",
  "sweet",
  "wrecked",
  "barracudas",
  "captains",
  "dragons",
  "guilds",
  "hunters",
  "krakens",
  "maidens",
  "mermaids",
  "parrots",
  "raiders",
  "sailors",
  "sharks",
  "shipwrecks",
  "sirens",
  "storms",
  "thieves",
  "tritons",
  "turtles",
  "wanderers",
];
const seedNoun = [
  "asylum",
  "bounty",
  "den",
  "fort",
  "gem",
  "harbor",
  "haven",
  "hideout",
  "hold",
  "jewel",
  "keep",
  "port",
  "refuge",
  "rest",
  "retreat",
  "sanctuary",
  "shelter",
  "stronghold",
  "treasure",
  "trove",
  "archipelago",
  "atol",
  "bay",
  "bluff",
  "cliff",
  "cove",
  "crag",
  "enclave",
  "grove",
  "hollow",
  "island",
  "isle",
  "lagoon",
  "peninsula",
  "reef",
  "ridge",
  "rock",
  "sand",
  "shallow",
  "shore",
];
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

export default function Interface() {
  let pusherConnection = null;
  const [playerName, setPlayerName] = useState(
    nameAdjective[Math.floor(Math.random() * nameAdjective.length)] +
      nameNoun[Math.floor(Math.random() * nameNoun.length)]
  );
  const [seedName, setSeedName] = useState(
    seedAdjective[Math.floor(Math.random() * seedAdjective.length)] +
      seedNoun[Math.floor(Math.random() * seedNoun.length)]
  );
  const formValid = playerName.trim().length > 0 && seedName.trim().length > 0;

  const startGame = (e) => {
    e.preventDefault();
    console.log("Game start");
  };

  return (
    <div className="menu">
      <h1>Powder Keg</h1>
      <GameCount />
      <form>
        <label htmlFor="seedname">Seed</label>
        <input
          value={seedName}
          type="text"
          id="seedname"
          autoComplete="off"
          onChange={(e) => setSeedName(e.target.value)}
        />
        <label htmlFor="playername">Player Name</label>
        <input
          value={playerName}
          type="text"
          id="playername"
          autoComplete="off"
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button type="submit" disabled={!formValid} onClick={startGame}>
          Start
        </button>
      </form>
    </div>
  );
}
