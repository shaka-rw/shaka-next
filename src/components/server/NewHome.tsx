/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Navbar from './Navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/prima';
import Hero from './Hero';
import HomeCategories from './HomeCategories';
import Products from './Products';
import Banner from './Banner';
import HomeShops from './HomeShops';

const NewHome = async () => {
  const session = await getServerSession(authOptions);

  const products = await prisma.product.findMany({
    where: {
      AND: { quantities: { some: { quantity: { gt: 0 } } }, available: true },
    },
    include: {
      mainImage: true,
      shop: { include: { image: true, category: true } },
      categories: { include: { image: true } },
      quantities: {
        where: { quantity: { gt: 0 } },
        distinct: ['productColorId', 'productSizeId'],
        include: { color: { include: { mainImage: true } }, size: true },
      },
      sizes: true,
      colors: { include: { mainImage: true, images: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany({
    take: 100,
    where: { parent: null },
    include: { image: true },
  });
  const shops = await prisma.shop.findMany({
    take: 100,
    include: { image: true },
  });

  return (
    <div>
      <Navbar notHome={false} />
      <Hero />

      <HomeCategories categories={categories} />
      <div className="flex container mx-auto flex-col gap-3">
        <h3 className="text-2xl mb-5 font-bold">Top Products</h3>
        <Products products={products} />
      </div>
      <Banner
        title="E-wallet payments"
        desc="Quickly, easy payments with a personal e-wallet!"
        img={`/assets/imgs/card.jpg`}
      />
      <HomeShops />
      <Banner
        title="Premium"
        desc="Join Shaka Premium and get excellent perks & benefits!"
        img={`/assets/imgs/premium.jpg`}
      />
    </div>
  );
};

export default NewHome;
