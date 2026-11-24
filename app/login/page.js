// BloodBond Frontend - Login page
// Email + password -> backend gives a JWT token. Then redirect by role:
// Admin -> /admin, Donor -> /profile, Acceptor -> /request.

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      login(data.token, data.user);
      // Go to the right page for this role.
      if (data.user.role === 'Admin') router.push('/admin');
      else if (data.user.role === 'Donor') router.push('/profile');
      else router.push('/request');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500';

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 text-center">Login</h1>
      <p className="text-gray-600 mt-1 text-center">
        Login to see donor contacts, request blood, or manage the system.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} placeholder="Your password" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        No account?{' '}
        <Link href="/register" className="text-brand-600 font-medium">Register here</Link>
        {' '}or{' '}
        <Link href="/donor-form" className="text-brand-600 font-medium">become a donor</Link>.
      </p>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-bold text-gray-900">Demo Admin login</p>
        <p className="mt-1">Email: admin@bloodbond.test</p>
        <p>Password: see README_STEP3.md (demo only — change it for real use).</p>
        <p className="mt-2">New users stay Pending until Admin approves them.</p>
      </div>
    </div>
  );
}
