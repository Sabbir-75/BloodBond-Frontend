// BloodBond Frontend - Admin Dashboard (Admin login only)
// Dashboard counts, pending users (approve), pending requests (approve + give from stock),
// and blood stock update.

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, BLOOD_GROUPS } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500';

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
  const [stockGroup, setStockGroup] = useState('A+');
  const [stockChange, setStockChange] = useState(1);

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

  async function updateStock(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const data = await apiFetch('/stock', {
        method: 'PUT',
        body: { bloodGroup: stockGroup, unitsChange: Number(stockChange) },
      });
      setMessage('Stock update hoyeche. ' + data.bloodGroup + ' ekhon ' + data.newUnits + ' bags.');
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

      {message && <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}

      {/* Counts */}
      {dashboard && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            ['Total Donors', dashboard.TotalDonors],
            ['Total Acceptors', dashboard.TotalAcceptors],
            ['Pending Users', dashboard.PendingUsers],
            ['Pending Requests', dashboard.PendingRequests],
            ['Total Donations', dashboard.TotalDonations],
            ['Stock Units', dashboard.TotalStockUnits],
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
              <div>
                <p className="font-bold text-gray-900">{u.FullName} <span className="text-sm font-medium text-brand-600">({u.Role})</span></p>
                <p className="text-sm text-gray-600">{u.Email} • {u.Phone || '-'} • {u.Occupation || ''}</p>
                <p className="text-sm text-gray-600">{u.Upazila ? u.Upazila + ', ' : ''}{u.District}, {u.Division}</p>
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
              <div>
                <p className="font-bold text-brand-600">{r.BloodGroup} — {r.UnitsNeeded} bag(s) • {r.Urgency}</p>
                <p className="text-sm text-gray-600">
                  {r.AcceptorName || r.FullName || ''} • {r.HospitalName || ''} • {r.District}, {r.Division}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approveRequest(r.RequestID)} className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                  Approve
                </button>
                <button onClick={() => fulfilRequest(r.RequestID)} className="px-4 py-2 text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-50">
                  Give from Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stock */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">Blood Stock</h2>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stock.map((s) => (
            <div key={s.BloodGroup} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-brand-600">{s.BloodGroup}</p>
              <p className="text-gray-700 mt-1">{s.UnitsAvailable} bags</p>
            </div>
          ))}
        </div>
        <form onSubmit={updateStock} className="mt-4 bg-white border border-gray-200 rounded-lg p-5 flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select value={stockGroup} onChange={(e) => setStockGroup(e.target.value)} className={inputClass}>
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Units (+ add / − remove)</label>
            <input type="number" value={stockChange} onChange={(e) => setStockChange(e.target.value)} className={inputClass} />
          </div>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
            Update Stock
          </button>
        </form>
      </section>
    </div>
  );
}
