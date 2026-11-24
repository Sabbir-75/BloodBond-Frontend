// BloodBond Frontend - one donor card (used on Home + Available Donors page)
// Blood group is shown BIG in red. Contact is hidden until login (project rule):
// the View Contact button goes to the Login page for guests.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from './AuthContext';

// Status badge colors: Yes = green, No = red, NotSure = amber.
function statusBadge(status) {
  if (status === 'Yes') return 'bg-green-100 text-green-800';
  if (status === 'No') return 'bg-red-100 text-red-800';
  return 'bg-amber-100 text-amber-800';
}

function statusText(status) {
  if (status === 'Yes') return 'Available';
  if (status === 'No') return 'Not Available';
  return 'Call to Confirm';
}

// Format a date as 12 Aug 2026. Empty date = '-'.
function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DonorCard({ donor }) {
  const { user } = useAuth();
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // View Contact button: guest -> Login page. Logged in -> load phone/email from API.
  async function handleContact() {
    if (!user) {
      router.push('/login');
      return;
    }
    if (contact) {
      setContact(null);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/donors/' + donor.donorId + '/contact');
      setContact(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Prefilled email request (mailto): blood group, bags, address - ready to Send.
  // Only built when contact is loaded (never a fake '#' link).
  const mailSubject = 'Blood Needed: ' + donor.bloodGroup;
  const mailBody =
    'Hello ' + donor.fullName + ',\n\n' +
    'I need ' + donor.bloodGroup + ' blood (1-2 bags).\n' +
    'My address: \n\nThank you.';
  const mailtoLink =
    contact && contact.Email
      ? 'mailto:' + contact.Email +
        '?subject=' + encodeURIComponent(mailSubject) +
        '&body=' + encodeURIComponent(mailBody)
      : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col card-lift">
      {/* Blood group - big and red */}
      <div className="flex items-start justify-between">
        <span className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center text-2xl font-bold">
          {donor.bloodGroup}
        </span>
        <span className={'text-xs font-medium px-2 py-1 rounded-full ' + statusBadge(donor.availabilityStatus)}>
          {statusText(donor.availabilityStatus)}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold text-gray-900">{donor.fullName}</h3>
      <p className="text-sm text-gray-600">{donor.occupation || '-'}</p>
      <p className="text-sm text-gray-600 mt-1">
        {donor.upazila ? donor.upazila + ', ' : ''}{donor.district}, {donor.division}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        Next eligible: {donor.isEligible ? 'Now' : formatDate(donor.nextEligibleDate)}
      </p>

      {/* Contact area (only after View Contact) */}
      {contact && (
        <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
          <a
            href={'tel:' + contact.Phone}
            className="keep-hover block w-full text-center px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
          >
            Call {contact.Phone || 'Donor'}
          </a>
          {mailtoLink && (
            <a
              href={mailtoLink}
              className="keep-hover block w-full text-center px-4 py-2 text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white"
            >
              Email Donor
            </a>
          )}
          <p className="text-xs text-gray-500">
            Email opens ready to send: blood group, bags and address included.
          </p>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        onClick={handleContact}
        disabled={loading}
        className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : contact ? 'Hide Contact' : 'View Contact'}
      </button>
      {!user && (
        <p className="mt-2 text-xs text-gray-500 text-center">Login to see phone &amp; email.</p>
      )}
    </div>
  );
}
