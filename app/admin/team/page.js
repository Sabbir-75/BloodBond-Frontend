// BloodBond Frontend - Team Members (Admin only)
// Home page-er "Meet Our Team" section-er member add / edit / delete koro.
// Sudhu admin. Chobi phone / computer theke neoa jay (gol preview).

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { resizePhoto } from '@/lib/photo';
import { useAuth } from '@/components/AuthContext';
import Avatar from '@/components/Avatar';
import { inputClass } from '@/components/LocationSelects';

const emptyForm = {
  fullName: '', address: '', university: '', department: '', photo: '', sortOrder: 0,
};

export default function AdminTeamPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // Edit state: kon member edit hocche.
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editPhotoError, setEditPhotoError] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const photoInputRef = useRef(null);
  const editPhotoInputRef = useRef(null);

  useEffect(() => {
    if (ready && !user) router.replace('/login?next=/admin/team');
  }, [ready, user, router]);

  useEffect(() => {
    if (ready && user && user.role !== 'Admin') router.replace('/');
  }, [ready, user, router]);

  // Load all team members (Admin only).
  async function loadMembers() {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/team');
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user || user.role !== 'Admin') return;
    loadMembers();
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

  // Photo picker: file niye choto koro (max 512px JPEG).
  async function handlePhotoPick(e, isEdit) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const dataUri = await resizePhoto(file);
      if (isEdit) {
        setEditPhotoError('');
        setEditForm((f) => ({ ...f, photo: dataUri }));
      } else {
        setPhotoError('');
        setForm((f) => ({ ...f, photo: dataUri }));
      }
    } catch (err) {
      if (isEdit) setEditPhotoError(err.message);
      else setPhotoError(err.message);
    }
    e.target.value = '';
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      await apiFetch('/team', {
        method: 'POST',
        body: { ...form, sortOrder: Number(form.sortOrder) || 0 },
      });
      setMessage('Team member add hoyeche.');
      setForm(emptyForm);
      loadMembers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Edit kholo: form-e member-er info boshao.
  function startEdit(m) {
    setError('');
    setMessage('');
    setEditingId(m.memberId);
    setEditForm({
      fullName: m.fullName || '',
      address: m.address || '',
      university: m.university || '',
      department: m.department || '',
      photo: m.photo || '',
      sortOrder: m.sortOrder ?? 0,
    });
    setEditPhotoError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
    setEditPhotoError('');
  }

  async function saveEdit(memberId) {
    setError('');
    setMessage('');
    setEditSaving(true);
    try {
      await apiFetch('/team/' + memberId, {
        method: 'PUT',
        body: { ...editForm, sortOrder: Number(editForm.sortOrder) || 0 },
      });
      setMessage('Team member update hoyeche.');
      setEditingId(null);
      loadMembers();
    } catch (err) {
      setError(err.message);
    } finally {
      setEditSaving(false);
    }
  }

  async function deleteMember(memberId, fullName) {
    if (!window.confirm(fullName + '-ke team theke delete korba?')) return;
    setError('');
    setMessage('');
    try {
      await apiFetch('/team/' + memberId, { method: 'DELETE' });
      setMessage('Team member delete hoyeche.');
      loadMembers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
      <p className="text-gray-600 mt-1">Home page-er &quot;Meet Our Team&quot; section-e je 4 jon dekhabe, tader ekhane add koro. Sudhu admin.</p>

      {message && <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}

      {/* Add form */}
      <form onSubmit={handleAdd} className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>

        {/* Photo picker - gol preview, click korle file picker khulbe */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => photoInputRef.current && photoInputRef.current.click()}
            aria-label="Member-er photo choose koro"
            className="shrink-0 rounded-full ring-2 ring-brand-500 ring-offset-2 ring-offset-white hover:ring-brand-600"
          >
            <Avatar photo={form.photo || null} name={form.fullName || '?'} className="w-20 h-20 text-2xl" />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-700">Photo (optional)</p>
            <p className="text-xs text-gray-500 mt-1">
              Gol chobi-te click kore phone / computer theke chobi nao.
            </p>
            {form.photo && (
              <button type="button" onClick={() => set('photo', '')} className="mt-1 text-xs text-brand-600 font-medium">
                Remove photo
              </button>
            )}
            {photoError && <p className="mt-1 text-xs text-red-600">{photoError}</p>}
          </div>
          <input ref={photoInputRef} type="file" accept="image/*" onChange={(e) => handlePhotoPick(e, false)} className="hidden" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required className={inputClass} placeholder="Full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input value={form.address} onChange={(e) => set('address', e.target.value)} className={inputClass} placeholder="House / Road / Area" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
            <input value={form.university} onChange={(e) => set('university', e.target.value)} className={inputClass} placeholder="Kon university te pore" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input value={form.department} onChange={(e) => set('department', e.target.value)} className={inputClass} placeholder="Kon department" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order (choto number age asbe)</label>
            <input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} className={inputClass} />
          </div>
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50">
          {saving ? 'Saving...' : 'Add Team Member'}
        </button>
      </form>

      {/* Member list */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">All Team Members ({members.length})</h2>
        {loading && <p className="mt-4 text-gray-600">Loading members...</p>}
        {!loading && members.length === 0 && <p className="mt-4 text-gray-600">Kono team member add kora hoy nai ekhono.</p>}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {members.map((m) => (
            <div key={m.memberId} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Avatar photo={m.photo} name={m.fullName} className="w-16 h-16 text-xl ring-2 ring-brand-500" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-gray-900 break-words">{m.fullName}</h3>
                  {m.university && <p className="text-sm text-gray-600 break-words">{m.university}</p>}
                  {m.department && <p className="text-sm text-gray-600 break-words">{m.department}</p>}
                  {m.address && <p className="text-sm text-gray-600 break-words">{m.address}</p>}
                  <p className="text-xs text-gray-500 mt-1">Order: {m.sortOrder}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => (editingId === m.memberId ? cancelEdit() : startEdit(m))}
                    className="px-3 py-1.5 text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white"
                  >
                    {editingId === m.memberId ? 'Close' : 'Edit'}
                  </button>
                  <button
                    onClick={() => deleteMember(m.memberId, m.fullName)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Edit panel - ei member-er card-er nichei khule */}
              {editingId === m.memberId && (
                <div className="mt-5 border-t border-gray-200 pt-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => editPhotoInputRef.current && editPhotoInputRef.current.click()}
                      aria-label="Member-er photo choose koro"
                      className="shrink-0 rounded-full ring-2 ring-brand-500 ring-offset-2 ring-offset-white hover:ring-brand-600"
                    >
                      <Avatar photo={editForm.photo || null} name={editForm.fullName || '?'} className="w-16 h-16 text-xl" />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700">Photo (optional)</p>
                      {editForm.photo && (
                        <button type="button" onClick={() => setEdit('photo', '')} className="mt-1 text-xs text-brand-600 font-medium">
                          Remove photo
                        </button>
                      )}
                      {editPhotoError && <p className="mt-1 text-xs text-red-600">{editPhotoError}</p>}
                    </div>
                    <input ref={editPhotoInputRef} type="file" accept="image/*" onChange={(e) => handlePhotoPick(e, true)} className="hidden" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input value={editForm.fullName} onChange={(e) => setEdit('fullName', e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input value={editForm.address} onChange={(e) => setEdit('address', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                      <input value={editForm.university} onChange={(e) => setEdit('university', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input value={editForm.department} onChange={(e) => setEdit('department', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                      <input type="number" value={editForm.sortOrder} onChange={(e) => setEdit('sortOrder', e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(m.memberId)} disabled={editSaving} className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50">
                      {editSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={cancelEdit} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
