import { useEffect, useRef } from "react";
import GamepadButtonHelper from "components/ui/Menu/GamepadButtonHelper";
import PlayerConnectRow from "components/ui/Menu/PlayerConnectRow";
import ProgressButton from "components/ui/Menu/ProgressButton";
import { useConnectionStore, useGamepadStore } from "stores/gamepadStore";
import { usePlayerStore } from "stores/playerStore";
import "./PlayerConnectMenu.css";

const READY_BUTTON = 0;
const DECAY_PER_SECOND = 0.125;

type Props = {
  speed?: number;
  editable?: boolean;
  enabled?: boolean;
  action: string;
  onComplete: () => void;
};

/**
 * Full-screen menu listing the players with a hold-to-complete button: every
 * joined, connected player holding their ready button fills the meter faster,
 * and it drains while released. Calls `onComplete` when full (or on click).
 * `editable` (lobby) adds the game count, lists every slot and makes names
 * editable; otherwise only joined players are listed, read-only.
 */
export default function PlayerConnectMenu(props: Props) {
  const players = usePlayerStore((state) => state.players);
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);

  const rows = props.editable
    ? players.map((_, index) => index)
    : joinedPlayers;

  return (
    <div className="player-connect-menu">
      <form>
        {rows.map((number) => (
          <PlayerConnectRow
            key={number}
            number={number}
            editable={!!props.editable}
          />
        ))}
        <HoldButton {...props} />
      </form>
    </div>
  );
}

/**
 * Kept separate so the per-frame gamepad updates only re-render the button.
 */
function HoldButton(props: Props) {
  const enabled = props.enabled ?? true;
  const gamepads = useGamepadStore((state) => state.gamepads);
  const delta = useGamepadStore((state) => state.delta);
  const joinedPlayers = usePlayerStore((state) => state.joinedPlayers);
  const connections = useConnectionStore((state) => state.connections);
  const progress = useRef(0);

  useEffect(() => {
    const required = joinedPlayers.filter((p) => connections.includes(p));
    if (!enabled || !required.length) return;
    const held = required.filter(
      (p) => gamepads[p]?.buttons[READY_BUTTON]?.pressed,
    ).length;
    const rate =
      (held * (props.speed || 1) - DECAY_PER_SECOND * required.length) /
      required.length;
    progress.current = Math.max(0, progress.current + (rate * delta) / 1000);
    if (progress.current >= 1) {
      progress.current = 0;
      props.onComplete();
    }
  }, [gamepads]);

  return (
    <ProgressButton
      enabled={enabled}
      progress={progress.current}
      onClick={props.onComplete}
    >
      Hold <GamepadButtonHelper buttonToPress={READY_BUTTON} light={true} /> to{" "}
      {props.action}
    </ProgressButton>
  );
}
