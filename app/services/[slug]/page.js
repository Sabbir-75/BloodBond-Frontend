// BloodBond Frontend - one service detail page (/services/<slug>)
// Real content for every service: what it is, how it works (numbered steps),
// who it is for, and a button to the real action. No demo text.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SERVICES, getService } from '@/lib/services';
import Reveal from '@/components/Reveal';

// Build one static page for each of the 6 services.
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export default function ServiceDetailPage({ params }) {
  const service = getService(params.slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Reveal>
        <Link href="/services" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          ← All Services
        </Link>
        <p className="mt-6 text-4xl">{service.icon}</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">{service.title}</h1>
      </Reveal>

      {/* What is this service? */}
      <Reveal>
        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-5 sm:p-6 card-lift">
          <h2 className="text-lg font-bold text-gray-900">What is this service?</h2>
          <p className="mt-2 text-gray-700">{service.what}</p>
        </section>
      </Reveal>

      {/* How it works */}
      <Reveal>
        <section className="mt-6 bg-white border border-gray-200 rounded-lg p-5 sm:p-6 card-lift">
          <h2 className="text-lg font-bold text-gray-900">How it works</h2>
          <ol className="mt-4 space-y-3">
            {service.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-gray-700 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      {/* Who is it for? */}
      <Reveal>
        <section className="mt-6 bg-white border border-gray-200 rounded-lg p-5 sm:p-6 card-lift">
          <h2 className="text-lg font-bold text-gray-900">Who is it for?</h2>
          <p className="mt-2 text-gray-700">{service.who}</p>
          <Link
            href={service.cta.href}
            className="keep-hover inline-block mt-5 px-6 py-3 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
          >
            {service.cta.label} →
          </Link>
        </section>
      </Reveal>

      {/* Other services */}
      <Reveal>
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Other Services</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={'/services/' + s.slug}
                className="keep-hover bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 card-lift"
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="font-medium text-gray-900">{s.title}</span>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
