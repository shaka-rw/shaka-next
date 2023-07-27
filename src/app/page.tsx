import GuestHome from '@/components/GuestHome';
import AppBar from '@/components/AppBar';
import HomeContent from '@/components/HomeContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shaka - Home',
  icons: { icon: '/logo.png' },
  description: 'Shaka e-commerce - Rwanda',
};

const HomePage = () => {
  return (
    <main className="grid min-h-screen grid-rows-[auto,1fr] grid-cols-[1fr]">
      <AppBar />
      {/* <Sidebar />  */}
      <div className="container mx-auto max-w-7xl">
        <GuestHome />
      </div>
    </main>
  );
};

export default HomePage;
