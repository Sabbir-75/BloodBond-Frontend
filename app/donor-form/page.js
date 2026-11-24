// BloodBond Frontend - Become a Donor page (professional donor form)
// Same register API, but role is fixed to Donor, with blood group,
// cascading Division > District > Upazila, occupation, and availability status.

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiFetch, BLOOD_GROUPS, OCCUPATIONS } from '@/lib/api';
import LocationSelects, { inputClass } from '@/components/LocationSelects';

export default function DonorFormPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '',
    occupation: '', division: '', district: '', upazila: '', bloodGroup: '',
    availabilityStatus: 'Yes',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // Role is always Donor here. Availability status is saved on the donor
      // profile right after register (donor can change it later from My Profile).
      await apiFetch('/auth/register', {
        method: 'POST',
        body: { ...form, role: 'Donor' },
      });
      setSuccess('Thank you! Your donor application is sent. Admin approve korle tumi donor list-e asba, tarpor login korte parba.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Become a Donor</h1>
      <p className="text-gray-600 mt-1">
        Fill in your details. Your blood group will be shown big on your donor card.
      </p>

      {success ? (
        <div className="mt-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-5">
          <p className="font-bold">Application sent!</p>
          <p className="mt-1 text-sm">{success}</p>
          <Link href="/login" className="keep-hover inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
            Go to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required className={inputClass} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} required className={inputClass} placeholder="01XXXXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required className={inputClass} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password (min 6 characters)</label>
              <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} className={inputClass} placeholder="Password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select value={form.bloodGroup} onChange={(e) => set('bloodGroup', e.target.value)} required className={inputClass}>
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <select value={form.occupation} onChange={(e) => set('occupation', e.target.value)} required className={inputClass}>
                <option value="">Select Occupation</option>
                {OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <LocationSelects
              division={form.division}
              district={form.district}
              upazila={form.upazila}
              onChange={(loc) => setForm((f) => ({ ...f, ...loc }))}
              required
            />
          </div>

          {/* Availability status: Yes / No / Not Sure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Can you donate blood now?</label>
            <div className="flex flex-wrap gap-4">
              {[
                ['Yes', 'Yes — I can donate'],
                ['No', 'No — I cannot donate now'],
                ['NotSure', 'Not Sure — call/email me to confirm'],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="availabilityStatus"
                    value={value}
                    checked={form.availabilityStatus === value}
                    onChange={(e) => set('availabilityStatus', e.target.value)}
                    className="accent-red-600"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50">
            {loading ? 'Sending...' : 'Submit Donor Application'}
          </button>
        </form>
      )}
    </div>
  );
}
