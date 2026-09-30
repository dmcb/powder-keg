import { PropsWithChildren } from "react";
import "./PlayerSlot.css";

/**
 * A labelled per-player row in a menu (label tab over a value field, with an
 * optional gamepad hint as a child).
 */
export default function PlayerSlot(
  props: PropsWithChildren<{
    label: string;
    htmlFor?: string;
    className?: string;
  }>,
) {
  return (
    <fieldset className={`player-slot ${props.className ?? ""}`}>
      <label className="player-slot-label" htmlFor={props.htmlFor}>
        {props.label}
      </label>
      {props.children}
    </fieldset>
  );
}
