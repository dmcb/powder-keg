import PlayerSlot from "components/ui/Menu/PlayerSlot";
import { useGamepadButtonPress } from "hooks/useGamepadButtonPress";
import { usePlayerStore } from "stores/playerStore";
import "./ResumePlayer.css";

export default function ResumePlayer(props: {
  number: number;
  connected: boolean;
  ready: boolean;
  onToggleReady: (number: number) => void;
}) {
  const name = usePlayerStore((state) => state.players[props.number].name);
  useGamepadButtonPress(props.number, 0, () =>
    props.onToggleReady(props.number),
  );

  return (
    <PlayerSlot label={"Player " + (props.number + 1)}>
      <div className="player-slot-value">{name}</div>
      {!props.connected && (
        <span className="resume-player-status">Disconnected</span>
      )}
      {props.connected && props.ready && (
        <svg
          className="resume-player-status"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Ready"
        >
          <path
            d="M4 12.5L9.5 18L20 6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </PlayerSlot>
  );
}
