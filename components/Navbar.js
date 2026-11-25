// BloodBond Frontend - top navigation bar (on every page)
// Shows different links for guests, Donor, Acceptor and Admin.
// "Available Blood" dropdown: Available Donors + Blood Banks.
// Login kora user-er dan dike nam ar role lekha thake NA - ekta GOL
// avatar button thake (chobi thakle chobi, na thakle nam-er initials).
// Avatar-er upor hover korle (desktop) ba click korle (mobile/touch)
// menu khule: nam + role, tarpor role onujai link (My Profile,
// Admin Dashboard, All Donors, Manage Banks, Team Members...), Logout.

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MdMenu, MdClose } from 'react-icons/md';
import { useAuth } from './AuthContext';
import Logo from './Logo';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Which desktop dropdown is open: 'blood' | 'avatar' | null.
  const [openMenu, setOpenMenu] = useState(null);
  // Which drawer accordion is open: 'blood' | null.
  const [mobileOpen, setMobileOpen] = useState(null);
  // Left slide-in drawer (mobile/tablet only) khola kina.
  const [drawerOpen, setDrawerOpen] = useState(false);
  const desktopNavRef = useRef(null);
  const avatarRef = useRef(null);

  // A dropdown parent is "active" when the current page is one of its children.
  const bloodActive = pathname === '/donors' || pathname === '/bloodbanks';
  const dashActive =
    pathname === '/admin' || pathname === '/admin/donors' || pathname === '/admin/bloodbanks' ||
    pathname === '/admin/team';
  // Avatar menu-ta active hobe jokhon tar kono link-er page khola thakbe.
  const avatarActive = pathname === '/profile' || pathname === '/request' || dashActive;

  // Avatar menu-r link - role onujai alada.
  const avatarLinks =
    !user ? [] :
    user.role === 'Donor' ? [
      { href: '/profile', label: 'My Profile' },
    ] :
    user.role === 'Acceptor' ? [
      { href: '/profile', label: 'My Profile' },
      { href: '/request', label: 'Request Blood' },
    ] :
    user.role === 'Admin' ? [
      { href: '/profile', label: 'My Profile' },
      { href: '/admin', label: 'Admin Dashboard' },
      { href: '/admin/donors', label: 'All Donors' },
      { href: '/admin/bloodbanks', label: 'Manage Banks' },
      { href: '/admin/team', label: 'Team Members' },
    ] : [];

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
      const inNav = desktopNavRef.current && desktopNavRef.current.contains(e.target);
      const inAvatar = avatarRef.current && avatarRef.current.contains(e.target);
      if (!inNav && !inAvatar) {
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
          </nav>

          {/* Right side: login / avatar menu */}
          <div className="flex items-center gap-2 shrink-0">
            {!user && (
              <>
                <Link href="/login" className="keep-hover px-3 py-2 text-xs sm:px-4 sm:text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white whitespace-nowrap">
                  Login
                </Link>
                <Link href="/login?next=/donor-form" className="keep-hover px-3 py-2 text-xs sm:px-4 sm:text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 whitespace-nowrap">
                  Become a Donor
                </Link>
              </>
            )}
            {user && (
              <div
                ref={avatarRef}
                className="relative"
                onMouseEnter={() => setOpenMenu('avatar')}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === 'avatar' ? null : 'avatar')}
                  aria-expanded={openMenu === 'avatar'}
                  aria-haspopup="true"
                  aria-label="Profile menu"
                  className={
                    'block rounded-full ring-2 ring-offset-2 ring-offset-white transition ' +
                    (avatarActive ? 'ring-brand-600' : 'ring-brand-500 hover:ring-brand-600')
                  }
                >
                  <Avatar photo={user.profilePhoto} name={user.fullName} className="w-10 h-10 text-sm" />
                </button>
                {openMenu === 'avatar' && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    {/* Header: boro avatar + nam + role */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                      <Avatar photo={user.profilePhoto} name={user.fullName} className="w-12 h-12 text-lg" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 break-words">{user.fullName}</p>
                        <p className="text-xs text-brand-600">{user.role}</p>
                      </div>
                    </div>
                    {avatarLinks.map((l) => (
                      <Link key={l.href} href={l.href} className={childClass(l.href)}>{l.label}</Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-brand-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
        </nav>

        {/* Bottom: user area - avatar + nam + role, tarpor link, tarpor Logout */}
        <div className="border-t border-gray-200 px-4 py-4 shrink-0">
          {user ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 pb-3 mb-1 border-b border-gray-100">
                <Avatar photo={user.profilePhoto} name={user.fullName} className="w-11 h-11 text-base ring-2 ring-brand-500" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 break-words">{user.fullName}</p>
                  <p className="text-xs text-brand-600">{user.role}</p>
                </div>
              </div>
              {avatarLinks.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setDrawerOpen(false)} className={linkClass(l.href)}>{l.label}</Link>
              ))}
              <button
                onClick={handleLogout}
                className="mt-1 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
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
