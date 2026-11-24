// BloodBond Frontend - top navigation bar (on every page)
// Shows different links for guests, Donor, Acceptor and Admin.
// "Available Blood" dropdown: Available Donors + Blood Banks.
// "Dashboard" dropdown (Admin only): Admin Dashboard + All Donors + Manage Banks.

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Which desktop dropdown is open: 'blood' | 'dashboard' | null.
  const [openMenu, setOpenMenu] = useState(null);
  // Which mobile accordion is open: 'blood' | 'dashboard' | null.
  const [mobileOpen, setMobileOpen] = useState(null);
  const desktopNavRef = useRef(null);

  // A dropdown parent is "active" when the current page is one of its children.
  const bloodActive = pathname === '/donors' || pathname === '/bloodbanks';
  const dashActive =
    pathname === '/admin' || pathname === '/admin/donors' || pathname === '/admin/bloodbanks';

  // Close menus when the route changes (after navigating to a child).
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(null);
  }, [pathname]);

  // Close the desktop dropdown on outside click or Escape.
  useEffect(() => {
    function onDocClick(e) {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpenMenu(null);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const linkClass = (href) => {
    const isActive = pathname === href;

    return (
      'px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-200 ' +
      (isActive
        ? 'bg-brand-500 !text-white hover:!text-white hover:bg-brand-500'
        : 'text-gray-700 hover:bg-brand-100 hover:text-gray-900')
    );
  };

  // Dropdown parent button: same look as an active/plain link.
  const parentClass = (isActive) =>
    'px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-200 inline-flex items-center gap-1.5 ' +
    (isActive
      ? 'bg-brand-500 !text-white hover:!text-white hover:bg-brand-500'
      : 'text-gray-700 hover:bg-brand-100 hover:text-gray-900');

  // Links inside a dropdown menu (keep-hover: the global a:hover rule
  // must not darken them).
  const childClass = (href) => {
    const isActive = pathname === href;
    return (
      'keep-hover block px-4 py-2 text-sm whitespace-nowrap transition-colors duration-200 ' +
      (isActive
        ? 'bg-brand-500 !text-white hover:!text-white hover:bg-brand-500'
        : 'text-gray-700 hover:bg-brand-100 hover:text-gray-900')
    );
  };

  function chevron(open) {
    return (
      <svg
        className={'w-3.5 h-3.5 shrink-0 transition-transform duration-200 ' + (open ? 'rotate-180' : '')}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between gap-2 h-16">
          {/* Logo: icon + BloodBond wordmark + tagline */}
          <Link href="/" className="keep-hover shrink-0" aria-label="BloodBond home">
            <Logo />
          </Link>

          {/* Page links (desktop, lg and up — at md the bar would overflow) */}
          <nav ref={desktopNavRef} className="hidden lg:flex items-center gap-1">
            <Link href="/" className={linkClass('/')}>Home</Link>

            {/* Available Blood dropdown (everyone) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'blood' ? null : 'blood')}
                aria-expanded={openMenu === 'blood'}
                aria-haspopup="true"
                className={parentClass(bloodActive)}
              >
                Available Blood {chevron(openMenu === 'blood')}
              </button>
              {openMenu === 'blood' && (
                <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  <Link href="/donors" className={childClass('/donors')}>Available Donors</Link>
                  <Link href="/bloodbanks" className={childClass('/bloodbanks')}>Blood Banks</Link>
                </div>
              )}
            </div>

            <Link href="/services" className={linkClass('/services')}>Services</Link>
            <Link href="/about" className={linkClass('/about')}>About</Link>
            <Link href="/contact" className={linkClass('/contact')}>Contact Us</Link>
            {user && user.role === 'Donor' && (
              <Link href="/profile" className={linkClass('/profile')}>My Profile</Link>
            )}
            {user && user.role === 'Acceptor' && (
              <Link href="/request" className={linkClass('/request')}>Request Blood</Link>
            )}

            {/* Dashboard dropdown (Admin only) */}
            {user && user.role === 'Admin' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === 'dashboard' ? null : 'dashboard')}
                  aria-expanded={openMenu === 'dashboard'}
                  aria-haspopup="true"
                  className={parentClass(dashActive)}
                >
                  Dashboard {chevron(openMenu === 'dashboard')}
                </button>
                {openMenu === 'dashboard' && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <Link href="/admin" className={childClass('/admin')}>Admin Dashboard</Link>
                    <Link href="/admin/donors" className={childClass('/admin/donors')}>All Donors</Link>
                    <Link href="/admin/bloodbanks" className={childClass('/admin/bloodbanks')}>Manage Banks</Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right side: login / user */}
          <div className="flex items-center gap-2 shrink-0">
            {!user && (
              <>
                <Link href="/login" className="keep-hover px-3 py-2 text-xs sm:px-4 sm:text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white whitespace-nowrap">
                  Login
                </Link>
                <Link href={user ? '/donor-form' : '/login?next=/donor-form'} className="keep-hover px-3 py-2 text-xs sm:px-4 sm:text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 whitespace-nowrap">
                  Become a Donor
                </Link>
              </>
            )}
            {user && (
              <>
                <span className="text-sm text-gray-700 hidden xl:block">
                  {user.fullName} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-xs sm:px-4 sm:text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile links (below lg) — groups are tap-to-expand accordions */}
        <nav className="lg:hidden flex flex-wrap gap-1 pb-3">
          <Link href="/" className={linkClass('/')}>Home</Link>

          {/* Available Blood accordion (everyone) */}
          <div className="w-full">
            <button
              type="button"
              onClick={() => setMobileOpen(mobileOpen === 'blood' ? null : 'blood')}
              aria-expanded={mobileOpen === 'blood'}
              className={parentClass(bloodActive) + ' w-full justify-between'}
            >
              <span>Available Blood</span> {chevron(mobileOpen === 'blood')}
            </button>
            {mobileOpen === 'blood' && (
              <div className="pl-4 mt-1 flex flex-col gap-1">
                <Link href="/donors" onClick={() => setMobileOpen(null)} className={linkClass('/donors')}>Available Donors</Link>
                <Link href="/bloodbanks" onClick={() => setMobileOpen(null)} className={linkClass('/bloodbanks')}>Blood Banks</Link>
              </div>
            )}
          </div>

          <Link href="/services" className={linkClass('/services')}>Services</Link>
          <Link href="/about" className={linkClass('/about')}>About</Link>
          <Link href="/contact" className={linkClass('/contact')}>Contact Us</Link>
          {user && user.role === 'Donor' && (
            <Link href="/profile" className={linkClass('/profile')}>My Profile</Link>
          )}
          {user && user.role === 'Acceptor' && (
            <Link href="/request" className={linkClass('/request')}>Request Blood</Link>
          )}

          {/* Dashboard accordion (Admin only) */}
          {user && user.role === 'Admin' && (
            <div className="w-full">
              <button
                type="button"
                onClick={() => setMobileOpen(mobileOpen === 'dashboard' ? null : 'dashboard')}
                aria-expanded={mobileOpen === 'dashboard'}
                className={parentClass(dashActive) + ' w-full justify-between'}
              >
                <span>Dashboard</span> {chevron(mobileOpen === 'dashboard')}
              </button>
              {mobileOpen === 'dashboard' && (
                <div className="pl-4 mt-1 flex flex-col gap-1">
                  <Link href="/admin" onClick={() => setMobileOpen(null)} className={linkClass('/admin')}>Admin Dashboard</Link>
                  <Link href="/admin/donors" onClick={() => setMobileOpen(null)} className={linkClass('/admin/donors')}>All Donors</Link>
                  <Link href="/admin/bloodbanks" onClick={() => setMobileOpen(null)} className={linkClass('/admin/bloodbanks')}>Manage Banks</Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
