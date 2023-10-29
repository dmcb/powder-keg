import React, { useEffect, useMemo } from "react";
import GameCount from "components/GameCount";
import PlayerConfig from "components/PlayerConfig";
import { useConnectionStore } from "stores/gamepadStore";
import { useGameStore } from "stores/gameStore";

export default function Lobby(props: { debug: boolean }) {
  const seed = useGameStore((state) => state.seed);
  const players = useGameStore((state) => state.players);
  const connections = useConnectionStore((state) => state.connections);
  const setSeed = useGameStore((state) => state.setSeed);
  const updatePlayer = useGameStore((state) => state.updatePlayer);
  const updatePlayers = useGameStore((state) => state.updatePlayers);
  const setStartGame = useGameStore((state) => state.startGame);

  // When controllers connect, update players
  useEffect(
    () =>
      updatePlayers(
        players.map((player) => {
          return {
            ...player,
            joined: connections.includes(player.index),
          };
        })
      ),
    [connections]
  );

  const updatePlayerName = (index: number, name: string) => {
    players[index].name = name;
    updatePlayer(players[index]);
  };

  const formValid =
    props.debug ||
    (players.filter((player) => player.joined).length >= 2 &&
      players.filter((player) => player.name.trim().length).length >= 2 &&
      seed.trim().length > 0);

  const startGame = (e) => {
    e.preventDefault();
    console.log("Game start");
    console.log(players);
    setStartGame();
  };

  return (
    <div className="menu">
      <h1>Powder Keg</h1>
      <GameCount />
      <form>
        <label htmlFor="seed">Seed</label>
        <input
          value={seed}
          type="text"
          id="seed"
          autoComplete="off"
          autoCorrect="off"
          onFocus={(e) => e.target.select()}
          onChange={(e) => setSeed(e.target.value)}
        />
        {players.map((player) => {
          return (
            <PlayerConfig
              key={player.index}
              number={player.index + 1}
              joined={player.joined}
              updatePlayerName={updatePlayerName}
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
