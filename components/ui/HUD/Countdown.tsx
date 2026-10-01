import React, { useEffect } from "react";
import { useGameStore } from "stores/gameStore";
import "./Countdown.css";

/**
 * Shows and ticks the countdown before play starts or resumes. Unmounted
 * while paused, which stops the timer.
 */
export default function Countdown() {
  const countdown = useGameStore((state) => state.countdown);
  const tickCountdown = useGameStore((state) => state.tickCountdown);

  useEffect(() => {
    if (countdown <= 0) return;
    const timeout = setTimeout(tickCountdown, 1000);
    return () => clearTimeout(timeout);
  }, [countdown, tickCountdown]);

  return countdown > 0 && <div id="countdown">{countdown}</div>;
}
