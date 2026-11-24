// BloodBond Frontend - Blood Banks (login lagbe)
// Kon bank-e kon group-er koy bag ache - group onujai alada kore.
// Phone (tel:) / Email (mailto:) button diye bank-er sathe contact koro.

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, BLOOD_GROUPS } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';

export default function BloodBanksPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ready && !user) router.replace('/login?next=/bloodbanks');
  }, [ready, user, router]);

  // Load banks (login lagbe).
  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch('/bloodbanks');
        setBanks(data);
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

  // Proti group-er jonno: je bank-e oi group-er bag ache.
  function banksForGroup(group) {
    return banks.filter((b) => b.stock.some((s) => s.bloodGroup === group && s.units > 0));
  }

  function unitsForGroup(bank, group) {
    const s = bank.stock.find((x) => x.bloodGroup === group);
    return s ? s.units : 0;
  }

  // Mot koyta bag ache - shob bank miliye (summary line-er jonno).
  const totalBags = banks.reduce(
    (sum, b) => sum + b.stock.reduce((s2, x) => s2 + (x.units || 0), 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Blood Banks</h1>
      <p className="text-gray-600 mt-1">
        Kon bank-e kon group-er koy bag ache. Phone / Email button diye bank-er sathe contact koro.
      </p>

      {!loading && !error && (
        <p className="mt-2 text-sm font-medium text-gray-700">
          {banks.length === 1 ? '1 blood bank' : banks.length + ' blood banks'} •{' '}
          {totalBags === 1 ? '1 total bag' : totalBags + ' total bags'}
        </p>
      )}

      {loading && <p className="mt-8 text-gray-600">Loading blood banks...</p>}
      {error && <p className="mt-8 text-red-600">{error}</p>}

      {!loading && !error && BLOOD_GROUPS.map((group) => {
        const groupBanks = banksForGroup(group);
        return (
          <section key={group} className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">
              <span className="inline-block w-10 h-10 rounded-full bg-brand-500 text-white text-center leading-10 text-lg mr-2">{group}</span>
              {group} Blood
            </h2>
            {groupBanks.length === 0 && (
              <p className="mt-3 text-sm text-gray-500">Ei group-er kono bank-e bag nai ekhon.</p>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupBanks.map((b) => {
                const units = unitsForGroup(b, group);
                const mailSubject = 'Blood Needed: ' + group;
                const mailBody =
                  'Hello ' + b.bankName + ',\n\n' +
                  'I need ' + group + ' blood (' + units + ' bag' + (units === 1 ? '' : 's') + ' available).\n\nThank you.';
                return (
                  <div key={b.bankId} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col card-lift">
                    <h3 className="text-lg font-bold text-gray-900">{b.bankName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {b.upazila ? b.upazila + ', ' : ''}{b.district || ''}{b.division ? ', ' + b.division : ''}
                    </p>
                    {b.address && <p className="text-sm text-gray-600">{b.address}</p>}
                    <p className="mt-3 text-2xl font-bold text-brand-600">{units} bag{units === 1 ? '' : 's'} available</p>
                    <div className="mt-4 space-y-2">
                      {b.phone && (
                        <a
                          href={'tel:' + b.phone}
                          className="keep-hover block w-full text-center px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
                        >
                          Call {b.phone}
                        </a>
                      )}
                      {b.email && (
                        <a
                          href={'mailto:' + b.email + '?subject=' + encodeURIComponent(mailSubject) + '&body=' + encodeURIComponent(mailBody)}
                          className="keep-hover block w-full text-center px-4 py-2 text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white"
                        >
                          Email Bank
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
