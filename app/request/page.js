// BloodBond Frontend - Request Blood page (Acceptor form)
// Login required (Acceptor). After submit the request is Pending for Admin.

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, BLOOD_GROUPS } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';
import LocationSelects, { inputClass } from '@/components/LocationSelects';

export default function RequestPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    bloodGroup: '', unitsNeeded: 1, urgency: 'Medium',
    division: '', district: '', upazila: '', hospitalName: '', neededByDate: '',
  });
  const [myRequests, setMyRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Guests are sent to Login. Donor/Admin see a note instead of the form.
  useEffect(() => {
    if (ready && !user) router.push('/login');
  }, [ready, user, router]);

  // Load my own requests (Acceptor only).
  useEffect(() => {
    if (user && user.role === 'Acceptor') {
      apiFetch('/requests/mine').then(setMyRequests).catch(() => {});
    }
  }, [user, success]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await apiFetch('/requests', { method: 'POST', body: form });
      setSuccess('Request pathano hoyeche. Request ID: ' + data.requestId + '. Admin approve korle janano hobe.');
      setForm({ bloodGroup: '', unitsNeeded: 1, urgency: 'Medium', division: '', district: '', upazila: '', hospitalName: '', neededByDate: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return <p className="max-w-2xl mx-auto px-4 py-10 text-gray-600">Loading...</p>;
  if (!user) return null;

  if (user.role !== 'Acceptor') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Request Blood</h1>
        <p className="mt-4 text-gray-600">
          Only Acceptor accounts can request blood. Please login with an Acceptor account,
          or <Link href="/register" className="text-brand-600 font-medium">register as Acceptor</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Request Blood</h1>
      <p className="text-gray-600 mt-1">Fill in the details. Admin will review your request.</p>

      {success && (
        <div className="mt-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 bg-white border border-gray-200 rounded-lg p-5 sm:p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group Needed</label>
            <select value={form.bloodGroup} onChange={(e) => set('bloodGroup', e.target.value)} required className={inputClass}>
              <option value="">Select Blood Group</option>
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bags Needed</label>
            <input type="number" min={1} max={10} value={form.unitsNeeded} onChange={(e) => set('unitsNeeded', e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select value={form.urgency} onChange={(e) => set('urgency', e.target.value)} className={inputClass}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Needed By Date</label>
            <input type="date" value={form.neededByDate} onChange={(e) => set('neededByDate', e.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
            <input value={form.hospitalName} onChange={(e) => set('hospitalName', e.target.value)} className={inputClass} placeholder="Hospital name" />
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

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50">
          {loading ? 'Sending...' : 'Submit Blood Request'}
        </button>
      </form>

      {/* My requests */}
      {myRequests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">My Requests</h2>
          <div className="mt-4 space-y-3">
            {myRequests.map((r) => (
              <div key={r.RequestID} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-brand-600">{r.BloodGroup} — {r.UnitsNeeded} bag(s)</p>
                  <p className="text-sm text-gray-600">{r.HospitalName || ''} {r.District}, {r.Division} • Urgency: {r.Urgency}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">{r.Status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
