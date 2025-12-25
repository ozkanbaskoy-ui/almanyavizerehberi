'use client';

import { useEffect, useState } from 'react';

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  durationMs?: number;
};

export function AnimatedCounter({
  value,
  suffix,
  durationMs = 800,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frameId: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(value * eased);
      setDisplay(current);
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, durationMs]);

  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

