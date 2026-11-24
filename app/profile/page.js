// BloodBond Frontend - My Profile page (Donor)
// Shows the donor's own profile + next eligible date (90-day rule),
// and lets the donor update status (Yes / No / NotSure) + last donation date.

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProfilePage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Yes');
  const [lastDate, setLastDate] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (ready && !user) router.push('/login');
  }, [ready, user, router]);

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await apiFetch('/donors/me');
      setProfile(data);
      setStatus(data.AvailabilityStatus || 'Yes');
      setLastDate(data.LastDonationDate ? data.LastDonationDate.slice(0, 10) : '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user && user.role === 'Donor') loadProfile();
    else if (user) setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    try {
      await apiFetch('/donors/status', {
        method: 'PUT',
        body: { availabilityStatus: status, lastDonationDate: lastDate || null },
      });
      setMessage('Status update hoyeche.');
      loadProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!ready || loading) return <p className="max-w-2xl mx-auto px-4 py-10 text-gray-600">Loading...</p>;
  if (!user) return null;

  if (user.role !== 'Donor') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-4 text-gray-600">
          This page is for Donors. Your role is {user.role}.
        </p>
        <Link href="/" className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {profile && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <span className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center text-2xl font-bold">
              {profile.BloodGroup}
            </span>
            <div>
              <p className="text-lg font-bold text-gray-900">{profile.FullName}</p>
              <p className="text-sm text-gray-600">{profile.Occupation || ''}</p>
              <p className="text-sm text-gray-600">
                {profile.Upazila ? profile.Upazila + ', ' : ''}{profile.District}, {profile.Division}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Last Donation</p>
              <p className="font-medium">{formatDate(profile.LastDonationDate)}</p>
            </div>
            <div>
              <p className="text-gray-500">Next Eligible Date</p>
              <p className="font-medium">{profile.IsEligible ? 'Now — you can donate' : formatDate(profile.NextEligibleDate)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Update status */}
      <form onSubmit={handleSave} className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Update My Donation Status</h2>
        <p className="text-sm text-gray-600">
          After donating, set status to No and add the donation date.
          You become eligible again automatically after 90 days.
        </p>
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
                  name="status"
                  value={value}
                  checked={status === value}
                  onChange={(e) => setStatus(e.target.value)}
                  className="accent-red-600"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Donation Date</label>
          <input
            type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button type="submit" disabled={saving} className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Status'}
        </button>
      </form>
    </div>
  );
}
