import AppBar from '@/components/AppBar';
import HomeContent from '@/components/HomeContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shaka',
  icons: { icon: '/logo.png' },
  description: 'Shaka e-commerce - Rwanda',
};

export default function Home() {
  return (
    <main className="grid min-h-screen grid-rows-[auto,1fr] grid-cols-[1fr]">
      <AppBar />
      {/* <Sidebar />  */}
      <div className="container mx-auto max-w-7xl">
        <HomeContent />
      </div>
    </main>
  );
}
export const dynamic = 'force-dynamic';
