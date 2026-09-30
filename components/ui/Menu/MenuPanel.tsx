import { PropsWithChildren } from "react";
import "./MenuPanel.css";

/**
 * Themed panel used by full-screen menus (lobby, resume): title plus content.
 */
export default function MenuPanel(
  props: PropsWithChildren<{ id?: string; title: string }>,
) {
  return (
    <div id={props.id} className="menu-panel">
      <h1>{props.title}</h1>
      {props.children}
    </div>
  );
}
