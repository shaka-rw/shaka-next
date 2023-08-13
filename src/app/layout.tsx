import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthProvider from './providers/AuthProvider';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/server/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shaka',
  icons: { icon: '/logo.png' },
  description: 'Shaka e-commerce - Rwanda',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html
      lang="en"
      data-theme={
        (session?.user as any)?.theme === 'LIGHT' ? 'shaka-light' : 'shaka-dark'
      }
    >
      <body className={`flex min-h-screen flex-col ${inter.className}`}>
        <div className="flex-1">
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />
        </div>
        <Footer />
      </body>
    </html>
  );
}
export const dynamic = 'force-dynamic';
