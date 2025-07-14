import { useEffect, useState } from 'react';

/**
 * useCountUp - Animates a number from 0 to target value over a duration.
 * @param target The final value to count up to
 * @param duration Duration in ms (default: 1200)
 * @returns The animated value
 */
export function useCountUp(target: number, duration: number = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return value;
} 