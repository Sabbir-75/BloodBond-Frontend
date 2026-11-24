// BloodBond Frontend - All Donors (Admin only)
// Shob donor-er card: status + kobe theke blood dite parbe (next eligible date).
// Sudhu admin dekhte pare - ekhane phone/email-o dekhano hoy.

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, BLOOD_GROUPS } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';

const selectClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500';

// Status badge: Yes = green, NotSure = amber, No = gray.
function statusBadge(status) {
  if (status === 'Yes') return 'bg-green-100 text-green-800';
  if (status === 'NotSure') return 'bg-amber-100 text-amber-800';
  return 'bg-gray-200 text-gray-700';
}

function statusText(status) {
  if (status === 'Yes') return 'Available';
  if (status === 'NotSure') return 'Confirm by phone';
  return 'Not Available';
}

// Format a date as 12 Aug 2026. Empty date = '-'.
function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminDonorsPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (ready && !user) router.replace('/login?next=/admin/donors');
  }, [ready, user, router]);

  useEffect(() => {
    if (ready && user && user.role !== 'Admin') router.replace('/');
  }, [ready, user, router]);

  // Load all donors (Admin only).
  useEffect(() => {
    if (!user || user.role !== 'Admin') return;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch('/admin/donors');
        setDonors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  // While the login check runs, show nothing yet.
  // (All hooks above run first, so the hook order never changes.)
  if (!ready || !user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }
  if (user.role !== 'Admin') return null;

  // Client-side filters: blood group + status.
  const filtered = donors.filter((d) => {
    if (groupFilter && d.BloodGroup !== groupFilter) return false;
    if (statusFilter && d.AvailabilityStatus !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">All Donors</h1>
      <p className="text-gray-600 mt-1">
        Sudhu admin dekhte pare. Shob donor — available hok ba na hok.
      </p>

      {/* Filters */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
          <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className={selectClass}>
            <option value="">All Groups</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option value="">All Status</option>
            <option value="Yes">Available (Yes)</option>
            <option value="NotSure">Not Sure</option>
            <option value="No">Not Available (No)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading && <p className="mt-8 text-gray-600">Loading donors...</p>}
      {error && <p className="mt-8 text-red-600">{error}</p>}
      {!loading && !error && <p className="mt-8 text-gray-600">{filtered.length} donor(s).</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <div key={d.DonorID} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col card-lift">
            <div className="flex items-start justify-between">
              <span className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center text-2xl font-bold">
                {d.BloodGroup}
              </span>
              <div className="flex flex-col items-end gap-1">
                <span className={'text-xs font-medium px-2 py-1 rounded-full ' + statusBadge(d.AvailabilityStatus)}>
                  {statusText(d.AvailabilityStatus)}
                </span>
                {d.UserStatus === 'Pending' && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                    Pending approval
                  </span>
                )}
              </div>
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">{d.FullName}</h3>
            <p className="text-sm text-gray-600">{d.Occupation || '-'}</p>
            <p className="text-sm text-gray-600 mt-1">
              {d.Upazila ? d.Upazila + ', ' : ''}{d.District}, {d.Division}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Next eligible: {d.IsEligible ? 'Available now' : 'Available from ' + formatDate(d.NextEligibleDate)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Phone: {d.Phone || '-'}</p>
            <p className="text-sm text-gray-600">Email: {d.Email || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
