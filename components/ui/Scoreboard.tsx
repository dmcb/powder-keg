import React from "react";

export default function Scoreboard() {
  return (
    <div id="scoreboard">
      <div id="player0" className="player">
        <div className="name">Player 1</div>
        <div className="score">0</div>
      </div>
      <div id="player1" className="player">
        <div className="name">Player 2</div>
        <div className="score">0</div>
      </div>
      <div id="player2" className="player">
        <div className="name">Player 3</div>
        <div className="score">0</div>
      </div>
      <div id="player3" className="player">
        <div className="name">Player 4</div>
        <div className="score">0</div>
      </div>
    </div>
  );
}
