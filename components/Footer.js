// BloodBond Frontend - footer (on every page)
// Deep red theme: logo, Quick Links, Contact Us, Newsletter (client-side only),
// social icons (decorative, no fake links), copyright line.

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

// Social icons as small inline SVGs (decorative only — no fake links).
function SocialIcon({ label, children }) {
  return (
    <span
      title={label}
      aria-label={label}
      className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
    >
      {children}
    </span>
  );
}

export default function Footer() {
  // Newsletter: client-side only. Typing an email + Subscribe shows thank-you.
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!newsEmail) return;
    setSubscribed(true);
  }

  const quickLinkClass =
    'keep-hover text-red-100 hover:text-white text-sm';

  return (
    <footer className="bg-brand-700 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        {/* Logo + about */}
        <div>
          <Logo light />
          <p className="mt-4 text-sm text-red-100">
            Donor, acceptor and blood stock — one platform.
            One bag of blood can save a life.
          </p>
          {/* Social icons (decorative — no fake links) */}
          <div className="mt-4 flex gap-2">
            <SocialIcon label="BloodBond on Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.5v7h3z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="BloodBond on Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
              </svg>
            </SocialIcon>
            <SocialIcon label="BloodBond on X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.7 3H21l-7.3 8.3L22 21h-6.6l-5.2-6.2L4.4 21H1l7.8-8.9L2.5 3h6.8l4.7 5.7L17.7 3zm-1.2 16h1.9L7.1 4.9H5.1L16.5 19z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="BloodBond on YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 8.2c-.2-1.4-1.4-2.4-2.8-2.6C17.7 5.3 15.9 5.2 12 5.2s-5.7.1-7.2.4C3.4 5.8 2.2 6.8 2 8.2 1.8 9.6 1.8 11.1 1.8 12s0 2.4.2 3.8c.2 1.4 1.4 2.4 2.8 2.6 1.5.3 3.3.4 7.2.4s5.7-.1 7.2-.4c1.4-.2 2.6-1.2 2.8-2.6.2-1.4.2-2.9.2-3.8s0-2.4-.2-3.8zM10 15.2V8.8l5.9 3.2L10 15.2z" />
              </svg>
            </SocialIcon>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <p className="font-bold text-white">Quick Links</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/" className={quickLinkClass}>Home</Link></li>
            <li><Link href="/donors" className={quickLinkClass}>Available Donors</Link></li>
            <li><Link href="/donor-form" className={quickLinkClass}>Become a Donor</Link></li>
            <li><Link href="/request" className={quickLinkClass}>Request Blood</Link></li>
            <li><Link href="/services" className={quickLinkClass}>Our Services</Link></li>
            <li><Link href="/about" className={quickLinkClass}>About Us</Link></li>
            <li><Link href="/contact" className={quickLinkClass}>Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact us */}
        <div>
          <p className="font-bold text-white">Contact Us</p>
          <p className="mt-3 text-sm text-red-100">BloodBond</p>
          <p className="text-sm text-red-100">Blood Donation Management System</p>
          <p className="text-sm text-red-100">CSE 2291, Northern University Bangladesh</p>
          <p className="text-sm text-red-100">Dhaka, Bangladesh</p>
          <p className="mt-3 text-sm text-red-100">
            Emergency? Go to Available Donors, find your blood group,
            login and call the donor.
          </p>
        </div>

        {/* Newsletter (client-side only) */}
        <div>
          <p className="font-bold text-white">Newsletter</p>
          <p className="mt-3 text-sm text-red-100">
            Subscribe to get blood drive news and updates.
          </p>
          {subscribed ? (
            <p className="mt-3 bg-white/10 border border-white/30 rounded-md p-3 text-sm text-white">
              Thank you for subscribing! You will get our blood drive updates.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
              <input
                type="email"
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                required
                placeholder="Your email"
                className="min-w-0 flex-1 px-3 py-2 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-brand-700 bg-white rounded-md hover:bg-red-100"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-white/20 py-4 text-center text-xs text-red-100">
        © 2026 BloodBond. All rights reserved.
      </div>
    </footer>
  );
}
