import './globals.css';
import 'simplebar-react/dist/simplebar.min.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from './providers/AuthProvider';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/server/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shaka',
  icons: { icon: '/logo.png' },
  description: 'Shaka e-commerce - Rwanda',
  keywords: [
    'ecommerce',
    'rwanda',
    'shaka',
    'shopping',
    'cosmetics',
    'kigali',
    'fashion',
    'delivery',
    'buy',
    'sell',
    'electronics',
    'market',
    'online',
  ],
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
        (session?.user as any)?.theme === 'DARK' ? 'shaka-dark' : 'shaka-light'
      }
    >
      <body className={`flex min-h-screen flex-col ${inter.className}`}>
        <SessionProvider>
          <div className="flex-1">
            {children}
            <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />
          </div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
export const dynamic = 'force-dynamic';
