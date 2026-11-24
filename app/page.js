// BloodBond Frontend - Home page
// Navbar, Hero, Our Services, Blood Stock, Available Donors preview, How It Works, Footer.

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import DonorCard from '@/components/DonorCard';

export default function HomePage() {
  const [stock, setStock] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load stock + a few donors from the backend (real data, no fake numbers).
  useEffect(() => {
    async function load() {
      try {
        const [stockData, donorData] = await Promise.all([
          apiFetch('/stock'),
          apiFetch('/donors/available'),
        ]);
        setStock(stockData);
        setDonors(donorData.slice(0, 6));
      } catch (err) {
        setError('Backend-er sathe connect hocche na. Backend chalaccho to? (npm start)');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalUnits = stock.reduce((sum, s) => sum + (s.UnitsAvailable || 0), 0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">One Bag of Blood Can Save a Life</h1>
          <p className="mt-4 text-lg text-red-100">
            Find verified blood donors near you, request blood in minutes,
            and help hospitals save lives — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/donors" className="px-6 py-3 bg-white text-brand-600 font-bold rounded-md hover:bg-gray-100">
              Find a Donor
            </Link>
            <Link href="/donor-form" className="px-6 py-3 bg-brand-700 text-white font-bold rounded-md hover:bg-brand-700 border border-white">
              Become a Donor
            </Link>
          </div>
          <p className="mt-6 text-red-100">
            {loading ? 'Loading stock...' : totalUnits + ' bags of blood available right now'}
          </p>
        </div>
      </section>

      {/* Blood stock by group */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900">Blood Stock Right Now</h2>
        <p className="text-gray-600 mt-1">Live stock from the BloodBond database.</p>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {loading && <p className="mt-4 text-gray-600">Loading...</p>}
        {!loading && !error && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stock.map((s) => (
              <div key={s.BloodGroup} className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-brand-600">{s.BloodGroup}</p>
                <p className="text-gray-700 mt-1">{s.UnitsAvailable} bags</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Our Services */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
          <p className="text-gray-600 mt-1">Everything a donor, a patient and a hospital needs.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-3xl">♥</p>
              <h3 className="mt-3 text-lg font-bold">Find Donors</h3>
              <p className="mt-1 text-gray-600 text-sm">
                Search donors by blood group, division, district and upazila.
                Contact them only after login.
              </p>
              <Link href="/donors" className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                Search Donors
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-3xl">✚</p>
              <h3 className="mt-3 text-lg font-bold">Request Blood</h3>
              <p className="mt-1 text-gray-600 text-sm">
                Patients and hospitals (Acceptor) can request blood with
                group, bags, urgency and address. Admin approves it.
              </p>
              <Link href="/request" className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                Request Blood
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-3xl">⬢</p>
              <h3 className="mt-3 text-lg font-bold">Blood Stock</h3>
              <p className="mt-1 text-gray-600 text-sm">
                Admin manages the stock of all 8 blood groups.
                Every donation and issue is recorded.
              </p>
              <Link href="/services" className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                See Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Available donors preview */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available Donors</h2>
            <p className="text-gray-600 mt-1">Donors who can give blood now.</p>
          </div>
          <Link href="/donors" className="text-brand-600 font-medium hover:text-brand-700">
            See all →
          </Link>
        </div>
        {loading && <p className="mt-6 text-gray-600">Loading...</p>}
        {!loading && donors.length === 0 && !error && (
          <p className="mt-6 text-gray-600">No donors available right now.</p>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {donors.map((d) => (
            <DonorCard key={d.donorId} donor={d} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ['1', 'Register', 'Donor or Acceptor — register with your details. Admin approves you.'],
              ['2', 'Search', 'Find donors by blood group and your area.'],
              ['3', 'Contact', 'Login, then call or email the donor directly.'],
              ['4', 'Donate', 'After donating, update your status. You can donate again after 90 days.'],
            ].map(([n, title, text]) => (
              <div key={n} className="bg-white border border-gray-200 rounded-lg p-6">
                <span className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">{n}</span>
                <h3 className="mt-3 font-bold">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
