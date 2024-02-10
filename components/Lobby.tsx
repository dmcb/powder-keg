import React, { useEffect, useRef } from "react";
import GameCount from "components/GameCount";
import PlayerConfig from "components/PlayerConfig";
import { useConnectionStore } from "stores/gamepadStore";
import { useGameStore } from "stores/gameStore";
import { usePlayerStore } from "stores/playerStore";
import GamepadButtonHelper from "components/GamepadButtonHelper";
import { useGamepadStore } from "stores/gamepadStore";

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

  const gamepads = useGamepadStore((state) => state.gamepads);
  const readyProgress = useRef(0);
  const lastGamepadTimestamp = useRef(0);

  const formValid =
    props.debug ||
    (players.filter((player, index) => index in joinedPlayers).length >= 2 &&
      players.filter((player) => player.name.trim().length).length >= 2 &&
      seed.trim().length > 0);

  const startGame = (e) => {
    e.preventDefault();
    setStartGame();
  };

  // Update player name into store
  const updatePlayerName = (name, number) => {
    updatePlayer(number, { ...players[number], name: name });
  };

  // When controllers connect, update joined players
  useEffect(() => {
    updateJoinedPlayers(connections);
  }, [connections]);

  // When controllers hold ready button, update ready progress
  useEffect(() => {
    if (formValid && gamepads && gamepads.length) {
      if (lastGamepadTimestamp.current !== 0) {
        const readyDelta = Date.now() - lastGamepadTimestamp.current;
        let readyChange = 0;
        gamepads.forEach((gamepad) => {
          readyChange -= (0.125 * readyDelta) / 1000;
          if (gamepad.buttons[0].pressed) {
            readyChange += readyDelta / 1000;
          }
        });
        readyProgress.current += readyChange / connections.length;
        if (readyProgress.current < 0) readyProgress.current = 0;
        else if (readyProgress.current >= 1) {
          setStartGame();
        }
      }
      lastGamepadTimestamp.current = Date.now();
    }
  }, [gamepads]);

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
        <button
          type="submit"
          disabled={!formValid}
          onClick={startGame}
          style={{
            background: `linear-gradient(90deg, #498207 ${
              readyProgress.current * 100
            }%, #433a32 ${readyProgress.current * 100}%)`,
          }}
        >
          Hold <GamepadButtonHelper buttonToPress={0} light={true} /> to start
        </button>
      </form>
    </div>
  );
}
