// BloodBond logo: red heart-drop icon + "Blood" (dark) + "Bond" (red)
// + small tagline "Donate • Connect • Save Lives".
// light = white text version (for the red footer / red panels).

import Image from 'next/image';
import { LOGO_ICON_DATA_URI } from '@/lib/logoData';

export default function Logo({ light = false, showTagline = true }) {
  return (
    <span className="flex items-center gap-2">
      {/* On a red background the red icon sits inside a white rounded square (like the favicon). */}
      <span className={light ? 'bg-white rounded-lg p-1 flex items-center justify-center' : 'flex items-center justify-center'}>
        <Image src={LOGO_ICON_DATA_URI} alt="BloodBond logo" width={36} height={36} priority unoptimized />
      </span>
      <span className="leading-none">
        <span className={'text-xl font-bold ' + (light ? 'text-white' : 'text-gray-900')}>
          Blood<span className="text-brand-500">Bond</span>
        </span>
        {showTagline && (
          <span className={'block text-[10px] tracking-wide mt-0.5 ' + (light ? 'text-red-100' : 'text-gray-500')}>
            Donate • Connect • Save Lives
          </span>
        )}
      </span>
    </span>
  );
}
