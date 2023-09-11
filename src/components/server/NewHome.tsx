/* eslint-disable @next/next/no-img-element */
import React, { Suspense } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import HomeCategories from './HomeCategories';
import Banner from './Banner';
import HomeShops from './HomeShops';
import HomeCategoriesSkeleton from './skeletons/HomeCategoriesSkeleton';
import HomeShopsSkeleton from './skeletons/HomeShopsSkeleton';
import HomeProducts from './HomeProducts';
import ProductsSkeleton from './skeletons/ProductsSkeleton';

const NewHome = async () => {
  return (
    <div>
      <Navbar notHome={false} />
      <Hero />
      <Suspense fallback={<HomeCategoriesSkeleton />}>
        <HomeCategories />
      </Suspense>
      <Suspense fallback={<ProductsSkeleton />}>
        <HomeProducts />
      </Suspense>
      <Banner
        title="E-wallet payments"
        desc="Quickly, easy payments with a personal e-wallet!"
        img={`/assets/imgs/card.jpg`}
      />
      <Suspense fallback={<HomeShopsSkeleton />}>
        <HomeShops />
      </Suspense>
      <Banner
        title="Premium"
        desc="Join Shaka Premium and get excellent perks & benefits!"
        img={`/assets/imgs/premium.jpg`}
      />
    </div>
  );
};

export default NewHome;
