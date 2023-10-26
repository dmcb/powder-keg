import React, { useEffect, useState } from "react";
import GameCount from "components/GameCount";
import PlayerConfig from "components/PlayerConfig";
import { useConnectionStore } from "stores/gamepadStore";
import { useGameStore } from "stores/gameStore";

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
  "atoll",
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
  const [players, setPlayers] = useState([
    { index: 0, name: "", connected: false },
    { index: 1, name: "", connected: false },
    { index: 2, name: "", connected: false },
    { index: 3, name: "", connected: false },
  ]);

  const [seedName, setSeedName] = useState(
    seedAdjective[Math.floor(Math.random() * seedAdjective.length)] +
      seedNoun[Math.floor(Math.random() * seedNoun.length)]
  );

  const connections = useConnectionStore((state) => state.connections);
  const setStartGame = useGameStore((state) => state.startGame);

  useEffect(() => {
    setPlayers((players) =>
      players.map((player) => {
        return {
          ...player,
          connected: connections.includes(player.index),
        };
      })
    );
  }, [connections]);

  const formValid =
    players.filter((player) => player.connected).length >= 1 &&
    seedName.trim().length > 0; // && playerName.trim().length > 0

  const startGame = (e) => {
    e.preventDefault();
    console.log("Game start");
    setStartGame(seedName);
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
        {players.map((player) => {
          return (
            <PlayerConfig
              key={player.index}
              playerNumber={player.index + 1}
              connected={player.connected}
            />
          );
        })}
        <button type="submit" disabled={!formValid} onClick={startGame}>
          Start
        </button>
      </form>
    </div>
  );
}
