// BloodBond Frontend - About page
// Our story, honest stats, why we do it, how it works, testimonials teaser, CTA.

import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import StatCounter from '@/components/StatCounter';
import LottiePlayer from '@/components/LottiePlayer';
import { TESTIMONIALS } from '@/lib/content';
import heartbeatData from '@/public/lottie/heartbeat.json';
import { MdBloodtype } from 'react-icons/md';

// Real photos (verified to load with HTTP 200, image/jpeg).
const BANNER_PHOTO =
  'https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1600&auto=format&fit=crop';
const STORY_PHOTO =
  'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop';

const STATS = [
  { value: 8, suffix: '', label: 'Blood Groups' },
  { value: 64, suffix: '', label: 'Districts Covered' },
  { value: 90, suffix: '', label: 'Day Safe Gap' },
  { value: 3, suffix: '', label: 'Lives Saved per Donation' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero banner */}
      <section className="relative overflow-hidden">
        <Image
          src={BANNER_PHOTO}
          alt="A nurse taking blood from a donor at a blood donation camp"
          width={1600}
          height={1067}
          className="w-full h-[280px] sm:h-[320px] md:h-[420px] object-cover animate-hero-zoom"
          priority
        />
        <div className="absolute inset-0 bg-brand-700/80 flex items-center">
          <div className="max-w-6xl mx-auto px-4 w-full animate-fade-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">About BloodBond</h1>
            <p className="mt-3 text-lg text-red-100 max-w-2xl">
              A blood donation management system built for Bangladesh —
              connecting donors, patients and hospitals in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <Reveal>
            <div>
              <p className="text-sm font-bold text-brand-600">Our Story</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
                Dedicated to Life, The Story of Our Blood Drive Initiative
              </h2>
              <p className="mt-4 text-gray-700">
                BloodBond started as a university project (CSE 2291, Northern University
                Bangladesh) with one simple problem: when someone needs blood urgently,
                finding a donor is slow, stressful and often comes down to luck and phone calls.
              </p>
              <p className="mt-3 text-gray-700">
                We built BloodBond so a family in Dhaka, Chattogram or any district can
                search donors by blood group and area, call them directly, and request
                blood from the stock — all in one place, free for everyone.
              </p>
              <p className="mt-3 text-gray-700">
                Donors register once, the admin approves them, and the 90-day rule keeps
                donating safe. Hospitals get a clear stock of all 8 blood groups.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={STORY_PHOTO}
                alt="One person holding another person's hand — care and support"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Honest stats */}
      <section className="bg-red-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-4xl font-bold text-brand-600">
                    <StatCounter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="font-bold text-gray-900 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why we do it */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 items-start">
          <Reveal>
            <div className="bg-brand-700 text-white rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold">Why We Do It</h2>
              <p className="mt-4 text-red-100">
                Every 2 seconds, someone in the world needs a blood transfusion.
                Yet only a small number of people who can donate actually do —
                fewer than 1 in 20 eligible people donate blood.
              </p>
              <p className="mt-3 text-red-100">
                We are here to close that gap — making donation simple, safe
                and rewarding, so no patient waits for blood that a donor nearby could give.
              </p>
              <LottiePlayer animationData={heartbeatData} className="w-40 h-24 mt-6" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">What BloodBond Does</h2>
              <div className="mt-4 space-y-4">
                {[
                  ['Find donors fast', 'Search by blood group, division, district and upazila — then call the donor directly after login.'],
                  ['Request blood safely', 'Acceptor accounts send a blood request with group, bags, urgency and hospital. Admin approves it.'],
                  ['Keep stock honest', 'All 8 blood groups, live counts, and every donation and issue recorded with transactions.'],
                  ['Protect the donor', 'The 90-day rule makes a donor eligible again automatically — never too soon.'],
                ].map(([title, text]) => (
                  <div key={title} className="flex gap-3">
                    <span className="text-brand-600 text-xl"><MdBloodtype size={23} fill='red' /></span>
                    <div>
                      <p className="font-bold text-gray-900">{title}</p>
                      <p className="text-sm text-gray-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works: 3 steps */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Reveal>
            <p className="text-sm font-bold text-brand-600 text-center">How It Works</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900 text-center">Giving Blood Made Easy, Here&apos;s How</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Register & Health Check', 'Register as a donor with your details and blood group. The admin approves your account. Only healthy donors give blood.'],
              ['02', 'Blood Donation', 'A patient finds you by blood group and area, then calls you. You donate at the hospital or blood drive.'],
              ['03', 'Rest & Save Lives', 'After donating, update your status and rest. You become eligible again after 90 days — and your blood can save up to 3 lives.'],
            ].map(([n, title, text], i) => (
              <Reveal key={n} delay={i * 100}>
                <div className="bg-white border border-gray-200 rounded-lg p-6 h-full card-lift">
                  <span className="inline-block px-3 py-1 rounded-md bg-brand-500 text-white font-bold text-lg">{n}</span>
                  <h3 className="mt-3 font-bold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials teaser */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <Reveal>
          <p className="text-sm font-bold text-brand-600">Testimonials</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Lives Changed: Donors &amp; Survivors</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {TESTIMONIALS.slice(0, 2).map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="bg-white border border-gray-200 rounded-lg p-6 h-full card-lift">
                <p className="text-brand-500 text-lg tracking-widest" aria-label="5 out of 5 stars">★★★★★</p>
                <p className="mt-3 text-gray-700">“{t.quote}”</p>
                <div className="mt-4 flex items-center gap-3">
                  <Image
                    src={t.photo}
                    alt={'Photo of ' + t.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <p className="text-sm text-brand-600">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden px-6 py-10 text-center text-white">

            {/* Background Image (scroll on mobile, fixed on md+ — see .cta-bg) */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat cta-bg"
              style={{
                backgroundImage: "url('https://i.ibb.co.com/39cMmt7L/image.png')",
              }}
            ></div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Every drop matters! Join us &amp; Be a Lifesaver!
              </h2>

              <p className="mt-3 text-red-100">
                Register as a donor today — it takes only a few minutes.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/donor-form"
                  className="keep-hover px-6 py-3 bg-white text-brand-600 font-bold rounded-md hover:bg-red-100 transition-colors"
                >
                  Become a Donor
                </Link>

                <Link
                  href="/donors"
                  className="keep-hover px-6 py-3 bg-brand-700 text-white font-bold rounded-md border border-white hover:bg-brand-500 transition-colors"
                >
                  Find Donors
                </Link>
              </div>
            </div>

          </div>
        </Reveal>
      </section>

    </div>
  );
}
