// BloodBond Frontend - Register page (Acceptor or Donor, general form)
// After register the account is Pending - Admin approves, then login works.

'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiFetch, BLOOD_GROUPS, OCCUPATIONS } from '@/lib/api';
import LocationSelects, { inputClass } from '@/components/LocationSelects';

// Only a same-site path is a safe place to send the user after login.
function safeNext(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : null;
}

function RegisterForm() {
  const searchParams = useSearchParams();
  // ?next=/donor-form : carried to the login page after registering,
  // so the user lands on the page they wanted once the admin approves them.
  const next = safeNext(searchParams.get('next'));
  const loginHref = next ? '/login?next=' + encodeURIComponent(next) : '/login';
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '', role: 'Acceptor',
    occupation: '', division: '', district: '', upazila: '', bloodGroup: '',
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
    if (form.role === 'Donor' && !form.bloodGroup) {
      setError('Donor hole blood group lagbe.');
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/auth/register', { method: 'POST', body: form });
      setSuccess('Register hoyeche! Admin approve korle login korte parba.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Register</h1>
      <p className="text-gray-600 mt-1">
        Create your BloodBond account. Admin approves every account first.
      </p>

      {success ? (
        <div className="mt-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-5">
          <p className="font-bold">Success!</p>
          <p className="mt-1 text-sm">{success}</p>
          <Link href={loginHref} className="keep-hover inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
            Go to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 bg-white border border-gray-200 rounded-lg p-5 sm:p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required className={inputClass} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} placeholder="01XXXXXXXXX" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
              <select value={form.role} onChange={(e) => set('role', e.target.value)} className={inputClass}>
                <option value="Acceptor">Acceptor (I need blood)</option>
                <option value="Donor">Donor (I want to give blood)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <select value={form.occupation} onChange={(e) => set('occupation', e.target.value)} className={inputClass}>
                <option value="">Select Occupation</option>
                {OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            {form.role === 'Donor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select value={form.bloodGroup} onChange={(e) => set('bloodGroup', e.target.value)} required className={inputClass}>
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <LocationSelects
              division={form.division}
              district={form.district}
              upazila={form.upazila}
              onChange={(loc) => setForm((f) => ({ ...f, ...loc }))}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <Link href={loginHref} className="text-brand-600 font-medium">Login here</Link>.
      </p>
    </div>
  );
}

// useSearchParams needs a Suspense boundary, or the build fails on prerender.
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-10"><p className="text-gray-600">Loading...</p></div>}>
      <RegisterForm />
    </Suspense>
  );
}
