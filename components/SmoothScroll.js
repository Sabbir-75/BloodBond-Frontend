// BloodBond Frontend - slow, smooth scrolling (Lenis)
// Wheel scrolling is slowed down (duration 1.4s) so the page glides
// and settles gently instead of jumping. Touch scrolling stays native
// (Lenis smoothTouch is off by default). If the user prefers less
// motion, Lenis is not started at all.

'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function SmoothScroll() {
  useEffect(() => {
    // Respect reduced-motion: no smooth scrolling for those users.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.4, smoothWheel: true });

    let rafId = 0;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
