// BloodBond Frontend - Available Donors page (from Navbar)
// Search by Blood Group, Division, District, Upazila - or show all available donors.

'use client';

import { useEffect, useState } from 'react';
import { apiFetch, BLOOD_GROUPS } from '@/lib/api';
import { DIVISIONS, DISTRICTS, UPAZILAS } from '@/lib/locations';
import DonorCard from '@/components/DonorCard';

const selectClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500';

export default function DonorsPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');

  const districts = division ? DISTRICTS[division] || [] : [];
  const upazilas = district ? UPAZILAS[district] || [] : [];

  // Load donors from the backend with the current filters.
  async function loadDonors(filters) {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.bloodGroup) params.set('bloodGroup', filters.bloodGroup);
      if (filters.division) params.set('division', filters.division);
      if (filters.district) params.set('district', filters.district);
      if (filters.upazila) params.set('upazila', filters.upazila);
      const data = await apiFetch('/donors/available?' + params.toString());
      setDonors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // First load: all available donors.
  useEffect(() => {
    loadDonors({ bloodGroup: '', division: '', district: '', upazila: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    loadDonors({ bloodGroup, division, district, upazila });
  }

  function handleClear() {
    setBloodGroup('');
    setDivision('');
    setDistrict('');
    setUpazila('');
    loadDonors({ bloodGroup: '', division: '', district: '', upazila: '' });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Available Donors</h1>
      <p className="text-gray-600 mt-1">
        Search by blood group and area. Contact details are shown only after login.
      </p>

      {/* Search form */}
      <form onSubmit={handleSearch} className="mt-6 bg-white border border-gray-200 rounded-lg p-5 grid gap-4 md:grid-cols-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
          <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={selectClass}>
            <option value="">All Groups</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
          <select
            value={division}
            onChange={(e) => { setDivision(e.target.value); setDistrict(''); setUpazila(''); }}
            className={selectClass}
          >
            <option value="">All Divisions</option>
            {DIVISIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
          <select
            value={district}
            onChange={(e) => { setDistrict(e.target.value); setUpazila(''); }}
            disabled={!division}
            className={selectClass}
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upazila / Thana</label>
          <select value={upazila} onChange={(e) => setUpazila(e.target.value)} disabled={!district} className={selectClass}>
            <option value="">All Upazilas</option>
            {upazilas.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
            Search
          </button>
          <button type="button" onClick={handleClear} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
            Clear
          </button>
        </div>
      </form>

      {/* Results */}
      {loading && <p className="mt-8 text-gray-600">Loading donors...</p>}
      {error && <p className="mt-8 text-red-600">{error}</p>}
      {!loading && !error && donors.length === 0 && (
        <p className="mt-8 text-gray-600">No donors found for this search. Try a wider area or another blood group.</p>
      )}
      {!loading && !error && donors.length > 0 && (
        <p className="mt-8 text-gray-600">{donors.length} donor(s) found.</p>
      )}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {donors.map((d) => (
          <DonorCard key={d.donorId} donor={d} />
        ))}
      </div>
    </div>
  );
}
