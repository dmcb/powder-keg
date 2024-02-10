import React, { useEffect } from "react";
import GameCount from "components/GameCount";
import PlayerConfig from "components/PlayerConfig";
import { useConnectionStore } from "stores/gamepadStore";
import { useGameStore } from "stores/gameStore";
import { usePlayerStore } from "stores/playerStore";
import ReadyButton from "./ReadyButton";
import GamepadButtonHelper from "components/GamepadButtonHelper";

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

  // Forms valid when at least 2 players have joined and all players have a name
  const formValid =
    props.debug ||
    (players.filter((player, index) => index in joinedPlayers).length >= 2 &&
      players.filter((player) => player.name.trim().length).length >= 2 &&
      seed.trim().length > 0);

  // Update player name into store
  const updatePlayerName = (name, number) => {
    updatePlayer(number, { ...players[number], name: name });
  };

  // When controllers connect, update joined players
  useEffect(() => {
    updateJoinedPlayers(connections);
  }, [connections]);

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
              joined={joinedPlayers.includes(index)}
              updatePlayerName={updatePlayerName}
            />
          );
        })}
        <ReadyButton
          enabled={formValid}
          executeFunction={setStartGame}
          connections={connections}
        >
          Hold <GamepadButtonHelper buttonToPress={0} light={true} /> to start
        </ReadyButton>
      </form>
    </div>
  );
}
