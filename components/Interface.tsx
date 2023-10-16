import React, { useState } from "react";

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
];

const roomAdjective = [
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
const roomNoun = [
  "asylum",
  "bounty",
  "den",
  "fort",
  "gem",
  "harbor",
  "haven",
  "hideout",
  "jold",
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

export default function Interface() {
  const [playerName, setPlayerName] = useState(
    nameAdjective[Math.floor(Math.random() * nameAdjective.length)] +
      nameNoun[Math.floor(Math.random() * nameNoun.length)]
  );
  const [roomName, setRoomName] = useState(
    roomAdjective[Math.floor(Math.random() * roomAdjective.length)] +
      roomNoun[Math.floor(Math.random() * roomNoun.length)]
  );
  const formValid = playerName.trim().length > 0 && roomName.trim().length > 0;

  return (
    <div className="menu">
      <h1>Powder Keg</h1>
      <form>
        <label htmlFor="playername">Player Name</label>
        <input
          value={playerName}
          type="text"
          id="playername"
          autoComplete="off"
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <label htmlFor="roomname">Room</label>
        <input
          value={roomName}
          type="text"
          id="roomname"
          autoComplete="off"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button type="submit" disabled={!formValid}>
          Start/Join Room
        </button>
      </form>
    </div>
  );
}
