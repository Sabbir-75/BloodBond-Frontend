// Lottie animation player (lottie-react).
// animationData = imported JSON from public/lottie/*.json (verified valid).

'use client';

import { Lottie } from 'lottie-react';

export default function LottiePlayer({ animationData, className = '', loop = true }) {
  return (
    <div className={className} aria-hidden="true">
      <Lottie animationData={animationData} loop={loop} autoplay style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
