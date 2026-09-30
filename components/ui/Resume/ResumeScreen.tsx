import { useEffect, useState } from "react";
import MenuPanel from "components/ui/Menu/MenuPanel";
import ProgressButton from "components/ui/Menu/ProgressButton";
import GamepadButtonHelper from "components/ui/Menu/GamepadButtonHelper";
import ResumePlayer from "components/ui/Resume/ResumePlayer";
import { useConnectionStore } from "stores/gamepadStore";
import { useGameStore } from "stores/gameStore";
import { usePlayerStore } from "stores/playerStore";
import "./ResumeScreen.css";

/**
 * Shown while the game is paused. Resumes once every joined player with a
 * connected gamepad has checked in, or when the button is clicked.
 */
export default function ResumeScreen() {
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const connections = useConnectionStore((state) => state.connections);
  const setPaused = useGameStore((state) => state.setPaused);
  const [readyPlayers, setReadyPlayers] = useState<number[]>([]);

  const requiredPlayers = joinedPlayers.filter((player) =>
    connections.includes(player),
  );
  const readyCount = requiredPlayers.filter((player) =>
    readyPlayers.includes(player),
  ).length;

  const resume = () => setPaused(false);

  const toggleReady = (player: number) =>
    setReadyPlayers((current) =>
      current.includes(player)
        ? current.filter((p) => p !== player)
        : [...current, player],
    );

  useEffect(() => {
    if (requiredPlayers.length && readyCount === requiredPlayers.length) {
      resume();
    }
  }, [readyCount, requiredPlayers.length]);

  return (
    <div id="resume">
      <MenuPanel title="Paused">
        <form>
          {joinedPlayers.map((player) => (
            <ResumePlayer
              key={player}
              number={player}
              connected={connections.includes(player)}
              ready={readyPlayers.includes(player)}
              onToggleReady={toggleReady}
            />
          ))}
          <ProgressButton
            progress={
              requiredPlayers.length ? readyCount / requiredPlayers.length : 0
            }
            onClick={resume}
          >
            Press <GamepadButtonHelper buttonToPress={0} light={true} /> to
            resume
          </ProgressButton>
        </form>
      </MenuPanel>
    </div>
  );
}
