// Animated number: counts up from 0 when it scrolls into view.
// Used for honest stats only (8 blood groups, 64 districts, 90 days, 3 lives).

'use client';

import { useEffect, useRef, useState } from 'react';

export default function StatCounter({ value, suffix = '' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  // Start counting only when the number scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setStarted(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Count up over ~1.2 seconds.
  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const duration = 1200;
    let frame = 0;
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration);
      setShown(Math.round(value * p));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}
