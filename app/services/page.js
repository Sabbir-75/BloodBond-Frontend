// BloodBond Frontend - Services page

import Link from 'next/link';

const SERVICES = [
  {
    icon: '♥',
    title: 'Find Blood Donors',
    text: 'Search verified donors by blood group, division, district and upazila. Every donor card shows the blood group big and clear, with availability status — Available, Not Available, or Call to Confirm.',
    link: '/donors',
    linkText: 'Search Donors',
  },
  {
    icon: '✚',
    title: 'Request Blood',
    text: 'Patients and hospitals (Acceptor) can request blood with group, number of bags, urgency and address. Admin reviews and approves every request.',
    link: '/request',
    linkText: 'Request Blood',
  },
  {
    icon: '⬢',
    title: 'Blood Stock Management',
    text: 'Admin keeps the stock of all 8 blood groups up to date. Every donation adds stock, every issue from stock removes it — with transactions, so stock never goes wrong.',
    link: '/',
    linkText: 'See Stock on Home',
  },
  {
    icon: '✓',
    title: 'Donor Registration',
    text: 'Anyone can register as a donor with full details — blood group, address, occupation and availability status. Admin approves the account, then the donor appears in search.',
    link: '/donor-form',
    linkText: 'Become a Donor',
  },
  {
    icon: '◷',
    title: '90-Day Donation Rule',
    text: 'After donating, a donor cannot donate for 3 months. The system counts 90 days from the last donation date and makes the donor eligible again automatically.',
    link: '/donors',
    linkText: 'See Eligible Donors',
  },
  {
    icon: '☎',
    title: 'Direct Contact',
    text: 'After login, you can call a donor directly (tel:) or send a prefilled email request (mailto:) with blood group, bags and address already written.',
    link: '/login',
    linkText: 'Login',
  },
];

export default function ServicesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
      <p className="text-gray-600 mt-1">
        Everything a donor, a patient, a hospital and an admin needs — in one place.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <div key={s.title} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
            <p className="text-3xl">{s.icon}</p>
            <h2 className="mt-3 text-lg font-bold text-gray-900">{s.title}</h2>
            <p className="mt-2 text-sm text-gray-600 flex-1">{s.text}</p>
            <Link href={s.link} className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 self-start">
              {s.linkText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
