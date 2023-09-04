import React from 'react';

import AppBar from '@/components/AppBar';
import HomeContent from '@/components/HomeContent';
import { Metadata } from 'next';
import CategoryList from '@/components/CategoryList';
import ShopList from '@/components/server/ShopList';
import ProductList from '@/components/ProductList';
import prisma from '@/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export const metadata: Metadata = {
  title: 'Shaka',
  icons: { icon: '/logo.png' },
  description: 'Shaka e-commerce - Rwanda',
};

export default async function DiscoverPage() {
  const products = await prisma.product.findMany({
    include: { images: true, shop: true, categories: true, sizes: true },
    orderBy: { createdAt: 'desc' },
  });
  const categories = await prisma.category.findMany();
  const shops = await prisma.shop.findMany();
  const user = (await getServerSession(authOptions)).user;
  return (
    <main className="grid min-h-screen grid-rows-[auto,1fr] grid-cols-[1fr]">
      <AppBar />
      {/* <Sidebar />  */}
      <div className="container mx-auto max-w-7xl">
        <div className="p-3">
          <CategoryList categories={categories} />
          <div className="divider"></div>
          <ShopList user={user} shops={shops} />
          <div className="divider"></div>
          <div>
            <h3 className="font-bold m-2 mt-3 text-2xl uppercase">Products</h3>
          </div>
          <ProductList products={products} />
        </div>
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic"
