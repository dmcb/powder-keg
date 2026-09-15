import { useEffect, useState } from "react";

/**
 * Counts down from `seconds` to 0 in one-second steps, calling `onComplete`
 * once it reaches 0.
 */
export function useCountdown(seconds: number, onComplete: () => void) {
  const [timeToStart, setTimeToStart] = useState(seconds);

  useEffect(() => {
    if (timeToStart <= 0) {
      onComplete();
      return;
    }
    const interval = setInterval(() => {
      setTimeToStart((current) => current - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeToStart]);

  return timeToStart;
}
