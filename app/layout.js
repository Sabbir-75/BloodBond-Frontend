// BloodBond Frontend - root layout (Navbar + Footer on every page)

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/components/AuthContext';
import { FAVICON_DATA_URI } from '@/lib/logoData';
import { Poppins } from 'next/font/google';

// Poppins: the closest free Google Font to Google Sans (Google Sans itself
// is Google's private font and cannot be used on a website).
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'BloodBond - Blood Donation Management System',
  description: 'Find blood donors, request blood, and manage blood stock in one place.',
  // Favicon: the white rounded-square BloodBond mark, embedded as a data URI
  // (see lib/logoData.js — the PNG file itself cannot be pushed to GitHub).
  icons: { icon: FAVICON_DATA_URI },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
