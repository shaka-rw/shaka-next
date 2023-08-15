import AppBar from '@/components/AppBar';
import HomeContent from '@/components/HomeContent';
import Navbar from '@/components/server/Navbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shaka',
  icons: { icon: '/logo.png' },
  description: 'Shaka e-commerce - Rwanda',
};

export default function Home() {
  return <HomeContent />;
}
export const dynamic = 'force-dynamic';
