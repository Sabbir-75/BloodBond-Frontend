// BloodBond Frontend - cascading location selects (shared by all forms)
// Division -> District -> Upazila. Choosing a Division shows only its Districts,
// choosing a District shows only its Upazilas.

'use client';

import { DIVISIONS, DISTRICTS, UPAZILAS } from '@/lib/locations';

const selectClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500';

export default function LocationSelects({ division, district, upazila, onChange, required }) {
  const districts = division ? DISTRICTS[division] || [] : [];
  const upazilas = district ? UPAZILAS[district] || [] : [];

  // When Division changes: District + Upazila are cleared.
  // When District changes: Upazila is cleared.
  function handleDivision(e) {
    onChange({ division: e.target.value, district: '', upazila: '' });
  }
  function handleDistrict(e) {
    onChange({ division, district: e.target.value, upazila: '' });
  }
  function handleUpazila(e) {
    onChange({ division, district, upazila: e.target.value });
  }

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
        <select value={division} onChange={handleDivision} required={required} className={selectClass}>
          <option value="">Select Division</option>
          {DIVISIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">District (Zila)</label>
        <select value={district} onChange={handleDistrict} required={required} disabled={!division} className={selectClass}>
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upazila / Thana</label>
        <select value={upazila} onChange={handleUpazila} required={required} disabled={!district} className={selectClass}>
          <option value="">Select Upazila / Thana</option>
          {upazilas.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
    </>
  );
}

// Shared input style for forms.
export const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500';
