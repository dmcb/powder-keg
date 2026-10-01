import { useEffect } from "react";
import GamepadButtonHelper from "components/ui/Menu/GamepadButtonHelper";
import PlayerSlot from "components/ui/Menu/PlayerSlot";
import { useGamepadButtonPress } from "hooks/useGamepadButtonPress";
import { generatePlayerName } from "config/seeds";
import { useConnectionStore } from "stores/gamepadStore";
import { usePlayerStore } from "stores/playerStore";
import "./PlayerConnectRow.css";

/**
 * One player's row in the PlayerConnectMenu. When `editable` (lobby), the name
 * is an input that is generated on join, cleared on leave and rerolled with
 * button 1. Otherwise the name is read-only and flagged if the gamepad has
 * disconnected.
 */
export default function PlayerConnectRow(props: {
  number: number;
  editable: boolean;
}) {
  const name = usePlayerStore((state) => state.players[props.number].name);
  const joined = usePlayerStore((state) =>
    state.joinedPlayers.includes(props.number),
  );
  const connected = useConnectionStore((state) =>
    state.connections.includes(props.number),
  );
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const setName = (name: string) => updatePlayer(props.number, { name });

  const rerollPressed = useGamepadButtonPress(props.number, 1, () => {
    if (props.editable) setName(generatePlayerName());
  });

  useEffect(() => {
    if (props.editable) setName(joined ? generatePlayerName() : "");
  }, [joined]);

  const inputId = `player-name-${props.number}`;

  if (!props.editable) {
    return (
      <PlayerSlot label={"Player " + (props.number + 1)}>
        <div className="player-slot-value input">{name}</div>
        {!connected && (
          <span className="player-connect-row-status">Disconnected</span>
        )}
      </PlayerSlot>
    );
  }

  return (
    <PlayerSlot
      label={joined ? "Player " + (props.number + 1) : "Connect gamepad"}
      htmlFor={inputId}
    >
      <input
        className="player-slot-value"
        value={name}
        type="text"
        id={inputId}
        disabled={!joined}
        autoComplete="off"
        autoCorrect="off"
        onChange={(e) => setName(e.target.value)}
      />
      {joined && (
        <GamepadButtonHelper buttonToPress={1} pressed={rerollPressed} />
      )}
    </PlayerSlot>
  );
}
