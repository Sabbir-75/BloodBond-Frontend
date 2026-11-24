// BloodBond Frontend - Home page
// Hero, stats, Blood Stock, Our Services, Available Donors preview,
// How It Works, About, Testimonials, Blood Drives, FAQ, CTA banner, Footer.

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';
import DonorCard from '@/components/DonorCard';
import Reveal from '@/components/Reveal';
import StatCounter from '@/components/StatCounter';
import LottiePlayer from '@/components/LottiePlayer';
import { TESTIMONIALS, DRIVES, FAQS } from '@/lib/content';
import heartbeatData from '@/public/lottie/heartbeat.json';
import heartMedicalData from '@/public/lottie/heart-medical.json';
import bloodDropData from '@/public/lottie/blood-drop.json';
import { MdAddLocation, MdOutlineMoreTime } from 'react-icons/md';
import { GiEternalLove } from 'react-icons/gi';

// Real photos (verified to load with HTTP 200, image/jpeg).
const HERO_PHOTO =
  'https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1600&auto=format&fit=crop';
const ABOUT_PHOTO =
  'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop';

// Honest numbers only — no invented donation counts.
const STATS = [
  { value: 8, suffix: '', label: 'Blood Groups', note: 'A+, A-, B+, B-, O+, O-, AB+, AB-' },
  { value: 64, suffix: '', label: 'Districts Covered', note: 'All 64 districts of Bangladesh' },
  { value: 90, suffix: '', label: 'Day Safe Gap', note: 'Wait 90 days between donations' },
  { value: 3, suffix: '', label: 'Lives Saved', note: 'One donation can save up to 3 lives' },
];

