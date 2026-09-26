import GamepadButtonHelper from "components/ui/Menu/GamepadButtonHelper";
import PlayerSlot from "components/ui/Menu/PlayerSlot";
import { useGamepadButtonPress } from "hooks/useGamepadButtonPress";
import { usePlayerStore } from "stores/playerStore";

export default function ResumePlayer(props: {
  number: number;
  connected: boolean;
  ready: boolean;
  onToggleReady: (number: number) => void;
}) {
  const name = usePlayerStore((state) => state.players[props.number].name);
  const button0Pressed = useGamepadButtonPress(props.number, 0, () =>
    props.onToggleReady(props.number),
  );

  let status = props.ready ? "Ready" : "Waiting";
  if (!props.connected) status = "Disconnected";

  return (
    <PlayerSlot
      label={"Player " + (props.number + 1)}
      className={props.ready ? "ready" : ""}
    >
      <div className="player-value">
        {name}
        <span className="status">{status}</span>
      </div>
      {props.connected && (
        <GamepadButtonHelper buttonToPress={0} pressed={button0Pressed} />
      )}
    </PlayerSlot>
  );
}
