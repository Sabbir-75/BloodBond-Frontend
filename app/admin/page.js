// BloodBond Frontend - Admin Dashboard (Admin login only)
// Dashboard counts, pending users (approve), pending requests (approve + give from stock),
// and blood stock (donation stock + blood bank stock miliye).
// Stock update form ar nai - stock bodlay sudhu donation, issue, ar blood bank entry diye.

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';

export default function AdminPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (ready && !user) router.push('/login');
  }, [ready, user, router]);

  // Load all admin data.
  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [d, u, r, s] = await Promise.all([
        apiFetch('/admin/dashboard'),
        apiFetch('/admin/users/pending'),
        apiFetch('/requests/pending'),
        apiFetch('/stock'),
      ]);
      setDashboard(d);
      setPendingUsers(u);
      setPendingRequests(r);
      setStock(s);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user && user.role === 'Admin') loadAll();
    else if (user) setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function approveUser(id) {
    setMessage('');
    try {
      await apiFetch('/admin/users/' + id + '/approve', { method: 'PUT' });
      setMessage('User approve hoyeche.');
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function approveRequest(id) {
    setMessage('');
    try {
      await apiFetch('/requests/' + id + '/approve', { method: 'PUT' });
      setMessage('Request approve hoyeche.');
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function fulfilRequest(id) {
    setMessage('');
    setError('');
    try {
      await apiFetch('/requests/' + id + '/fulfil-from-stock', { method: 'PUT' });
      setMessage('Stock theke blood dewa hoyeche.');
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!ready || loading) return <p className="max-w-6xl mx-auto px-4 py-10 text-gray-600">Loading...</p>;
  if (!user) return null;

  if (user.role !== 'Admin') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-4 text-gray-600">Only Admin can see this page. Your role is {user.role}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-600 mt-1">Welcome, {user.fullName}. Approve users and requests, manage stock.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/admin/donors" className="keep-hover px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
          All Donors
        </Link>
        <Link href="/admin/bloodbanks" className="keep-hover px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
          Manage Blood Banks
        </Link>
      </div>

      {message && <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}

      {/* Counts */}
      {dashboard && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {[
            ['Total Donors', dashboard.TotalDonors],
            ['Total Acceptors', dashboard.TotalAcceptors],
            ['Pending Users', dashboard.PendingUsers],
            ['Pending Requests', dashboard.PendingRequests],
            ['Total Donations', dashboard.TotalDonations],
            ['Stock Units', dashboard.TotalStockUnits],
            ['Total Blood Banks', dashboard.TotalBloodBanks],
          ].map(([label, value]) => (
            <div key={label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-brand-600">{value}</p>
              <p className="text-sm text-gray-600 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pending users */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">Users Waiting for Approval ({pendingUsers.length})</h2>
        {pendingUsers.length === 0 && <p className="mt-2 text-gray-600">No pending users.</p>}
        <div className="mt-4 space-y-3">
          {pendingUsers.map((u) => (
            <div key={u.UserID} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-gray-900 break-words">{u.FullName} <span className="text-sm font-medium text-brand-600">({u.Role})</span></p>
                <p className="text-sm text-gray-600 break-words">{u.Email} • {u.Phone || '-'} • {u.Occupation || ''}</p>
                <p className="text-sm text-gray-600 break-words">{u.Upazila ? u.Upazila + ', ' : ''}{u.District}, {u.Division}</p>
              </div>
              <button onClick={() => approveUser(u.UserID)} className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                Approve
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Pending requests */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">Pending Blood Requests ({pendingRequests.length})</h2>
        {pendingRequests.length === 0 && <p className="mt-2 text-gray-600">No pending requests.</p>}
        <div className="mt-4 space-y-3">
          {pendingRequests.map((r) => (
            <div key={r.RequestID} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-brand-600">{r.BloodGroup} — {r.UnitsNeeded} bag(s) • {r.Urgency}</p>
                <p className="text-sm text-gray-600 break-words">
                  {r.AcceptorName || r.FullName || ''} • {r.HospitalName || ''} • {r.District}, {r.Division}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approveRequest(r.RequestID)} className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                  Approve
                </button>
                <button onClick={() => fulfilRequest(r.RequestID)} className="px-4 py-2 text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white">
                  Give from Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stock - mot stock: donation stock + blood bank stock */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">Blood Stock</h2>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stock.map((s) => (
            <div key={s.BloodGroup} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-brand-600">{s.BloodGroup}</p>
              <p className="text-gray-700 mt-1">{s.UnitsAvailable} bags</p>
              <p className="text-sm text-gray-600 mt-1">
                {(s.AvailableDonors || 0) === 1
                  ? '1 donor available'
                  : (s.AvailableDonors || 0) + ' donors available'}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Stock bodlate <Link href="/admin/bloodbanks" className="text-brand-600 font-medium">Manage Blood Banks</Link> page-e jao.
        </p>
      </section>
    </div>
  );
}
