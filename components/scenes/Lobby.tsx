import React, { useEffect, useState } from "react";
import { useConnectionStore } from "stores/gamepadStore";
import { useGameStore } from "stores/gameStore";
import { usePlayerStore } from "stores/playerStore";
import PlayerConnectMenu from "components/ui/Menu/PlayerConnectMenu";
import SeedInput from "components/ui/Lobby/SeedInput";
import Borders from "components/ui/Decoration/Borders";
import GameCount from "components/ui/Lobby/GameCount";
import "./Lobby.css";

export default function Lobby(props: { debug: boolean }) {
  const [seed, setSeedDraft] = useState(() => useGameStore.getState().seed);
  const setSeed = useGameStore((state) => state.setSeed);
  const connections = useConnectionStore((state) => state.connections);
  const players = usePlayerStore((state) => state.players);
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const updateJoinedPlayers = usePlayerStore(
    (state) => state.updateJoinedPlayers,
  );
  const setScene = useGameStore((state) => state.setScene);

  // Forms valid when at least 2 players have joined and all players have a name
  const formValid =
    props.debug ||
    (players.filter((_, index) => joinedPlayers.includes(index)).length >= 2 &&
      players.filter((player) => player.name.trim().length).length >= 2 &&
      seed.trim().length > 0);

  // Start game
  const startGame = () => {
    setSeed(seed);
    setScene("countdown");
  };

  // When controllers connect, update joined players
  useEffect(() => {
    updateJoinedPlayers(connections);
  }, [connections]);

  return (
    <div className="lobby">
      <Borders />
      <div className="menu">
        <h1>Powder Keg</h1>
        <h2>
          A local multiplayer pirate battler, connect controllers to start
        </h2>
        <GameCount />
        <SeedInput value={seed} onChange={setSeedDraft} />
        <PlayerConnectMenu
          editable
          enabled={formValid}
          action="start"
          onComplete={startGame}
        />
      </div>
    </div>
  );
}
