// BloodBond Frontend - My Profile page (Donor)
// Shows the donor's own profile + next eligible date (90-day rule),
// lets the donor update status (Yes / No / NotSure) + last donation date,
// and edit profile details (name, phone, occupation, address) with
// the "Edit My Profile" button. Blood group + email are NOT editable:
// blood group is the medical identity, email is the login identity.

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, OCCUPATIONS } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';
import LocationSelects, { inputClass } from '@/components/LocationSelects';

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

  // Edit My Profile form state.
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '', phone: '', occupation: '', division: '', district: '', upazila: '',
  });
  const [editMessage, setEditMessage] = useState('');
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);

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

  // Open the edit form with the current profile values.
  function startEditing() {
    if (!profile) return;
    setEditForm({
      fullName: profile.FullName || '',
      phone: profile.Phone || '',
      occupation: profile.Occupation || '',
      division: profile.Division || '',
      district: profile.District || '',
      upazila: profile.Upazila || '',
    });
    setEditMessage('');
    setEditError('');
    setEditing(true);
  }

  function setEdit(field, value) {
    setEditForm((f) => ({ ...f, [field]: value }));
  }

  // Save profile details (PUT /api/donors/me — backend, routes/donors.js).
  async function handleEditSave(e) {
    e.preventDefault();
    setEditMessage('');
    setEditError('');
    setEditSaving(true);
    try {
      await apiFetch('/donors/me', { method: 'PUT', body: editForm });
      setEditMessage('Profile update hoyeche.');
      setEditing(false);
      loadProfile();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSaving(false);
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
        <Link href="/" className="keep-hover inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
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
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 card-lift">
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
              <p className="text-sm text-gray-600">{profile.Email}</p>
              <p className="text-sm text-gray-600">{profile.Phone || ''}</p>
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
          <button
            type="button"
            onClick={startEditing}
            className="mt-5 px-4 py-2 text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white"
          >
            Edit My Profile
          </button>
        </div>
      )}

      {/* Edit My Profile form (blood group + email are read-only — see note below). */}
      {editing && (
        <form onSubmit={handleEditSave} className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-4 animate-fade-up">
          <h2 className="text-lg font-bold text-gray-900">Edit My Profile</h2>
          <p className="text-sm text-gray-600">
            Blood group and email cannot be changed here — blood group is your
            medical identity and email is your login. If they are wrong, contact the admin.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group (cannot change)</label>
              <input value={profile?.BloodGroup || ''} disabled className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (cannot change)</label>
              <input value={profile?.Email || ''} disabled className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={editForm.fullName} onChange={(e) => setEdit('fullName', e.target.value)} required className={inputClass} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={editForm.phone} onChange={(e) => setEdit('phone', e.target.value)} className={inputClass} placeholder="01XXXXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <select value={editForm.occupation} onChange={(e) => setEdit('occupation', e.target.value)} className={inputClass}>
                <option value="">Select Occupation</option>
                {OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <LocationSelects
              division={editForm.division}
              district={editForm.district}
              upazila={editForm.upazila}
              onChange={(loc) => setEditForm((f) => ({ ...f, ...loc }))}
            />
          </div>
          {editError && <p className="text-sm text-red-600">{editError}</p>}
          {editMessage && <p className="text-sm text-green-700">{editMessage}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={editSaving} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50">
              {editSaving ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
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
