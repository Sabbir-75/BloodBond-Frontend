// Scroll-reveal: fades a section in when it scrolls into view.
// useReveal = the hook (IntersectionObserver). Reveal = wrapper component.

'use client';

import { useEffect, useRef, useState } from 'react';

export function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Old browser without IntersectionObserver: show it right away.
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

export default function Reveal({ children, className = '', delay = 0 }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: delay + 'ms' } : undefined}
      className={(visible ? 'reveal-visible' : 'reveal') + (className ? ' ' + className : '')}
    >
      {children}
    </div>
  );
}
