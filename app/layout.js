// BloodBond Frontend - root layout (Navbar + Footer on every page)

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/components/AuthContext';

export const metadata = {
  title: 'BloodBond - Blood Donation Management System',
  description: 'Find blood donors, request blood, and manage blood stock in one place.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
