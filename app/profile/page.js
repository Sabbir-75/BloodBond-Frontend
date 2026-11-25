// BloodBond Frontend - My Profile page (Donor / Acceptor / Admin - shobai)
// Shob role-er jonno: nijer info dekho + edit koro (nam, phone, address,
// occupation, Division/District/Upazila), profile chobi bodlao,
// ar password bodlao. Blood group + email bodlano jay NA:
// blood group holo medical identity, email holo login identity.
// Donor-er extra: blood group, last donation / next eligible date (90-day
// rule), ar donation status (Yes / No / NotSure) update form.

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, OCCUPATIONS } from '@/lib/api';
import { resizePhoto } from '@/lib/photo';
import { useAuth } from '@/components/AuthContext';
import Avatar from '@/components/Avatar';
import LocationSelects, { inputClass } from '@/components/LocationSelects';

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProfilePage() {
  const { user, ready, updateUser } = useAuth();
  const router = useRouter();

  // Shob role-er common info (/api/profile/me) + Donor-er extra info (/api/donors/me).
  const [common, setCommon] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Donor status form state.
  const [status, setStatus] = useState('Yes');
  const [lastDate, setLastDate] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Edit My Profile form state (shob role-er jonno eki form).
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '', phone: '', occupation: '', address: '',
    division: '', district: '', upazila: '',
  });
  const [editMessage, setEditMessage] = useState('');
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Profile photo state.
  const [newPhoto, setNewPhoto] = useState('');
  const [photoMessage, setPhotoMessage] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [photoSaving, setPhotoSaving] = useState(false);
  const photoInputRef = useRef(null);

  // Change password form state.
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (ready && !user) router.push('/login');
  }, [ready, user, router]);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const commonData = await apiFetch('/profile/me');
      setCommon(commonData);
      if (user.role === 'Donor') {
        const d = await apiFetch('/donors/me');
        setProfile(d);
        setStatus(d.AvailabilityStatus || 'Yes');
        setLastDate(d.LastDonationDate ? d.LastDonationDate.slice(0, 10) : '');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Donor status save (shudhu Donor).
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
      loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Open the edit form with the current profile values.
  function startEditing() {
    if (!common) return;
    setEditForm({
      fullName: common.fullName || '',
      phone: common.phone || '',
      occupation: common.occupation || '',
      address: common.address || '',
      division: common.division || '',
      district: common.district || '',
      upazila: common.upazila || '',
    });
    setEditMessage('');
    setEditError('');
    setEditing(true);
  }

  function setEdit(field, value) {
    setEditForm((f) => ({ ...f, [field]: value }));
  }

  // Save profile details (PUT /api/profile/me - shob role-er jonno eki).
  async function handleEditSave(e) {
    e.preventDefault();
    setEditMessage('');
    setEditError('');
    setEditSaving(true);
    try {
      const data = await apiFetch('/profile/me', { method: 'PUT', body: editForm });
      // Notun nam navbar-eo sathe sathe bodle jabe.
      if (data.user) updateUser(data.user);
      setEditMessage('Profile update hoyeche.');
      setEditing(false);
      loadAll();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSaving(false);
    }
  }

  // Photo picker: file niye choto koro (max 512px JPEG), preview dekhao.
  async function handlePhotoPick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPhotoError('');
    setPhotoMessage('');
    try {
      const dataUri = await resizePhoto(file);
      setNewPhoto(dataUri);
    } catch (err) {
      setPhotoError(err.message);
    }
    e.target.value = '';
  }

  // Notun chobi save koro.
  async function handlePhotoSave() {
    if (!newPhoto) return;
    setPhotoError('');
    setPhotoMessage('');
    setPhotoSaving(true);
    try {
      await apiFetch('/profile/me/photo', { method: 'PUT', body: { photo: newPhoto } });
      // Navbar-er avatar-eo sathe sathe notun chobi dekhabe.
      updateUser({ profilePhoto: newPhoto });
      setCommon((c) => (c ? { ...c, profilePhoto: newPhoto } : c));
      setNewPhoto('');
      setPhotoMessage('Profile photo update hoyeche.');
    } catch (err) {
      setPhotoError(err.message);
    } finally {
      setPhotoSaving(false);
    }
  }

  function setPw(field, value) {
    setPwForm((f) => ({ ...f, [field]: value }));
  }

  // Password bodlano: purono password thik hole tobei bodlabe.
  async function handlePasswordSave(e) {
    e.preventDefault();
    setPwMessage('');
    setPwError('');
    if (pwForm.new.length < 6) {
      setPwError('Notun password kom pokkhe 6 okkhor hote hobe.');
      return;
    }
    if (pwForm.new !== pwForm.confirm) {
      setPwError('Notun password ar confirm password mile nai.');
      return;
    }
    setPwSaving(true);
    try {
      await apiFetch('/profile/me/password', {
        method: 'PUT',
        body: { currentPassword: pwForm.current, newPassword: pwForm.new },
      });
      setPwMessage('Password bodle geche.');
      setPwForm({ current: '', new: '', confirm: '' });
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  }

  if (!ready || loading) return <p className="max-w-2xl mx-auto px-4 py-10 text-gray-600">Loading...</p>;
  if (!user) return null;

  const isDonor = user.role === 'Donor';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {common && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 card-lift">
          <div className="flex items-center gap-4">
            <Avatar photo={common.profilePhoto} name={common.fullName} className="w-20 h-20 text-3xl ring-2 ring-brand-500" />
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-900 break-words">
                {common.fullName}
                {isDonor && profile && (
                  <span className="ml-2 inline-block align-middle text-sm font-bold px-2 py-0.5 rounded-full bg-red-50 text-brand-700 border border-red-200">
                    {profile.BloodGroup}
                  </span>
                )}
              </p>
              <p className="text-sm font-medium text-brand-600">{common.role}</p>
              <p className="text-sm text-gray-600">{common.occupation || ''}</p>
              <p className="text-sm text-gray-600 break-words">
                {common.address ? common.address + ', ' : ''}
                {common.upazila ? common.upazila + ', ' : ''}{common.district || ''}{common.division ? ', ' + common.division : ''}
              </p>
              <p className="text-sm text-gray-600 break-words">{common.email}</p>
              <p className="text-sm text-gray-600">{common.phone || ''}</p>
            </div>
          </div>
          {isDonor && profile && (
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
          )}
          <button
            type="button"
            onClick={startEditing}
            className="mt-5 px-4 py-2 text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white"
          >
            Edit My Profile
          </button>
        </div>
      )}

      {/* Edit My Profile form (blood group + email are read-only - see note below). */}
      {editing && (
        <form onSubmit={handleEditSave} className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-4 animate-fade-up">
          <h2 className="text-lg font-bold text-gray-900">Edit My Profile</h2>
          <p className="text-sm text-gray-600">
            Blood group and email cannot be changed here — blood group is your
            medical identity and email is your login. If they are wrong, contact the admin.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {isDonor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group (cannot change)</label>
                <input value={profile?.BloodGroup || ''} disabled className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (cannot change)</label>
              <input value={common?.email || ''} disabled className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md" />
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input value={editForm.address} onChange={(e) => setEdit('address', e.target.value)} className={inputClass} placeholder="House / Road / Area" />
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

      {/* Profile photo - gol preview + change + save */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Profile Photo</h2>
        <div className="flex items-center gap-4">
          <Avatar photo={newPhoto || common?.profilePhoto} name={common?.fullName} className="w-24 h-24 text-3xl ring-2 ring-brand-500" />
          <div className="min-w-0">
            <p className="text-sm text-gray-600">
              Gol chobi-te click kore phone / computer theke chobi nao.
              Chobi-ta pathanor age choto kora hoy, jeno site fast thake.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => photoInputRef.current && photoInputRef.current.click()}
                className="px-4 py-2 text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white"
              >
                Change photo
              </button>
              <button
                type="button"
                onClick={handlePhotoSave}
                disabled={!newPhoto || photoSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50"
              >
                {photoSaving ? 'Saving...' : 'Save Photo'}
              </button>
              {newPhoto && (
                <button
                  type="button"
                  onClick={() => setNewPhoto('')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoPick} className="hidden" />
          </div>
        </div>
        {photoError && <p className="text-sm text-red-600">{photoError}</p>}
        {photoMessage && <p className="text-sm text-green-700">{photoMessage}</p>}
      </div>

      {/* Change password */}
      <form onSubmit={handlePasswordSave} className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" value={pwForm.current} onChange={(e) => setPw('current', e.target.value)} required className={inputClass} placeholder="Purono password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password (min 6 characters)</label>
            <input type="password" value={pwForm.new} onChange={(e) => setPw('new', e.target.value)} required minLength={6} className={inputClass} placeholder="Notun password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" value={pwForm.confirm} onChange={(e) => setPw('confirm', e.target.value)} required minLength={6} className={inputClass} placeholder="Notun password abar dao" />
          </div>
        </div>
        {pwError && <p className="text-sm text-red-600">{pwError}</p>}
        {pwMessage && <p className="text-sm text-green-700">{pwMessage}</p>}
        <button type="submit" disabled={pwSaving} className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50">
          {pwSaving ? 'Saving...' : 'Change Password'}
        </button>
      </form>

      {/* Update status - shudhu Donor-er jonno */}
      {isDonor && (
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
      )}
    </div>
  );
}
