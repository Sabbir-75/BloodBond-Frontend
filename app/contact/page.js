// BloodBond Frontend - Contact Us page
// Simple form: shows a success message after submit (no server email is claimed).

'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Name, email ar message — sob gulo lagbe.');
      return;
    }
    setError('');
    setSent(true);
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
      <p className="text-gray-600 mt-1">
        Question, suggestion, or an emergency blood need? Write to us.
      </p>

      {sent ? (
        <div className="mt-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-5">
          <p className="font-bold">Thank you, {name}!</p>
          <p className="mt-1 text-sm">
            Your message has been noted. For urgent blood needs, please search
            donors directly from the Available Donors page.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className={inputClass} placeholder="Write your message here..." />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
            Send Message
          </button>
        </form>
      )}

      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-bold text-gray-900">BloodBond</h2>
        <p className="text-sm text-gray-600 mt-1">
          Blood Donation Management System — CSE 2291, Northern University Bangladesh.
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Emergency? Go to Available Donors, find your blood group, login and call the donor.
        </p>
      </div>
    </div>
  );
}
