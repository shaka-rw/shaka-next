import GuestHome from '@/components/GuestHome';
import AppBar from '@/components/AppBar';
import HomeContent from '@/components/HomeContent';
import { Metadata } from 'next';
import NewHome from '@/components/server/NewHome';
import { Suspense } from 'react';
import LoadingPage from './loading';

export const metadata: Metadata = {
  title: 'Shaka - Home',
  icons: { icon: '/logo.png' },
  description: 'Shaka e-commerce - Rwanda',
};

const HomePage = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <NewHome />
    </Suspense>
  );
};

export default HomePage;
// export const dynamic = 'force-dynamic';
