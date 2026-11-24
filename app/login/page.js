// BloodBond Frontend - Login page
// Email + password -> backend gives a JWT token. Then redirect by role:
// Admin -> /admin, Donor -> /profile, Acceptor -> /request.
// Split layout: left branding panel (logo + heartbeat animation),
// right clean form card. No demo login box (unprofessional).

'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';
import Logo from '@/components/Logo';
import LottiePlayer from '@/components/LottiePlayer';
import heartbeatData from '@/public/lottie/heartbeat.json';

// Only a same-site path is a safe place to send the user after login.
function safeNext(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : null;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // ?next=/donor-form : after login, go back to the page the user wanted.
  const next = safeNext(searchParams.get('next'));
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
      // If the user came here to reach another page, send them back there.
      if (next) {
        router.push(next);
        return;
      }
      // Otherwise go to the right page for this role.
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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-fade-up">
        {/* Left: branding panel (hidden on small screens).
            Light red background (brand-100) so the logo stays fully visible —
            on the old dark-red panel the red "Bond" word blended into the bg. */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-b from-brand-100 to-red-50 p-10">
          <div>
            <Logo />
            <h2 className="mt-10 text-3xl font-bold leading-snug text-gray-900">
              Donate Blood,<br />Keep the World Beating
            </h2>
            <p className="mt-3 text-gray-700">
              One bag of blood can save up to three lives.
              Login to find donors, request blood, or manage the system.
            </p>
          </div>
          <div className="mt-8 bg-white/80 rounded-lg p-4">
            <LottiePlayer animationData={heartbeatData} className="w-full max-w-[280px] mx-auto" />
            <p className="text-center text-sm text-brand-700 font-medium">Every heartbeat matters.</p>
          </div>
        </div>

        {/* Right: login form */}
        <div className="p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-1">
            Login to see donor contacts, request blood, or manage the system.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            <Link href={next ? '/register?next=' + encodeURIComponent(next) : '/register'} className="text-brand-600 font-medium">Register here</Link>
            {' '}or{' '}
            <Link href="/donor-form" className="text-brand-600 font-medium">become a donor</Link>.
          </p>
          <p className="mt-4 text-center text-xs text-gray-500">
            New accounts stay Pending until the Admin approves them.
          </p>
        </div>
      </div>
    </div>
  );
}

// useSearchParams needs a Suspense boundary, or the build fails on prerender.
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-10"><p className="text-gray-600">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