export default function HomePage() {
  const [stock, setStock] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  // Become a Donor: guests go to Login first, then come back here
  // (?next=/donor-form). Logged-in users go straight to the form.
  const { user } = useAuth();
  const donorHref = user ? '/donor-form' : '/login?next=/donor-form';

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
      {/* Hero: the blood-donation photo covers the WHOLE hero (full width +
          full height), with a light black overlay so the text and buttons
          stay easy to read. */}
      <section className="relative overflow-hidden bg-brand-700 text-white">
        <Image
          src={HERO_PHOTO}
          alt="A nurse taking blood from a donor at a blood donation camp"
          fill
          sizes="100vw"
          className="object-cover animate-hero-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-black/35" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="inline-flex items-center gap-2 bg-white/10 border border-white/30 rounded-full px-3 py-1 text-sm text-red-100">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse-ring" />
              BloodBond — Blood Donation Management System
            </p>
            <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
              Donate Blood, Keep the World Beating
            </h1>
            <p className="mt-4 text-lg text-white/90">
              Find verified blood donors near you, request blood in minutes,
              and help hospitals save lives — all in one place, free for everyone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/donors" className="keep-hover px-6 py-3 bg-white text-brand-600 font-bold rounded-md hover:bg-red-100">
                Find a Donor
              </Link>
              <Link href={donorHref} className="keep-hover px-6 py-3 bg-brand-500 text-white font-bold rounded-md border border-white hover:bg-brand-600">
                Become a Donor
              </Link>
            </div>
            <p className="mt-6 text-white/90 text-sm">
              8 blood groups • 64 districts • Free for everyone
            </p>
            <p className="mt-1 text-white/90 text-sm">
              {loading ? 'Loading stock...' : totalUnits + ' bags of blood available right now'}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <LottiePlayer animationData={heartbeatData} className="w-16 h-10 shrink-0" />
              <p className="text-sm text-white/90">Every 2 seconds, someone needs blood. Your donation can save a life today.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Animated stats (honest numbers only) */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-red-50 border border-red-100 rounded-lg p-5 text-center card-lift">
                <p className="text-4xl font-bold text-brand-600">
                  <StatCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="font-bold text-gray-900 mt-1">{s.label}</p>
                <p className="text-xs text-gray-600 mt-1">{s.note}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Blood stock by group */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <Reveal>
          <h2 className="text-2xl font-bold text-gray-900">Blood Stock Right Now</h2>
          <p className="text-gray-600 mt-1">Live stock from the BloodBond database.</p>
        </Reveal>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {loading && <p className="mt-4 text-gray-600">Loading...</p>}
        {!loading && !error && (
          <Reveal>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stock.map((s) => (
                <div key={s.BloodGroup} className="border border-gray-200 rounded-lg p-4 text-center card-lift">
                  <p className="text-2xl font-bold text-brand-600">{s.BloodGroup}</p>
                  <p className="text-gray-700 mt-1">{s.UnitsAvailable} bags</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </section>

      {/* Our Services */}
      <section className="bg-gray-50 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Reveal>
            <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
            <p className="text-gray-600 mt-1">Everything a donor, a patient and a hospital needs.</p>
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Reveal>
              <div className="bg-white border border-gray-200 rounded-lg p-6 h-full card-lift">
                <p className="text-3xl">♥</p>
                <h3 className="mt-3 text-lg font-bold">Find Donors</h3>
                <p className="mt-1 text-gray-600 text-sm">
                  Search donors by blood group, division, district and upazila.
                  Contact them only after login.
                </p>
                <Link href="/services/find-blood-donors" className="keep-hover inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                  Learn More →
                </Link>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="bg-white border border-gray-200 rounded-lg p-6 h-full card-lift">
                <p className="text-3xl">✚</p>
                <h3 className="mt-3 text-lg font-bold">Request Blood</h3>
                <p className="mt-1 text-gray-600 text-sm">
                  Patients and hospitals (Acceptor) can request blood with
                  group, bags, urgency and address. Admin approves it.
                </p>
                <Link href="/services/request-blood" className="keep-hover inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                  Learn More →
                </Link>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="bg-white border border-gray-200 rounded-lg p-6 h-full card-lift">
                <p className="text-3xl">⬢</p>
                <h3 className="mt-3 text-lg font-bold">Blood Stock</h3>
                <p className="mt-1 text-gray-600 text-sm">
                  Admin manages the stock of all 8 blood groups.
                  Every donation and issue is recorded.
                </p>
                <Link href="/services/blood-stock-management" className="keep-hover inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                  Learn More →
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal>
            <p className="mt-6 text-center">
              <Link href="/services" className="text-brand-600 font-medium hover:text-brand-700">
                See all 6 services →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Available donors preview */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Donors</h2>
              <p className="text-gray-600 mt-1">Donors who can give blood now.</p>
            </div>
            <Link href="/donors" className="text-brand-600 font-medium hover:text-brand-700">
              See all →
            </Link>
          </div>
        </Reveal>
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
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
                <p className="text-gray-600 mt-1">Four simple steps — from register to donation.</p>
              </div>
              <LottiePlayer animationData={heartMedicalData} className="w-40 h-28" />
            </div>
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ['1', 'Register', 'Donor or Acceptor — register with your details. Admin approves you.'],
              ['2', 'Search', 'Find donors by blood group and your area.'],
              ['3', 'Contact', 'Login, then call or email the donor directly.'],
              ['4', 'Donate', 'After donating, update your status. You can donate again after 90 days.'],
            ].map(([n, title, text], i) => (
              <Reveal key={n} delay={i * 100}>
                <div className="bg-white border border-gray-200 rounded-lg p-6 h-full card-lift">
                  <span className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">{n}</span>
                  <h3 className="mt-3 font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About BloodBond */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <Reveal>
            <div className="rounded-2xl overflow-hidden shadow-lg animate-float">
              <Image
                src={ABOUT_PHOTO}
                alt="One person holding another person's hand — care and support"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <p className="text-sm font-bold text-brand-600">About BloodBond</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">The Life You Save Could Be Yours.</h2>
              <p className="mt-4 text-gray-700">
                BloodBond connects blood donors with patients, accident victims, mothers, and children across all 64 districts of Bangladesh. We help patients and hospitals find the right blood group quickly while promoting safe donation through the 90-day rule. Blood donation is always free — no money involved.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {[
                  ['Your Blood, Their Second Chance', 'One donation can save up to 3 lives.'],
                  ['Urgent Need, Every Day', 'Every 2 seconds, someone needs blood.'],
                  ['Save Lives in Minutes', 'Search, call the donor, and help today.'],
                ].map(([title, text]) => (
                  <div key={title} className="flex gap-3">
                    <span className="text-brand-600 text-xl mt-0.5"><GiEternalLove size={22} fill='red' /></span>
                    <div>
                      <p className="font-bold text-gray-900">{title}</p>
                      <p className="text-sm text-gray-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/about" className="keep-hover inline-block mt-6 px-6 py-3 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                Read Our Story →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Reveal>
            <p className="text-sm font-bold text-brand-600">Testimonials</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">Lives Changed: What Donors &amp; Families Say</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
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
        </div>
      </section>

      {/* Upcoming blood drives */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <Reveal>
          <p className="text-sm font-bold text-brand-600">Upcoming Events &amp; Drives</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Don&apos;t Miss Out! Upcoming Blood Donation Events</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {DRIVES.map((d, i) => (
            <Reveal key={d.title} delay={i * 100}>
              <div className="bg-white border border-gray-200 rounded-lg p-6 h-full card-lift">
                <div>
                  <p className="text-sm font-bold text-brand-600">{d.date}</p>
                  <h3 className="mt-2 text-lg font-bold text-gray-900">{d.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 flex justify-start items-center gap-3 ml-0.5"><MdOutlineMoreTime size={20} fill='red' /> {d.time}</p>
                  <p className="mt-1.5 text-sm text-gray-600 flex justify-start items-center gap-3"><MdAddLocation size={22} fill='red' /> {d.venue}</p>
                </div>
                <Link href={donorHref} className="keep-hover inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                  Join as Donor
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ (animated accordion) */}
      <section className="bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Reveal>
            <h2 className="text-2xl font-bold text-gray-900 text-center">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-1 text-center">Everything you need to know about donating and requesting blood.</p>
          </Reveal>
          <div className="mt-8 space-y-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <Reveal key={f.q} delay={i * 50}>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium text-gray-900 hover:text-brand-600`}
                      aria-expanded={open}
                    >
                      {f.q}
                      <span className={'text-brand-600 text-xl shrink-0 transition-transform duration-300 ' + (open ? 'rotate-45' : '')}>+</span>
                    </button>
                    <div className={'accordion-body ' + (open ? 'open' : '')}>
                      <div className="accordion-inner">
                        <p className={'px-5 py-4 text-sm text-white bg-brand-600 ' + (open ? 'accordion-open-anim' : '')}>{f.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Red CTA banner */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden px-6 py-16 text-center text-white">

            {/* Fixed Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('https://i.ibb.co.com/39cMmt7L/image.png')",
                backgroundAttachment: "fixed",
              }}
            ></div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="mt-4 text-3xl font-bold max-w-[600px] mx-auto">
                Every drop matters! Join us at our next blood drive &amp; Be a Lifesaver!
              </h2>

              <p className="mt-3 text-red-100">
                Register as a donor today — it takes only a few minutes, and your blood can save up to 3 lives.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href={donorHref}
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
