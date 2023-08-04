import Navbar from '@/components/server/Navbar';
import SideSection from '@/components/client/SideSection';
import React from 'react';
import CategoryBar from '@/components/client/CategoryBar';
import NewProductList from '@/components/server/NewProductList';

const Discover = () => {
  return (
    <div className=" flex-col grid items-start grid-cols-1 md:grid-cols-[auto,1fr] md:grid-rows-[auto,1fr]">
      <div className="col-span-2">
        <Navbar />
        <CategoryBar />
      </div>
      <div className="relative">
        <SideSection />
      </div>
      <NewProductList isDiscover />
    </div>
  );
};

export default Discover;
