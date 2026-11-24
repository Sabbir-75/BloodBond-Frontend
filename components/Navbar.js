// BloodBond Frontend - top navigation bar (on every page)
// Shows different links for guests, Donor, Acceptor and Admin.

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();


  const linkClass = (href) => {
    const isActive = pathname === href;

    return (
      'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ' +
      (isActive
        ? 'bg-brand-500 !text-white hover:!text-white hover:bg-brand-500'
        : 'text-gray-700 hover:bg-brand-100 hover:text-gray-900')
    );
  };


  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo: icon + BloodBond wordmark + tagline */}
          <Link href="/" className="keep-hover" aria-label="BloodBond home">
            <Logo />
          </Link>

          {/* Page links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className={linkClass('/')}>Home</Link>
            <Link href="/donors" className={linkClass('/donors')}>Available Donors</Link>
            <Link href="/services" className={linkClass('/services')}>Services</Link>
            <Link href="/about" className={linkClass('/about')}>About</Link>
            <Link href="/contact" className={linkClass('/contact')}>Contact Us</Link>
            {user && user.role === 'Donor' && (
              <Link href="/profile" className={linkClass('/profile')}>My Profile</Link>
            )}
            {user && user.role === 'Acceptor' && (
              <Link href="/request" className={linkClass('/request')}>Request Blood</Link>
            )}
            {user && (
              <Link href="/bloodbanks" className={linkClass('/bloodbanks')}>Blood Banks</Link>
            )}
            {user && user.role === 'Admin' && (
              <Link href="/admin" className={linkClass('/admin')}>Admin Dashboard</Link>
            )}
            {user && user.role === 'Admin' && (
              <Link href="/admin/donors" className={linkClass('/admin/donors')}>All Donors</Link>
            )}
            {user && user.role === 'Admin' && (
              <Link href="/admin/bloodbanks" className={linkClass('/admin/bloodbanks')}>Manage Banks</Link>
            )}
          </nav>

          {/* Right side: login / user */}
          <div className="flex items-center gap-2">
            {!user && (
              <>
                <Link href="/login" className="keep-hover px-4 py-2 text-sm font-medium text-brand-600 border border-brand-500 rounded-md hover:bg-brand-500 hover:text-white">
                  Login
                </Link>
                <Link href={user ? '/donor-form' : '/login?next=/donor-form'} className="keep-hover px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                  Become a Donor
                </Link>
              </>
            )}
            {user && (
              <>
                <span className="text-sm text-gray-700 hidden sm:block">
                  {user.fullName} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile links (small screen) */}
        <nav className="md:hidden flex flex-wrap gap-1 pb-3">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <Link href="/donors" className={linkClass('/donors')}>Available Donors</Link>
          <Link href="/services" className={linkClass('/services')}>Services</Link>
          <Link href="/about" className={linkClass('/about')}>About</Link>
          <Link href="/contact" className={linkClass('/contact')}>Contact Us</Link>
          {user && user.role === 'Donor' && (
            <Link href="/profile" className={linkClass('/profile')}>My Profile</Link>
          )}
          {user && user.role === 'Acceptor' && (
            <Link href="/request" className={linkClass('/request')}>Request Blood</Link>
          )}
          {user && (
            <Link href="/bloodbanks" className={linkClass('/bloodbanks')}>Blood Banks</Link>
          )}
          {user && user.role === 'Admin' && (
            <Link href="/admin" className={linkClass('/admin')}>Admin Dashboard</Link>
          )}
          {user && user.role === 'Admin' && (
            <Link href="/admin/donors" className={linkClass('/admin/donors')}>All Donors</Link>
          )}
          {user && user.role === 'Admin' && (
            <Link href="/admin/bloodbanks" className={linkClass('/admin/bloodbanks')}>Manage Banks</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
