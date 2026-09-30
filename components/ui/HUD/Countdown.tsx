import React from "react";
import "./Countdown.css";

export default function Countdown(props: { timeToStart: number }) {
  return props.timeToStart > 0 && <div id="countdown">{props.timeToStart}</div>;
}
