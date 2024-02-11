import React from "react";
import { usePlayerStore } from "stores/playerStore";

export default function Scoreboard() {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const players = [
    usePlayerStore((state) => state.player0),
    usePlayerStore((state) => state.player1),
    usePlayerStore((state) => state.player2),
    usePlayerStore((state) => state.player3),
  ].filter((player, index) => index in joinedPlayers);

  return (
    <div id="scoreboard">
      {players.map((player, index) => {
        return (
          <div id="player{index}" className="player">
            <div className="name">{player.name}</div>
            <div className="health">{player.health}</div>
          </div>
        );
      })}
    </div>
  );
}
