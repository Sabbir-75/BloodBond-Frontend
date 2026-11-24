// BloodBond Frontend - footer (on every page)

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-white">♥ BloodBond</p>
          <p className="mt-2 text-sm">
            Donor, acceptor and blood stock — one platform.
            One bag of blood can save a life.
          </p>
        </div>
        <div>
          <p className="font-bold text-white">Quick Links</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/donors" className="text-gray-300 hover:text-white">Available Donors</Link></li>
            <li><Link href="/donor-form" className="text-gray-300 hover:text-white">Become a Donor</Link></li>
            <li><Link href="/request" className="text-gray-300 hover:text-white">Request Blood</Link></li>
            <li><Link href="/services" className="text-gray-300 hover:text-white">Our Services</Link></li>
            <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-white">Emergency</p>
          <p className="mt-2 text-sm">
            Need blood urgently? Search donors by blood group and area,
            then call the donor directly after login.
          </p>
          <p className="mt-2 text-sm text-brand-100">
            BloodBond — Blood Donation Management System
          </p>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-400">
        © 2026 BloodBond. Built for CSE 2291 — Northern University Bangladesh.
      </div>
    </footer>
  );
}
