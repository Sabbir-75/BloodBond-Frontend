// BloodBond Frontend - top navigation bar (on every page)
// Shows different links for guests, Donor, Acceptor and Admin.
// "Available Blood" dropdown: Available Donors + Blood Banks.
// "Dashboard" dropdown (Admin only): Admin Dashboard + All Donors + Manage Banks.

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MdMenu, MdClose } from 'react-icons/md';
import { useAuth } from './AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Which desktop dropdown is open: 'blood' | 'dashboard' | null.
  const [openMenu, setOpenMenu] = useState(null);
  // Which drawer accordion is open: 'blood' | 'dashboard' | null.
  const [mobileOpen, setMobileOpen] = useState(null);
  // Left slide-in drawer (mobile/tablet only) khola kina.
  const [drawerOpen, setDrawerOpen] = useState(false);
  const desktopNavRef = useRef(null);

  // A dropdown parent is "active" when the current page is one of its children.
  const bloodActive = pathname === '/donors' || pathname === '/bloodbanks';
  const dashActive =
    pathname === '/admin' || pathname === '/admin/donors' || pathname === '/admin/bloodbanks';

  // Close menus when the route changes (after navigating to a child).
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(null);
    setDrawerOpen(false);
  }, [pathname]);

  // Close the desktop dropdown on outside click or Escape.
  // Escape drawer-tao bondho korbe.
  useEffect(() => {
    function onDocClick(e) {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setDrawerOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Drawer khola thakle pichoner page scroll hobe na.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

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
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between gap-2 h-16">
            <div className="flex items-center gap-1 shrink-0">
              {/* Hamburger (mobile/tablet only) - left drawer khulbe */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Menu kholo"
                aria-expanded={drawerOpen}
                className="lg:hidden p-2 -ml-2 rounded-md text-gray-700 hover:bg-brand-100"
              >
                <MdMenu size={24} />
              </button>
              {/* Logo: icon + BloodBond wordmark + tagline */}
              <Link href="/" className="keep-hover shrink-0" aria-label="BloodBond home">
                <Logo />
              </Link>
            </div>

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

      </div>
    </header>

    {/* Dark overlay - click korle drawer bondho hobe (mobile/tablet only) */}
    {drawerOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
    )}

    {/* Left slide-in drawer (mobile/tablet only) - baam dik theke ashe */}
    <div
      className={
        'fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white shadow-xl z-[60] lg:hidden ' +
        'transition-transform duration-300 ease-in-out ' +
        (drawerOpen ? 'translate-x-0' : '-translate-x-full')
      }
      aria-hidden={!drawerOpen}
    >
      <div className="flex flex-col h-full">
        {/* Top: logo + close button */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 shrink-0">
          <Link href="/" onClick={() => setDrawerOpen(false)} className="keep-hover shrink-0" aria-label="BloodBond home">
            <Logo />
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Menu bondho koro"
            className="p-2 -mr-2 rounded-md text-gray-700 hover:bg-brand-100"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Menu items - beshi hole scroll hobe */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
          <Link href="/" onClick={() => setDrawerOpen(false)} className={linkClass('/')}>Home</Link>

          {/* Available Blood accordion (everyone) */}
          <div>
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
                <Link href="/donors" onClick={() => setDrawerOpen(false)} className={linkClass('/donors')}>Available Donors</Link>
                <Link href="/bloodbanks" onClick={() => setDrawerOpen(false)} className={linkClass('/bloodbanks')}>Blood Banks</Link>
              </div>
            )}
          </div>

          <Link href="/services" onClick={() => setDrawerOpen(false)} className={linkClass('/services')}>Services</Link>
          <Link href="/about" onClick={() => setDrawerOpen(false)} className={linkClass('/about')}>About</Link>
          <Link href="/contact" onClick={() => setDrawerOpen(false)} className={linkClass('/contact')}>Contact Us</Link>
          {user && user.role === 'Donor' && (
            <Link href="/profile" onClick={() => setDrawerOpen(false)} className={linkClass('/profile')}>My Profile</Link>
          )}
          {user && user.role === 'Acceptor' && (
            <Link href="/request" onClick={() => setDrawerOpen(false)} className={linkClass('/request')}>Request Blood</Link>
          )}

          {/* Dashboard accordion (Admin only) */}
          {user && user.role === 'Admin' && (
            <div>
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
                  <Link href="/admin" onClick={() => setDrawerOpen(false)} className={linkClass('/admin')}>Admin Dashboard</Link>
                  <Link href="/admin/donors" onClick={() => setDrawerOpen(false)} className={linkClass('/admin/donors')}>All Donors</Link>
                  <Link href="/admin/bloodbanks" onClick={() => setDrawerOpen(false)} className={linkClass('/admin/bloodbanks')}>Manage Banks</Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Bottom: user / login */}
        <div className="border-t border-gray-200 px-4 py-4 shrink-0">
          {user ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-700 break-words">{user.fullName} ({user.role})</p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setDrawerOpen(false)} className="keep-hover px-4 py-2 text-sm font-medium text-center text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white">
                Login
              </Link>
              <Link href="/login?next=/donor-form" onClick={() => setDrawerOpen(false)} className="keep-hover px-4 py-2 text-sm font-medium text-center text-white bg-brand-500 rounded-md hover:bg-brand-600">
                Become a Donor
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
