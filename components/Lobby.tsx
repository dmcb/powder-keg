import React, { useEffect, useState } from "react";
import GameCount from "components/GameCount";
import PlayerConfig from "components/PlayerConfig";
import { useConnectionStore } from "stores/gamepadStore";
import { useGameStore } from "stores/gameStore";

export default function Interface() {
  const seed = useGameStore((state) => state.seed);
  const players = useGameStore((state) => state.players);
  const connections = useConnectionStore((state) => state.connections);
  const setSeed = useGameStore((state) => state.setSeed);
  const updatePlayers = useGameStore((state) => state.updatePlayers);
  const setStartGame = useGameStore((state) => state.startGame);

  // When controllers connect, update players
  useEffect(
    () =>
      updatePlayers(
        players.map((player) => {
          return {
            ...player,
            connected: connections.includes(player.index),
          };
        })
      ),
    [connections]
  );

  const formValid =
    players.filter((player) => player.connected).length >= 1 &&
    seed.trim().length > 0; // && playerName.trim().length > 0

  const startGame = (e) => {
    e.preventDefault();
    updatePlayers(players);
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
