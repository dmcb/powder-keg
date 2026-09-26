import { useEffect, useState } from "react";

/**
 * Counts down from `seconds` to 0 in one-second steps, calling `onComplete`
 * once it reaches 0. Stops ticking while `paused`.
 */
export function useCountdown(
  seconds: number,
  onComplete: () => void,
  paused = false,
) {
  const [timeToStart, setTimeToStart] = useState(seconds);

  useEffect(() => {
    if (timeToStart <= 0) {
      onComplete();
      return;
    }
    if (paused) return;
    const interval = setInterval(() => {
      setTimeToStart((current) => current - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeToStart, paused]);

  return timeToStart;
}
