import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthProvider from './providers/AuthProvider';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/server/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shaka',
  icons: { icon: '/logo.png' },
  description: 'Shaka e-commerce - Rwanda',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="luxury">
      <body className={`flex min-h-screen flex-col ${inter.className}`}>
        <div className="flex-1">
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="top-right" />
        </div>
        <Footer />
      </body>
    </html>
  );
}
export const dynamic = 'force-dynamic';
