// BloodBond Frontend - Manage Blood Banks (Admin only)
// Bank add koro, stock update koro. Sudhu admin.
// Edit panel bank-er card-er nichei khule - info + proti group-er bag count.

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, BLOOD_GROUPS } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';
import LocationSelects, { inputClass } from '@/components/LocationSelects';

const emptyForm = {
  bankName: '', email: '', phone: '',
  division: '', district: '', upazila: '', address: '',
  bloodGroup: 'A+', units: 0,
};

export default function AdminBloodBanksPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Edit state: kon bank edit hocche + tar info + proti group-er bag count.
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editStock, setEditStock] = useState({});
  // editStockSaved: prottek group-er SAVE KORA (ashol) bag count.
  // Save button sudhu tokhon-i enable hobe jokhon input-er number
  // save kora number theke alada hobe (barle ba komle).
  const [editStockSaved, setEditStockSaved] = useState({});
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace('/login?next=/admin/bloodbanks');
  }, [ready, user, router]);

  useEffect(() => {
    if (ready && user && user.role !== 'Admin') router.replace('/');
  }, [ready, user, router]);

  // Load all banks (Admin only).
  async function loadBanks() {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/bloodbanks/admin');
      setBanks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user || user.role !== 'Admin') return;
    loadBanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function setEdit(field, value) {
    setEditForm((f) => ({ ...f, [field]: value }));
  }

  // Email dile thik format-e kina dekho (khali thakle cholbe).
  function emailOk(email) {
    return !email || /@/.test(email);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!emailOk(form.email)) {
      setError('Email thik na.');
      return;
    }
    setSaving(true);
    try {
      await apiFetch('/bloodbanks', {
        method: 'POST',
        body: { ...form, units: Number(form.units) },
      });
      setMessage('Blood bank add hoyeche.');
      setForm(emptyForm);
      loadBanks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Edit kholo: form-e bank-er info + ekhonkar bag count boshao.
  function startEdit(bank) {
    setError('');
    setMessage('');
    setEditingId(bank.bankId);
    setEditForm({
      bankName: bank.bankName || '',
      email: bank.email || '',
      phone: bank.phone || '',
      division: bank.division || '',
      district: bank.district || '',
      upazila: bank.upazila || '',
      address: bank.address || '',
    });
    const stock = {};
    for (const g of BLOOD_GROUPS) stock[g] = 0;
    for (const s of bank.stock) stock[s.bloodGroup] = s.units;
    setEditStock(stock);
    // Shurute input ar save kora man ek — tai shob Save button disable thakbe.
    setEditStockSaved({ ...stock });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
    setEditStock({});
    setEditStockSaved({});
  }

  async function saveInfo(bankId) {
    setError('');
    setMessage('');
    if (!emailOk(editForm.email)) {
      setError('Email thik na.');
      return;
    }
    setEditSaving(true);
    try {
      await apiFetch('/bloodbanks/' + bankId, { method: 'PUT', body: editForm });
      setMessage('Blood bank update hoyeche.');
      loadBanks();
    } catch (err) {
      setError(err.message);
    } finally {
      setEditSaving(false);
    }
  }

  async function saveStock(bankId, group) {
    setError('');
    setMessage('');
    setEditSaving(true);
    try {
      await apiFetch('/bloodbanks/' + bankId + '/stock', {
        method: 'PUT',
        body: { bloodGroup: group, units: Number(editStock[group]) },
      });
      setMessage(group + ' stock update hoyeche.');
      // Save hoye geche — ekhon input ar save kora man abar ek,
      // tai ei group-er Save button abar disable hoye jabe.
      setEditStockSaved((s) => ({ ...s, [group]: Number(editStock[group]) }));
      loadBanks();
    } catch (err) {
      setError(err.message);
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Blood Banks</h1>
      <p className="text-gray-600 mt-1">Bank add koro, stock update koro. Sudhu admin.</p>

      {message && <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}

      {/* Add form */}
      <form onSubmit={handleAdd} className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Add Blood Bank</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input value={form.bankName} onChange={(e) => set('bankName', e.target.value)} required className={inputClass} placeholder="Bank name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} required className={inputClass} placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} placeholder="bank@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input value={form.address} onChange={(e) => set('address', e.target.value)} className={inputClass} placeholder="House / Road / Area" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <LocationSelects
            division={form.division}
            district={form.district}
            upazila={form.upazila}
            onChange={(loc) => setForm((f) => ({ ...f, ...loc }))}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select value={form.bloodGroup} onChange={(e) => set('bloodGroup', e.target.value)} className={inputClass}>
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bags (units)</label>
            <input type="number" min="0" value={form.units} onChange={(e) => set('units', e.target.value)} className={inputClass} />
          </div>
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50">
          {saving ? 'Saving...' : 'Add Blood Bank'}
        </button>
      </form>

      {/* Bank list */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">All Blood Banks ({banks.length})</h2>
        {loading && <p className="mt-4 text-gray-600">Loading banks...</p>}
        {!loading && banks.length === 0 && <p className="mt-4 text-gray-600">Kono bank add kora hoy nai ekhono.</p>}
        <div className="mt-4 space-y-4">
          {banks.map((b) => (
            <div key={b.bankId} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{b.bankName}</h3>
                  <p className="text-sm text-gray-600 mt-1 break-words">
                    {b.phone ? <a href={'tel:' + b.phone} className="text-brand-600">{b.phone}</a> : '-'}
                    {b.email ? ' • ' + b.email : ''}
                  </p>
                  <p className="text-sm text-gray-600 break-words">
                    {b.address ? b.address + ', ' : ''}
                    {b.upazila ? b.upazila + ', ' : ''}{b.district || ''}{b.division ? ', ' + b.division : ''}
                  </p>
                </div>
                <button
                  onClick={() => (editingId === b.bankId ? cancelEdit() : startEdit(b))}
                  className="px-4 py-2 text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white"
                >
                  {editingId === b.bankId ? 'Close' : 'Edit'}
                </button>
              </div>

              {/* Per-group bags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {b.stock.length === 0 && <span className="text-sm text-gray-500">Kono group-e bag nai ekhono.</span>}
                {b.stock.map((s) => (
                  <span key={s.bloodGroup} className="text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-brand-700 border border-red-200">
                    {s.bloodGroup}: {s.units} bag{s.units === 1 ? '' : 's'}
                  </span>
                ))}
              </div>

              {/* Edit panel - ei bank-er card-er nichei khule */}
              {editingId === b.bankId && (
                <div className="mt-5 border-t border-gray-200 pt-5 space-y-4">
                  <h4 className="font-bold text-gray-900">Edit Bank Info</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <input value={editForm.bankName} onChange={(e) => setEdit('bankName', e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input value={editForm.phone} onChange={(e) => setEdit('phone', e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={editForm.email} onChange={(e) => setEdit('email', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input value={editForm.address} onChange={(e) => setEdit('address', e.target.value)} className={inputClass} />
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
                  <button onClick={() => saveInfo(b.bankId)} disabled={editSaving} className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50">
                    Save Info
                  </button>

                  <h4 className="font-bold text-gray-900 pt-2">Edit Stock (proti group-er mot bag)</h4>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                    {BLOOD_GROUPS.map((g) => (
                      <div key={g} className="flex items-center gap-2">
                        <span className="w-10 text-sm font-bold text-brand-600">{g}</span>
                        <input
                          type="number"
                          min="0"
                          value={editStock[g] ?? 0}
                          onChange={(e) => setEditStock((s) => ({ ...s, [g]: e.target.value }))}
                          className={inputClass + ' min-w-0 flex-1'}
                        />
                        <button onClick={() => saveStock(b.bankId, g)} disabled={editSaving || Number(editStock[g] ?? 0) === Number(editStockSaved[g] ?? 0)} className="px-3 py-2 text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                          Save
                        </button>
                      </div>
                    ))}
                  </div>

                  <button onClick={cancelEdit} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
