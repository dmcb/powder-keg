import React from "react";

export default function Countdown(props: { timeToStart: number }) {
  return props.timeToStart > 0 && <div id="countdown">{props.timeToStart}</div>;
}
