import React, { useEffect, useMemo } from "react";
import GameCount from "components/GameCount";
import PlayerConfig from "components/PlayerConfig";
import { useConnectionStore } from "stores/gamepadStore";
import { useGameStore } from "stores/gameStore";
import { usePlayerStore } from "stores/playerStore";

export default function Lobby(props: { debug: boolean }) {
  const seed = useGameStore((state) => state.seed);
  const connections = useConnectionStore((state) => state.connections);
  const players = [
    usePlayerStore((state) => state.player0),
    usePlayerStore((state) => state.player1),
    usePlayerStore((state) => state.player2),
    usePlayerStore((state) => state.player3),
  ];
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const setSeed = useGameStore((state) => state.setSeed);
  const updateJoinedPlayers = usePlayerStore(
    (state) => state.updateJoinedPlayers
  );
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const setStartGame = useGameStore((state) => state.startGame);

  // Update player name into store
  const updatePlayerName = (name, number) => {
    updatePlayer(number, { ...players[number], name: name });
  };

  // When controllers connect, update joined players
  useEffect(() => {
    updateJoinedPlayers(connections);
  }, [connections]);

  const formValid =
    props.debug ||
    (players.filter((player, index) => index in joinedPlayers).length >= 2 &&
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
        {players.map((player, index) => {
          return (
            <PlayerConfig
              key={index}
              number={index + 1}
              joined={index in joinedPlayers}
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
