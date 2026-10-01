import { useEffect, useState } from "react";
import { gameClock } from "lib/gameClock";
import { countdownSeconds, matchSeconds } from "config/match";
import "./HUDTimer.css";

const warningSeconds = 10;

/** Whole seconds of match time left, held at the full length until play. */
const secondsLeft = () =>
  Math.ceil(
    Math.max(
      0,
      matchSeconds - Math.max(0, gameClock.elapsed - countdownSeconds),
    ),
  );

/**
 * Match time remaining, read from game time so it holds while paused and
 * during resume countdowns.
 */
export default function HUDTimer() {
  const [seconds, setSeconds] = useState(secondsLeft);

  // `gameClock` isn't reactive, so poll it each animation frame; React skips
  // re-rendering unless the displayed second changes
  useEffect(() => {
    let frame: number;
    const update = () => {
      setSeconds(secondsLeft());
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, "0");

  return (
    <div
      className={
        "hud-timer" + (seconds <= warningSeconds ? " hud-timer-warning" : "")
      }
    >
      {minutes}:{remainder}
    </div>
  );
}
