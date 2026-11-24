// BloodBond Frontend - Services page
// Every card links to its own real detail page (/services/<slug>).

import Link from 'next/link';
import { SERVICES } from '@/lib/services';
import Reveal from '@/components/Reveal';

export default function ServicesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Reveal>
        <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
        <p className="text-gray-600 mt-1">
          Everything a donor, a patient, a hospital and an admin needs — in one place.
          Click any service to see how it works.
        </p>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <Reveal key={s.slug}>
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full card-lift">
              <p className="text-3xl">{s.icon}</p>
              <h2 className="mt-3 text-lg font-bold text-gray-900">{s.title}</h2>
              <p className="mt-2 text-sm text-gray-600 flex-1">{s.short}</p>
              <Link href={'/services/' + s.slug} className="keep-hover inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 self-start">
                Learn More →
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
